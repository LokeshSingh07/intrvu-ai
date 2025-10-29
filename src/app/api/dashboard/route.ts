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

    // fetch dashboard stats
    const totalInterviews = await prisma.interviewSession.count({
      where: { userId: session.user.id },
    });

    const recentInterviews = await prisma.interviewSession.findMany({
      where: { userId: session.user.id },
      take: 4,
      orderBy: { createdAt: "desc" },
    });

    const averageRating = 5;
    const accuracy = 10;

    const result = {
      totalInterviewCount: totalInterviews,
      rating: averageRating,
      accuracy,
      recentInterviews,
    };

    console.log("Dashboard result:", result);

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
