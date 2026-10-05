import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PUT /api/attempts/[attemptId] - Update an attempt
export async function PUT(request, { params }) {
  try {
    const { attemptId } = params;
    const body = await request.json();
    const { response, transcript, completed, completedAt, timeUp, callId, ...rest } = body;

    const attempt = await prisma.attempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt) {
      return NextResponse.json(
        { message: "Attempt not found" },
        { status: 404 }
      );
    }

    // Update attempt
    const updatedAttempt = await prisma.attempt.update({
      where: { id: attemptId },
      data: {
        ...rest,
        response: typeof response === 'string' ? (() => { try { return JSON.parse(response); } catch { return attempt.response ?? {}; } })() : (response ?? attempt.response ?? {}),
        transcript: typeof transcript === 'object' && transcript !== null ? JSON.stringify(transcript) : (transcript ?? attempt.transcript ?? ''),
        completed: typeof completed === 'boolean' ? completed : attempt.completed,
        completedAt: completedAt ? new Date(completedAt) : attempt.completedAt,
        timeUp: typeof timeUp === 'boolean' ? timeUp : attempt.timeUp,
        callId: callId ?? attempt.callId,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedAttempt,
      message: "Attempt updated successfully",
    });
  } catch (error) {
    console.error("Error updating attempt:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/attempts/[attemptId] - Get a specific attempt
export async function GET(request, { params }) {
  try {
    const { attemptId } = params;

    const attempt = await prisma.attempt.findUnique({
      where: { id: attemptId },
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
            questions: true,
          },
        },
      },
    });

    if (!attempt) {
      return NextResponse.json(
        { message: "Attempt not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: attempt,
    });
  } catch (error) {
    console.error("Error fetching attempt:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
