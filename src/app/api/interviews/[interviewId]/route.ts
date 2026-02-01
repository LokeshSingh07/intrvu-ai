import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ interviewId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: User not logged in", data: null },
        { status: 401 }
      );
    }

    // console.log("params : ", params)
    // const userId = session.user.id;
    // const interviewId = params.interviewId;

    const resolvedParams = await params;               // await the Promise
    const { interviewId } = resolvedParams;            // now safe to destructure

    const userId = session.user.id;

    if (!interviewId) {
      return NextResponse.json(
        { success: false, message: "Interview ID is required", data: null },
        { status: 400 }
      );
    }

    const interview = await prisma.interviewSession.findUnique({
      where: {
        id: interviewId,
      },
      include: {
        answers: true,
      },
    });

    // Check if the interview exists and belongs to the user
    if (!interview || interview.userId !== userId) {
      return NextResponse.json(
        { success: false, message: "Interview not found or unauthorized access", data: null },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Interview fetched successfully", data: interview },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching interview details ->", err);
    return NextResponse.json(
      { success: false, message: "Internal server error", data: null },
      { status: 500 }
    );
  }
}
