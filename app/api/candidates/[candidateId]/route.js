import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth, currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

// DELETE /api/candidates/[candidateId] - Delete a candidate
export async function DELETE(request, { params }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { candidateId } = params;

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

    // Check if candidate exists and belongs to user
    const candidate = await prisma.candidate.findFirst({
      where: {
        id: candidateId,
        companyId: user.id,
      },
    });

    if (!candidate) {
      return NextResponse.json(
        { message: "Candidate not found" },
        { status: 404 }
      );
    }

    // Delete candidate
    await prisma.candidate.delete({
      where: {
        id: candidateId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Candidate deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting candidate:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
