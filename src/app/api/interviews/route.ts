// app/api/dashboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";




export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: User not logged in", data: null },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get all interview sessions for user
    const interviews = await prisma.interviewSession.findMany({
      where: { userId },
      include: { answers: true },
    });

    const totalInterviews = interviews.length;

    // Calculate average rating
    const ratings = interviews
      .map((interview) => Number(interview.rating))
      .filter((r) => !isNaN(r));

    const averageRating =
      ratings.length > 0
        ? (ratings.reduce((sum, val) => sum + val, 0) / ratings.length).toFixed(1)
        : null;

    // Calculate overall question accuracy
    const allAnswers = interviews.flatMap((interview) => interview.answers);

    const correctAnswers = allAnswers.filter((a) => a.isCorrect === true).length;
    const totalAnswers = allAnswers.length;

    const accuracy = totalAnswers > 0
      ? Number(((correctAnswers / totalAnswers) * 100).toFixed(2))
      : null;

    // Fetch latest 4 interviews
    const recentInterviews = await prisma.interviewSession.findMany({
      where: { userId },
      take: 10,
      orderBy: { createdAt: "desc" },
    });

    const result = {
      totalInterviewCount: totalInterviews,
      rating: averageRating,
      accuracy,
      recentInterviews,
    };

    return NextResponse.json(
      { success: true, message: "Interview sessions fetched successfully", data: result },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in dashboardStats ->", err);
    return NextResponse.json(
      { success: false, message: "Internal server error", data: null },
      { status: 500 }
    );
  }
}

