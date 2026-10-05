import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/attempts - Create a new attempt
export async function POST(request){
  try {
    const body = await request.json();
    const { candidateId, interviewId, response, transcript, completed, completedAt, timeUp, callId } = body;

    if (!candidateId || !interviewId) {
      return NextResponse.json(
        { message: "Candidate ID and interview ID are required" },
        { status: 400 }
      );
    }

    // Check if candidate and interview exist
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
    });

    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
    });

    if (!candidate || !interview) {
      return NextResponse.json(
        { message: "Candidate or interview not found" },
        { status: 404 }
      );
    }

    // Check if attempt already exists
    const existingAttempt = await prisma.attempt.findFirst({
      where: {
        candidateId,
        interviewId,
      },
    });

    if (existingAttempt) {
      return NextResponse.json({
        success: true,
        data: existingAttempt,
        message: "Attempt already exists",
      });
    }

    // Prepare fields with correct types
    const data = {
      candidateId,
      interviewId,
      response: typeof response === 'string' ? (() => { try { return JSON.parse(response); } catch { return {}; } })() : (response ?? {}),
      transcript: typeof transcript === 'object' && transcript !== null ? JSON.stringify(transcript) : (transcript ?? ''),
      completed: completed ?? false,
      completedAt: completedAt ? new Date(completedAt) : null,
      timeUp: timeUp ?? false,
      callId: callId ?? null,
    };

    // Create attempt
    const attempt = await prisma.attempt.create({
      data,
    });

    return NextResponse.json({
      success: true,
      data: attempt,
      message: "Attempt created successfully",
    });
  } catch (error) {
    console.error("Error creating attempt:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/attempts - Get attempts for an interview
export async function GET(request){
  try {
    const { searchParams } = new URL(request.url);
    const interviewId = searchParams.get("interviewId");
    const candidateId = searchParams.get("candidateId");

    if (!interviewId && !candidateId) {
      return NextResponse.json(
        { message: "Interview ID or candidate ID is required" },
        { status: 400 }
      );
    }

    const whereClause = {};
    if (interviewId) whereClause.interviewId = interviewId;
    if (candidateId) whereClause.candidateId = candidateId;

    const attempts = await prisma.attempt.findMany({
      where: whereClause,
      include: {
        candidate: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        interview: {
          select: {
            id: true,
            title: true,
            jobPosition: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: attempts,
    });
  } catch (error) {
    console.error("Error fetching attempts:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
