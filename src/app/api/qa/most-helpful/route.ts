import { NextRequest, NextResponse } from "next/server";
import { db as supabaseAdmin } from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

/**
 * GET /api/qa/most-helpful
 * Get users with most accepted answers in the last 30 days
 * Sorted by number of accepted answers descending
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    jwt.verify(token.value, process.env.JWT_SECRET || "");

    // Calculate date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoISO = thirtyDaysAgo.toISOString();

    // Get all accepted answers from the last 30 days with user info
    const { data: acceptedAnswers, error: answersError } = await supabaseAdmin!
      .from("lesson_answers")
      .select(`
        user_id,
        users!inner(
          id,
          username,
          full_name,
          avatar_url,
          is_verified,
          membership_type
        )
      `)
      .eq("is_accepted", true)
      .gte("created_at", thirtyDaysAgoISO)
      .order("created_at", { ascending: false });

    if (answersError) {
      throw answersError;
    }

    // Count accepted answers per user
    const userCountMap = new Map<string, {
      id: string;
      username: string;
      fullName: string;
      avatarUrl: string | null;
      isVerified: boolean;
      membershipType: 'FREE' | 'PRO';
      contributions: number;
    }>();

    (acceptedAnswers || []).forEach((answer: any) => {
      const userId = answer.user_id;
      const user = answer.users as any;

      if (userCountMap.has(userId)) {
        const existing = userCountMap.get(userId)!;
        existing.contributions += 1;
      } else {
        userCountMap.set(userId, {
          id: user.id,
          username: user.username,
          fullName: user.full_name,
          avatarUrl: user.avatar_url,
          isVerified: Boolean(user.is_verified),
          membershipType: user.membership_type || 'FREE',
          contributions: 1,
        });
      }
    });

    // Convert to array and sort by contributions descending
    const mostHelpfulUsers = Array.from(userCountMap.values())
      .sort((a, b) => b.contributions - a.contributions)
      .slice(0, 10); // Top 10 users

    return NextResponse.json({
      success: true,
      data: {
        users: mostHelpfulUsers,
      },
    });
  } catch (error) {
    console.error("Error fetching most helpful users:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

