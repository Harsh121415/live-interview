import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const GET = async (req) => {
  const user = await currentUser();
  try {
    if (!user) {
      return Response.json({ message: "User not authenticated" }, { status: 401 });
    }

    const email = user.primaryEmailAddress?.emailAddress;
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim() || "User";
    const profileImageUrl = user.imageUrl || null;

    if (!email) {
      return Response.json({ message: "Email not found" }, { status: 400 });
    }

    let dbUser = await prisma.company.findUnique({
      where: { email },
    });

    if (!dbUser) {
      // Create new user with Clerk information and initial credits
      dbUser = await prisma.company.create({
        data: {
          email,
          name: fullName,
          logo: profileImageUrl,
          credits: 10, // Initial credits for new companies
        },
      });
    } else {
      // Update existing user with latest Clerk information (preserve existing credits)
      dbUser = await prisma.company.update({
        where: { email },
        data: {
          name: fullName,
          logo: profileImageUrl,
        },
      });
    }

    return Response.json({
      message: "User found or created",
      data: dbUser,
      success: true,
    }, { status: 200 });
  } catch (error) {
    console.error("Error in user profile API:", error);
    return Response.json({ message: error.message }, { status: 500 });
  }
};
