import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/db'
import User from '@/models/User'
import sharp from "sharp";
import fs from "fs";
import path from "path";


export async function POST(req) {
  try {
    await dbConnect();

    const formData = await req.formData();

    // fields (non-file data)
    const name = formData.get("name");
    const lname = formData.get("lname");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const jobTitle = formData.get("jobTitle");
    const role = formData.get("role");
    const status = formData.get("status") === "true";

    // file
    const file = formData.get("image");
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // upload dir
    const uploadDir = path.join(process.cwd(), "public/uploads/team");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // filename
    const filename = `resized-${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const outputPath = path.join(uploadDir, filename);

    // resize & optimize
    await sharp(buffer)
      .resize(80, 80, { fit: "cover" })
      .jpeg({ quality: 80 })
      .toFile(outputPath);

    const defaultPassword = "123456";            // change to env var later if needed
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

    // save user
    const newUser = await User.create({
      name,
      lname,
      email,
      phone,
      jobTitle,
      role,
      status,
      password: hashedPassword,
      image: `/uploads/team/${filename}`, // public path
    });

    return NextResponse.json({ message: 'User Created Sucesfull', data: newUser }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}



export async function GET() {
  try {
    await dbConnect();

    // Admin ko exclude karo aur password field ko hata do
    const data = await User.find(
      { role: { $ne: "admin" } },   // condition
      { password: 0 }              // projection (password exclude)
    ).lean();

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function PUT(req) {
  try {
    const { id, name, lname, email, phone, jobTitle, status, role } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    await dbConnect(); // Connect to DB

    let updateData = { name, lname, email, phone, jobTitle, status, role };


    const user = await User.findByIdAndUpdate(id, updateData, { new: true }).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // password ko response se hata do
    const { password: _, ...data } = user;

    return NextResponse.json(
      { message: "User Updated Successfully", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function DELETE(req) {
  try {
    await dbConnect();

    const { id } = await req.json()// comes from URL

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Record deleted successfully", deleted },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
