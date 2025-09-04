
export const runtime = "nodejs";
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PasswordReset from '@/models/PasswordReset';
import User from '@/models/User';
import crypto from 'crypto';
import bcrypt from 'bcryptjs'

export async function PUT(req) {
  try {
    await dbConnect();

    // Parse body
    const { password, token } = await req.json();
    if (!password || !token) {
      return new Response(JSON.stringify({ error: "Password and token are required" }), { status: 400 });
    }

    // Find reset request
    const resetRequest = await PasswordReset.findOne({ token });
    if (!resetRequest) {
      return new Response(JSON.stringify({ error: "Invalid token" }), { status: 400 });
    }

    // Check if token expired
    if (resetRequest.expiresAt < new Date()) {
      return new Response(JSON.stringify({ error: "Token has expired" }), { status: 400 });
    }

    // Hash password and update user
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate(
      { email: resetRequest.email },
      { password: hashedPassword }
    );

    // Delete the used token
    await PasswordReset.deleteOne({ token });

    return new Response(JSON.stringify({ message: "Password reset successful" }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}