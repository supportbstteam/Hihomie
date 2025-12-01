import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import User from '../../../../models/User'

export async function GET() {
    try {
        await dbConnect()
        const totalManagers = await User.countDocuments({ role: 'manager' });
        const activeManagers = await User.countDocuments({ role: 'manager', status: true });
        return NextResponse.json({ message: 'Total managers fetched successfully', data: [totalManagers, activeManagers], successTag: "get_total_manager" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
