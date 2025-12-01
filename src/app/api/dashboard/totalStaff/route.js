import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import User from '@/uploads/models/User'

export async function GET() {
    try {
        await dbConnect()
        const totalStaff = await User.countDocuments({ role: 'staff' });
        const activeStaff = await User.countDocuments({ role: 'staff', status: true });
        return NextResponse.json({ message: 'Total staff fetched successfully', data: [totalStaff, activeStaff], successTag: "get_total_staff" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
