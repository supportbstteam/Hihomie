import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/db'
import User from '@/uploads/models/User'
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
    const password = formData.get("password");
    const role = formData.get("role");
    const status = formData.get("status") === "true";
    const additionalInfo = formData.get("additionalInfo");

    const check_email = await User.findOne({ email });
    if (check_email) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    let imagePath = null;

    const file = formData.get("image");
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const uploadDir = path.join(process.cwd(), "public/uploads/team");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filename = `resized-${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
      const outputPath = path.join(uploadDir, filename);

      await sharp(buffer)
        .resize(80, 80, { fit: "cover" })
        .jpeg({ quality: 80 })
        .toFile(outputPath);

      imagePath = `/uploads/team/${filename}`;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      name,
      lname,
      email,
      phone,
      jobTitle,
      role,
      status,
      password: hashedPassword,
      additionalInfo,
      ...(imagePath && { image: imagePath }) // only add image if exists
    });

    return NextResponse.json({ message: 'User created successfully', data: newUser }, { status: 201 });
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
    // const { id, name, lname, email, phone, jobTitle, status, password, role, additionalInfo } = await req.json();

    const formData = await req.formData();

    const id = formData.get("id");
    const name = formData.get("name");
    const lname = formData.get("lname");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const jobTitle = formData.get("jobTitle");
    const password = formData.get("password");
    const role = formData.get("role");
    const status = formData.get("status") === "true";
    const additionalInfo = formData.get("additionalInfo");

    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    let imagePath = null;

    const file = formData.get("image");
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const uploadDir = path.join(process.cwd(), "public/uploads/team");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filename = `resized-${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
      const outputPath = path.join(uploadDir, filename);

      await sharp(buffer)
        .resize(80, 80, { fit: "cover" })
        .jpeg({ quality: 80 })
        .toFile(outputPath);

      imagePath = `/uploads/team/${filename}`;
    }

    await dbConnect(); // Connect to DB

    let updateData = { name, lname, email, phone, jobTitle, status, role, additionalInfo, ...(imagePath && { image: imagePath }) };

    if (password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updateData.password = hashedPassword;
    }


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
