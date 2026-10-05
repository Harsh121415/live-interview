import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const user = await currentUser();
    const { creditsToAdd } = await req.json(); // Expect: { creditsToAdd: 10 }

    if (!creditsToAdd || creditsToAdd <= 0) {
      return NextResponse.json(
        { message: "Invalid credits amount" },
        { status: 400 }
      );
    }

    const loggedInUser = await prisma.company.findUnique({
      where: {
        email: user.primaryEmailAddress.emailAddress,
      },
    });

    if (!loggedInUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const updatedUser = await prisma.company.update({
      where: {
        id: loggedInUser.id,
      },
      data: {
        credits: {
          increment: creditsToAdd,
        },
      },
    });

    return NextResponse.json({
      message: `${creditsToAdd} credits added successfully`,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Add Credits Error: ", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
};
