import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import User from '@/models/User'

export async function GET() {
    await dbConnect();
    const users = await User.find({access: "estate"}).lean();

    const userData = users.map(({ password, ...rest }) => ({
        ...rest,
    }));
    return NextResponse.json({ estateUsers: userData }, { status: 200 });
}