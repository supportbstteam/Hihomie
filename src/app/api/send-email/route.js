import { sendEmail } from "@/lib/sendEmail";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, data } = await req.json();

    await sendEmail(email, data);

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });

  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ message: "Failed to send email" }, { status: 500 });
  }
}