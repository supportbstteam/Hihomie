import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/db'
import User from '@/models/User'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
    await dbConnect();
    const users = await User.find().lean();
    const userData = users.map(({ password, ...rest }) => ({
      ...rest,
    }));
    return NextResponse.json({ users: userData }, { status: 200 });
}