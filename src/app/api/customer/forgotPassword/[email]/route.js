export const runtime = "nodejs";
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PasswordReset from '@/models/PasswordReset';
import User from '@/models/User';
import crypto from 'crypto';
import nodemailer from 'nodemailer'; // ✅ Import nodemailer

export async function POST(req, context) {
  try {
    await dbConnect();

    // ✅ Get email from route params
    const { email } = context.params;
    console.log("Email:", email);

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "No user found with this email" },
        { status: 400 }
      );
    }

    // ✅ Create reset token and expiry
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 mins expiry

    // ✅ Save reset request
    await PasswordReset.create({ email, token, expiresAt });

    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    // ✅ Setup email transport
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`,
    });

    return NextResponse.json({ message: "Mail sent" }, { status: 200 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
