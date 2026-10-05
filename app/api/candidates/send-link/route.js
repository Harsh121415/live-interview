import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth, currentUser } from "@clerk/nextjs/server";
import { sendInterviewInvitation } from "@/lib/emailService";

const prisma = new PrismaClient();

// POST /api/candidates/send-link - Send interview link to candidate
export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { candidateId, interviewId, email } = body;

    if (!candidateId || !interviewId || !email) {
      return NextResponse.json(
        { message: "Candidate ID, interview ID, and email are required" },
        { status: 400 }
      );
    }

    // Get user's company
    const clerkUser = await currentUser();
    const userEmail = clerkUser.emailAddresses[0]?.emailAddress

    const user = await prisma.company.findFirst({
      where: {
        email: userEmail
      }
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Get candidate and interview
    const candidate = await prisma.candidate.findFirst({
      where: {
        id: candidateId,
        companyId: user.id,
      },
    });

    const interview = await prisma.interview.findFirst({
      where: {
        id: interviewId,
        companyId: user.id,
      },
    });

    if (!candidate || !interview) {
      return NextResponse.json(
        { message: "Candidate or interview not found" },
        { status: 404 }
      );
    }

    // Generate interview link with candidate ID
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const interviewLink = `${baseUrl}/interview/room/${interviewId}?candidate=${candidateId}`;

    // Send email invitation
    const emailResult = await sendInterviewInvitation(
      candidate.email,
      candidate.name,
      interview.jobPosition,
      interviewLink
    );

    if (!emailResult.success) {
      console.error("Failed to send email:", emailResult.error);
      return NextResponse.json(
        { 
          success: false,
          message: "Failed to send email invitation",
          error: emailResult.error 
        },
        { status: 500 }
      );
    }

    console.log(`Interview invitation sent successfully to ${candidate.name} (${candidate.email})`);
    console.log(`Interview link: ${interviewLink}`);

    return NextResponse.json({
      success: true,
      message: "Interview invitation sent successfully",
      emailMessageId: emailResult.messageId,
      link: interviewLink, // For development purposes
    });
  } catch (error) {
    console.error("Error sending interview link:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
