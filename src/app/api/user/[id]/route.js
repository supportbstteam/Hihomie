import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/db'
import User from '@/models/User'

export async function GET(req, context) {

  const { id } = await context.params;

  await dbConnect();

  const user = await User.findById(id).lean();

  const { password, ...rest } = user;

  return NextResponse.json({ data: rest }, { status: 200 });
}


export async function PATCH(req, context) {
  const { id } = await context.params;
  await dbConnect();

  const body = await req.json();
  const { name, email, password } = body;

  try {
    // Build update object
    const updateData = {
      name,
      email,
    };

    // Hash password only if provided
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Exclude password from response
    const { password: pwd, ...rest } = updatedUser;

    return NextResponse.json({ message: "User updated successfully", data: rest }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}