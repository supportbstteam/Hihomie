import { NextResponse } from "next/server";
import DueDates from "@/uploads/models/DueDates";
import dbConnect from "@/lib/db";

export async function GET(request) {
    const url = new URL(request.url);
    const date = url.searchParams.get('date');
    const userId = url.searchParams.get('userId');
    try {
        await dbConnect()
        const notes = await DueDates.find({ due_date: date, userId })
        return NextResponse.json(notes, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}