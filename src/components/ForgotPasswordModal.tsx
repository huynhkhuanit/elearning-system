"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, Key, ArrowLeft, ArrowRight, Shield, Lock } from "lucide-react";
import Modal from "./Modal";
import { useToast } from "@/contexts/ToastContext";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'method' | 'input' | 'otp' | 'reset' | 'recovery';

export default function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const toast = useToast();
  const [step, setStep] = useState<Step>('method');
  const [method, setMethod] = useState<'email' | 'phone' | null>(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [recoveryKey, setRecoveryKey] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for resend OTP
  const startCountdown = () => {
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleMethodSelect = (selectedMethod: 'email' | 'phone') => {
    setMethod(selectedMethod);
    setStep('input');
  };

  const handleSendOTP = async () => {
    if (method === 'email' && !email) {
      toast.error('Vui lòng nhập email');
      return;
    }
    if (method === 'phone' && !phone) {
      toast.error('Vui lòng nhập số điện thoại');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/forgot-password/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          email: method === 'email' ? email : undefined,
          phone: method === 'phone' ? phone : undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setStep('otp');
        startCountdown();
        // In development, show OTP in console
        if (data.otp) {
          console.log('[DEV] OTP:', data.otp);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Đã có lỗi xảy ra. Vui lòng thử lại sau');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Vui lòng nhập đầy đủ 6 chữ số');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/forgot-password/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          email: method === 'email' ? email : undefined,
          phone: method === 'phone' ? phone : undefined,
          otp,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResetToken(data.resetToken);
        setStep('reset');
        toast.success(data.message);
      } else {
        toast.error(data.message);
        if (data.remainingAttempts !== undefined) {
          toast.error(`Còn lại ${data.remainingAttempts} lần thử`);
        }
      }
    } catch (error) {
      toast.error('Đã có lỗi xảy ra. Vui lòng thử lại sau');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }
    if (!resetToken) {
      toast.error('Token không hợp lệ. Vui lòng thử lại');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resetToken,
          newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Đã có lỗi xảy ra. Vui lòng thử lại sau');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecoveryKey = async () => {
    if (!recoveryKey || recoveryKey.length !== 16) {
      toast.error('Recovery key phải có 16 ký tự');
      return;
    }
    if (!recoveryEmail) {
      toast.error('Vui lòng nhập email');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/recovery-key/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recoveryKey: recoveryKey.toUpperCase(),
          email: recoveryEmail,
          newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        if (data.warning) {
          toast.error(data.warning);
        }
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Đã có lỗi xảy ra. Vui lòng thử lại sau');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    await handleSendOTP();
  };

  const handleClose = () => {
    setStep('method');
    setMethod(null);
    setEmail('');
    setPhone('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setRecoveryKey('');
    setRecoveryEmail('');
    setResetToken(null);
    setCountdown(0);
    onClose();
  };

  const handleBack = () => {
    if (step === 'input') {
      setStep('method');
    } else if (step === 'otp') {
      setStep('input');
      setOtp('');
    } else if (step === 'reset') {
      setStep('otp');
      setNewPassword('');
      setConfirmPassword('');
    } else if (step === 'recovery') {
      setStep('method');
      setRecoveryKey('');
      setRecoveryEmail('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="md"
      showCloseButton={true}
      closeOnBackdropClick={true}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.4 }}
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30"
          >
            {step === 'recovery' ? (
              <Key className="w-8 h-8 text-white" />
            ) : (
              <Lock className="w-8 h-8 text-white" />
            )}
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {step === 'recovery' ? 'Khôi phục bằng Recovery Key' : 'Quên mật khẩu'}
          </h2>
          <p className="text-gray-600 text-sm">
            {step === 'method' && 'Chọn phương thức khôi phục mật khẩu'}
            {step === 'input' && `Nhập ${method === 'email' ? 'email' : 'số điện thoại'} của bạn`}
            {step === 'otp' && `Nhập mã OTP 6 số đã được gửi đến ${method === 'email' ? 'email' : 'số điện thoại'} của bạn`}
            {step === 'reset' && 'Nhập mật khẩu mới của bạn'}
            {step === 'recovery' && 'Nhập recovery key và email để khôi phục mật khẩu'}
          </p>
        </div>

        {/* Step Indicator */}
        {step !== 'recovery' && (
          <div className="flex items-center justify-center space-x-2">
            {['method', 'input', 'otp', 'reset'].map((s, index) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    ['method', 'input', 'otp', 'reset'].indexOf(step) >= index
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index + 1}
                </div>
                {index < 3 && (
                  <div
                    className={`w-8 h-0.5 ${
                      ['method', 'input', 'otp', 'reset'].indexOf(step) > index
                        ? 'bg-indigo-600'
                        : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Choose Method */}
        <AnimatePresence mode="wait">
          {step === 'method' && (
            <motion.div
              key="method"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <button
                onClick={() => handleMethodSelect('email')}
                className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center space-x-4"
              >
                <Mail className="w-6 h-6 text-indigo-600" />
                <div className="text-left flex-1">
                  <div className="font-semibold text-gray-900">Gửi mã qua Email</div>
                  <div className="text-sm text-gray-600">Nhận mã OTP qua email</div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </button>

              <button
                onClick={() => handleMethodSelect('phone')}
                className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center space-x-4"
              >
                <Phone className="w-6 h-6 text-indigo-600" />
                <div className="text-left flex-1">
                  <div className="font-semibold text-gray-900">Gửi mã qua SMS</div>
                  <div className="text-sm text-gray-600">Nhận mã OTP qua số điện thoại</div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">hoặc</span>
                </div>
              </div>

              <button
                onClick={() => setStep('recovery')}
                className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all flex items-center space-x-4"
              >
                <Shield className="w-6 h-6 text-purple-600" />
                <div className="text-left flex-1">
                  <div className="font-semibold text-gray-900">Sử dụng Recovery Key</div>
                  <div className="text-sm text-gray-600">Nếu bạn mất cả email và số điện thoại</div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </button>
            </motion.div>
          )}

          {/* Step 2: Input Email/Phone */}
          {step === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {method === 'email' ? 'Email' : 'Số điện thoại'}
                </label>
                <div className="relative">
                  {method === 'email' ? (
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  ) : (
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  )}
                  <input
                    type={method === 'email' ? 'email' : 'tel'}
                    value={method === 'email' ? email : phone}
                    onChange={(e) => method === 'email' ? setEmail(e.target.value) : setPhone(e.target.value)}
                    placeholder={method === 'email' ? 'name@example.com' : '0123456789'}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-gray-900"
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleBack}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-semibold text-gray-700 flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại</span>
                </button>
                <button
                  onClick={handleSendOTP}
                  disabled={isLoading || (method === 'email' ? !email : !phone)}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang gửi...</span>
                    </>
                  ) : (
                    <>
                      <span>Gửi mã OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Verify OTP */}
          {step === 'otp' && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Mã OTP (6 chữ số)
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(value);
                  }}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-gray-900 text-center text-2xl tracking-widest font-mono"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <button
                  onClick={handleResendOTP}
                  disabled={countdown > 0}
                  className="text-indigo-600 hover:text-indigo-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {countdown > 0 ? `Gửi lại sau ${countdown}s` : 'Gửi lại mã OTP'}
                </button>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleBack}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-semibold text-gray-700 flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại</span>
                </button>
                <button
                  onClick={handleVerifyOTP}
                  disabled={isLoading || otp.length !== 6}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang xác thực...</span>
                    </>
                  ) : (
                    <>
                      <span>Xác thực</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Reset Password */}
          {step === 'reset' && (
            <motion.div
              key="reset"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-gray-900"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleBack}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-semibold text-gray-700 flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại</span>
                </button>
                <button
                  onClick={handleResetPassword}
                  disabled={isLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang đặt lại...</span>
                    </>
                  ) : (
                    <>
                      <span>Đặt lại mật khẩu</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* Recovery Key Step */}
          {step === 'recovery' && (
            <motion.div
              key="recovery"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Lưu ý:</strong> Recovery key chỉ có thể sử dụng một lần. Sau khi sử dụng, bạn cần tạo recovery key mới sau khi đăng nhập.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Recovery Key (16 ký tự)
                </label>
                <input
                  type="text"
                  value={recoveryKey}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^A-Za-z0-9]/g, '').slice(0, 16).toUpperCase();
                    setRecoveryKey(value);
                  }}
                  placeholder="ABCD1234EFGH5678"
                  maxLength={16}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-gray-900 font-mono text-center tracking-wider"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-gray-900"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleBack}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-semibold text-gray-700 flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại</span>
                </button>
                <button
                  onClick={handleRecoveryKey}
                  disabled={isLoading || !recoveryKey || recoveryKey.length !== 16 || !recoveryEmail || !newPassword || newPassword !== confirmPassword}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang khôi phục...</span>
                    </>
                  ) : (
                    <>
                      <span>Khôi phục mật khẩu</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
}

