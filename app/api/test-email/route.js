import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { sendTestEmail } from "@/lib/emailService";

// POST /api/test-email - Send test email
export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Send test email
    const emailResult = await sendTestEmail(email);

    if (!emailResult.success) {
      console.error("Failed to send test email:", emailResult.error);
      return NextResponse.json(
        { 
          success: false,
          message: "Failed to send test email",
          error: emailResult.error 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully",
      emailMessageId: emailResult.messageId,
    });
  } catch (error) {
    console.error("Error sending test email:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

