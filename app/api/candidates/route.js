import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

// GET /api/candidates - Get all candidates for a specific interview
export async function GET(request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const interviewId = searchParams.get("interviewId");


        // Get user's company
        const clerkUser = await currentUser();
        const userEmail = clerkUser.emailAddresses[0]?.emailAddress

        const user = await prisma.company.findFirst({
            where: {
                email: userEmail
            }
        });
console.log("user: ", user);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Get candidates for the specific interview
        const candidates = await prisma.candidate.findMany({
            where: {
                companyId: user.id,
            }
        });

        return NextResponse.json({
            success: true,
            data: candidates,
        });
    } catch (error) {
        console.error("Error fetching candidates:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST /api/candidates - Create a new candidate
export async function POST(request) {
    try {
        const { userId } = await auth();
        console.log("userId: ", userId);
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { name, email, profile, interviewId } = body;

        if (!name || !email || !interviewId) {
            return NextResponse.json(
                { message: "Name, email, and interviewId are required" },
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

        // Check if interview exists and belongs to user
        const interview = await prisma.interview.findFirst({
            where: {
                id: interviewId,
                company: {
                    email: userEmail
                }
            },
        });

        if (!interview) {
            return NextResponse.json(
                { message: "Interview not found" },
                { status: 404 }
            );
        }

        // Generate unique key for candidate
        const uniqueKey = `${email}-${interviewId}-${Date.now()}`;

        // Create candidate
        const candidate = await prisma.candidate.create({
            data: {
                name,
                email,
                profile: profile || null,
                uniqueKey,
                companyId: user.id,
            },
        });

        return NextResponse.json({
            success: true,
            data: candidate,
            message: "Candidate created successfully",
        });
    } catch (error) {
        console.error("Error creating candidate:", error);

        if (error.code === "P2002") {
            return NextResponse.json(
                { message: "Email already exists" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
