import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  const user = await currentUser();

  try {
    const loggedInUser = await prisma.company.findUnique({
      where: {
        email: user.primaryEmailAddress.emailAddress,
      },
    });

    const interviews = await prisma.interview.findMany({
      where: {
        companyId: loggedInUser.id,
      },
    });

    return NextResponse.json({
      data: interviews,
      message: "Interviews fetched successfully",
    });
  } catch (error) {
    //console.log('error: ', error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
};
export const POST = async (req) => {
  try {
    const user = await currentUser();
    const payload = await req.json();
    const loggedInUser = await prisma.company.findUnique({
      where: {
        email: user.primaryEmailAddress.emailAddress,
      },
    });

    if (loggedInUser.credits === 0) {
      return NextResponse.json(
        { message: "Insufficient credits" },
        { status: 400 }
      );
    }
    //console.log('loggedInUser: ', loggedInUser);

    const interview = await prisma.$transaction(async (tx) => {
      // Step 1: Decrement company's credit
      const updatedCompany = await tx.company.update({
        where: { id: loggedInUser.id },
        data: {
          credits: {
            decrement: 1,
          },
        },
      });

      // Optional: Check if company had enough credits
      if (updatedCompany.credits < 0) {
        throw new Error(
          "Insufficient credits please buy more credits to continue"
        );
      }

      // Step 2: Create the interview
      const createdInterview = await tx.interview.create({
        data: {
          ...payload,
          title: payload.jobPosition || "Interview", // Add required title field
          companyId: loggedInUser.id,
        },
      });

      return createdInterview;
    });

    console.log("interview: ", interview);
    return NextResponse.json({
      data: interview,
      message: "Interview created successfully",
    });
  } catch (error) {
    //console.log('error: ', error);

    return NextResponse.json({ message: error }, { status: 500 });
  }
};
