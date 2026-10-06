import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { parse } from "csv-parse";

const prisma = new PrismaClient();

// POST /api/candidates/import - Import candidates from CSV
export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const interviewId = formData.get("interviewId");

    if (!file || !interviewId) {
      return NextResponse.json(
        { message: "File and interviewId are required" },
        { status: 400 }
      );
    }

    // Get user's company
    const user = await prisma.company.findFirst({
      where: { email: userId },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if interview exists and belongs to user
    const interview = await prisma.interview.findFirst({
      where: {
        id: interviewId,
        companyId: user.id,
      },
    });

    if (!interview) {
      return NextResponse.json(
        { message: "Interview not found" },
        { status: 404 }
      );
    }

    // Read and parse CSV file
    const csvText = await file.text();
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
    });

    if (records.length === 0) {
      return NextResponse.json(
        { message: "CSV file is empty" },
        { status: 400 }
      );
    }

    // Validate required columns
    const requiredColumns = ["name", "email"];
    const csvColumns = Object.keys(records[0]);
    const missingColumns = requiredColumns.filter(
      (col) => !csvColumns.includes(col)
    );

    if (missingColumns.length > 0) {
      return NextResponse.json(
        {
          message: `Missing required columns: ${missingColumns.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Process candidates
    const candidates = [];
    const errors = [];

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const { name, email, profile } = record;

      if (!name || !email) {
        errors.push(`Row ${i + 2}: Name and email are required`);
        continue;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push(`Row ${i + 2}: Invalid email format`);
        continue;
      }

      try {
        const uniqueKey = `${email}-${interviewId}-${Date.now()}-${i}`;
        candidates.push({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          profile: profile ? profile.trim() : null,
          uniqueKey,
          companyId: user.id,
        });
      } catch (error) {
        errors.push(`Row ${i + 2}: ${error.message}`);
      }
    }

    if (candidates.length === 0) {
      return NextResponse.json(
        {
          message: "No valid candidates found",
          errors,
        },
        { status: 400 }
      );
    }

    // Insert candidates into database
    const createdCandidates = await prisma.candidate.createMany({
      data: candidates,
      skipDuplicates: true,
    });

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${createdCandidates.count} candidates`,
      imported: createdCandidates.count,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Error importing candidates:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
