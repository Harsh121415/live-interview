import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  const { interviewId } = await params;
  console.log('interviewId: ', interviewId);

  try {
    const interviews = await prisma.interview.findFirst({
        where: {
        id: interviewId,
        },
    });
    //console.log('interviews: ', interviews);

    return NextResponse.json({
      data: interviews,
      messsage: "Interviews fetched successfully",
    });
  } catch (error) {
    //console.log('error: ', error);
    return NextResponse.json({ messsage: error }, { status: 500 });
  }
};

export const DELETE = async (req, { params }) => {
  const { interviewId } = params;
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    // Find the interview and check ownership
    const interview = await prisma.interviews.findFirst({
      where: { id: interviewId },
    });
    if (!interview) {
      return NextResponse.json({ message: "Interview not found" }, { status: 404 });
    }
    // Check if the logged-in user is the owner
    const dbUser = await prisma.company.findUnique({
      where: { email: user.primaryEmailAddress.emailAddress },
    });
    if (!dbUser || interview.userId !== dbUser.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    await prisma.interviews.delete({
      where: { id: interviewId },
    });
    return NextResponse.json({ message: "Interview deleted successfully" });
  } catch (error) {
    //console.log('error: ', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
