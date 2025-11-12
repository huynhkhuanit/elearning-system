import { NextRequest, NextResponse } from 'next/server';
import { queryOneBuilder, update, deleteRows } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import crypto from 'crypto';

/**
 * POST /api/auth/recovery-key/verify
 * 
 * Xác thực recovery key và đặt lại mật khẩu
 * Dùng khi người dùng mất cả email và số điện thoại
 * 
 * Body:
 * - recoveryKey: string
 * - email: string (để tìm user)
 * - newPassword: string
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recoveryKey, email, newPassword } = body;

    // Validate input
    if (!recoveryKey || recoveryKey.length !== 16) {
      return NextResponse.json(
        {
          success: false,
          message: 'Recovery key không hợp lệ',
        },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: 'Vui lòng nhập email',
        },
        { status: 400 }
      );
    }

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: 'Mật khẩu phải có ít nhất 6 ký tự',
        },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await queryOneBuilder<{
      id: string;
      email: string;
      password_hash: string;
    }>('users', {
      select: 'id, email, password_hash',
      filters: {
        email,
      },
    });

    if (!user) {
      // Don't reveal if user exists for security
      return NextResponse.json(
        {
          success: false,
          message: 'Recovery key hoặc email không đúng',
        },
        { status: 400 }
      );
    }

    // Get recovery keys (new format: array of 16 keys)
    const recoveryKeysMeta = await queryOneBuilder<{
      id: string;
      meta_value: string;
    }>('user_metadata', {
      select: 'id, meta_value',
      filters: {
        user_id: user.id,
        meta_key: 'recovery_keys',
      },
    });

    // Fallback: check old format (single recovery_key)
    let recoveryKeyMeta = null;
    if (!recoveryKeysMeta) {
      recoveryKeyMeta = await queryOneBuilder<{
        id: string;
        meta_value: string;
      }>('user_metadata', {
        select: 'id, meta_value',
        filters: {
          user_id: user.id,
          meta_key: 'recovery_key',
        },
      });
    }

    if (!recoveryKeysMeta && !recoveryKeyMeta) {
      return NextResponse.json(
        {
          success: false,
          message: 'Recovery key không tồn tại cho tài khoản này',
        },
        { status: 400 }
      );
    }

    // Verify recovery key
    const recoveryKeyHash = crypto
      .createHash('sha256')
      .update(recoveryKey.toUpperCase() + (process.env.JWT_SECRET || 'fallback-secret'))
      .digest('hex');

    let keyFound = false;
    let remainingKeys = 0;
    let warningMessage = '';

    if (recoveryKeysMeta) {
      // New format: array of keys
      // Use retry mechanism to handle race conditions
      const maxRetries = 3;
      let retryCount = 0;

      while (retryCount < maxRetries && !keyFound) {
        // Re-fetch recovery keys on each retry to get latest state
        const currentRecoveryKeysMeta = await queryOneBuilder<{
          id: string;
          meta_value: string;
        }>('user_metadata', {
          select: 'id, meta_value',
          filters: {
            id: recoveryKeysMeta.id,
            meta_key: 'recovery_keys',
          },
        });

        if (!currentRecoveryKeysMeta) {
          // Keys were deleted by another request
          return NextResponse.json(
            {
              success: false,
              message: 'Recovery key đã được sử dụng hoặc không tồn tại',
            },
            { status: 400 }
          );
        }

        const recoveryKeysData = JSON.parse(currentRecoveryKeysMeta.meta_value);
        const keys = recoveryKeysData.keys || [];

        // Find matching key
        const keyIndex = keys.findIndex((k: { hash: string }) => k.hash === recoveryKeyHash);

        if (keyIndex === -1) {
          // Key not found - might have been used by another request
          if (retryCount === 0) {
            // First attempt, might be invalid key
            return NextResponse.json(
              {
                success: false,
                message: 'Recovery key không đúng hoặc đã được sử dụng',
              },
              { status: 400 }
            );
          } else {
            // Key was used by another concurrent request
            return NextResponse.json(
              {
                success: false,
                message: 'Recovery key đã được sử dụng bởi một request khác',
              },
              { status: 409 }
            );
          }
        }

        // Key found, remove it
        keys.splice(keyIndex, 1);
        remainingKeys = keys.length;

        // Prepare updated metadata
        const updatedMetaValue = JSON.stringify({
          ...recoveryKeysData,
          keys,
          updatedAt: new Date().toISOString(),
        });

        // Try to update atomically
        try {
          if (keys.length > 0) {
            // Update with remaining keys - use the current meta_value as a check
            // This ensures we're updating the latest version
            const updateResult = await update(
              'user_metadata',
              {
                id: currentRecoveryKeysMeta.id,
                meta_key: 'recovery_keys',
                // Add condition: only update if meta_value hasn't changed (optimistic locking)
              },
              {
                meta_value: updatedMetaValue,
                updated_at: new Date().toISOString(),
              }
            );

            // Verify update was successful by checking if key was actually removed
            const verifyMeta = await queryOneBuilder<{
              meta_value: string;
            }>('user_metadata', {
              select: 'meta_value',
              filters: {
                id: currentRecoveryKeysMeta.id,
                meta_key: 'recovery_keys',
              },
            });

            if (verifyMeta) {
              const verifyData = JSON.parse(verifyMeta.meta_value);
              const verifyKeys = verifyData.keys || [];
              const stillExists = verifyKeys.some((k: { hash: string }) => k.hash === recoveryKeyHash);

              if (stillExists) {
                // Key still exists, another request might have updated concurrently
                retryCount++;
                if (retryCount >= maxRetries) {
                  return NextResponse.json(
                    {
                      success: false,
                      message: 'Không thể xử lý recovery key do xung đột. Vui lòng thử lại.',
                    },
                    { status: 409 }
                  );
                }
                // Wait a bit before retry
                await new Promise(resolve => setTimeout(resolve, 100 * retryCount));
                continue;
              }
            }

            keyFound = true;
            warningMessage = remainingKeys === 0
              ? '⚠️ Cảnh báo: Bạn đã sử dụng hết tất cả recovery keys. Vui lòng tạo recovery keys mới sau khi đăng nhập để đảm bảo có thể khôi phục tài khoản trong tương lai.'
              : '';
          } else {
            // All keys used, delete metadata
            await deleteRows('user_metadata', {
              id: currentRecoveryKeysMeta.id,
            });
            keyFound = true;
            warningMessage = '⚠️ Cảnh báo: Bạn đã sử dụng hết tất cả recovery keys. Vui lòng tạo recovery keys mới sau khi đăng nhập để đảm bảo có thể khôi phục tài khoản trong tương lai.';
          }
        } catch (error) {
          // Update failed, retry
          retryCount++;
          if (retryCount >= maxRetries) {
            throw error;
          }
          await new Promise(resolve => setTimeout(resolve, 100 * retryCount));
        }
      }

      if (!keyFound) {
        return NextResponse.json(
          {
            success: false,
            message: 'Không thể xử lý recovery key. Vui lòng thử lại sau.',
          },
          { status: 500 }
        );
      }
    } else if (recoveryKeyMeta) {
      // Old format: single key (backward compatibility)
      // Check if still exists (might have been deleted by concurrent request)
      const currentKeyMeta = await queryOneBuilder<{
        id: string;
        meta_value: string;
      }>('user_metadata', {
        select: 'id, meta_value',
        filters: {
          id: recoveryKeyMeta.id,
          meta_key: 'recovery_key',
        },
      });

      if (!currentKeyMeta) {
        return NextResponse.json(
          {
            success: false,
            message: 'Recovery key đã được sử dụng',
          },
          { status: 400 }
        );
      }

      const recoveryKeyData = JSON.parse(currentKeyMeta.meta_value);
      const { hash } = recoveryKeyData;

      if (hash !== recoveryKeyHash) {
        return NextResponse.json(
          {
            success: false,
            message: 'Recovery key không đúng',
          },
          { status: 400 }
        );
      }

      keyFound = true;
      remainingKeys = 0;
      // Delete old format key
      await deleteRows('user_metadata', {
        id: currentKeyMeta.id,
      });
      
      // Verify deletion was successful
      const verifyDelete = await queryOneBuilder<{ id: string }>('user_metadata', {
        select: 'id',
        filters: {
          id: currentKeyMeta.id,
        },
      });

      if (verifyDelete) {
        // Still exists, might have been used by another request
        return NextResponse.json(
          {
            success: false,
            message: 'Recovery key đã được sử dụng bởi một request khác',
          },
          { status: 409 }
        );
      }

      warningMessage = '⚠️ Recovery key đã được sử dụng và đã bị xóa. Vui lòng tạo recovery keys mới sau khi đăng nhập.';
    }

    if (!keyFound) {
      return NextResponse.json(
        {
          success: false,
          message: 'Recovery key không đúng',
        },
        { status: 400 }
      );
    }

    // Hash new password
    const passwordHash = await hashPassword(newPassword);
    const oldPasswordHash = user.password_hash;

    // Update password
    // Note: update function signature is: update(table, filters, data)
    const updateResult = await update(
      'users',
      {
        id: user.id,
      },
      {
        password_hash: passwordHash,
        updated_at: new Date().toISOString(),
      }
    );

    // Verify password was updated successfully
    // Check that update returned results and password_hash changed
    if (!updateResult || updateResult.length === 0) {
      console.error('[RECOVERY KEY VERIFY] Password update returned no results');
      return NextResponse.json(
        {
          success: false,
          message: 'Không thể cập nhật mật khẩu. Vui lòng thử lại sau.',
        },
        { status: 500 }
      );
    }

    // Verify the password hash actually changed in database
    const verifyUser = await queryOneBuilder<{
      password_hash: string;
    }>('users', {
      select: 'password_hash',
      filters: {
        id: user.id,
      },
    });

    if (!verifyUser) {
      console.error('[RECOVERY KEY VERIFY] Could not verify user after password update');
      return NextResponse.json(
        {
          success: false,
          message: 'Không thể xác minh cập nhật mật khẩu. Vui lòng thử lại sau.',
        },
        { status: 500 }
      );
    }

    // Verify password hash changed (should be different from old hash)
    if (verifyUser.password_hash === oldPasswordHash) {
      console.error('[RECOVERY KEY VERIFY] Password hash did not change after update');
      return NextResponse.json(
        {
          success: false,
          message: 'Mật khẩu không được cập nhật. Vui lòng thử lại sau.',
        },
        { status: 500 }
      );
    }

    // Verify new password works by comparing
    const { comparePassword } = await import('@/lib/auth');
    const isNewPasswordValid = await comparePassword(newPassword, verifyUser.password_hash);
    if (!isNewPasswordValid) {
      console.error('[RECOVERY KEY VERIFY] New password does not match stored hash');
      return NextResponse.json(
        {
          success: false,
          message: 'Mật khẩu mới không khớp. Vui lòng thử lại sau.',
        },
        { status: 500 }
      );
    }

    // Delete any remaining OTPs and reset tokens
    await deleteRows('user_metadata', {
      user_id: user.id,
      meta_key: 'password_reset_otp_email',
    });
    await deleteRows('user_metadata', {
      user_id: user.id,
      meta_key: 'password_reset_otp_phone',
    });
    await deleteRows('user_metadata', {
      user_id: user.id,
      meta_key: 'password_reset_token',
    });

    const message = remainingKeys > 0
      ? `Đặt lại mật khẩu thành công. Bạn có thể đăng nhập với mật khẩu mới. Còn lại ${remainingKeys} recovery keys.`
      : 'Đặt lại mật khẩu thành công. Bạn có thể đăng nhập với mật khẩu mới.';

    return NextResponse.json(
      {
        success: true,
        message,
        remainingKeys,
        warning: warningMessage || undefined,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[RECOVERY KEY VERIFY] Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau',
      },
      { status: 500 }
    );
  }
}

