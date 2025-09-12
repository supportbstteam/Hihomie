import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import LeadStatus from '@/models/LeadStatus'

export async function POST(req, { params }) {
    try {
        const { id } = params;
        const { comment } = await req.json();
        console.log("hello",comment);
        // await dbConnect();

        return NextResponse.json({ message: "Comment added successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}