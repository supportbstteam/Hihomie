import { NextResponse } from "next/server";
import dueDate from "@/models/DueDates";
import Task from "@/models/Task";

export async function GET(request) {
    const url = new URL(request.url);
    const date = url.searchParams.get('date');
    const userId = url.searchParams.get('manager_id');
    try {
        await dbConnect()
        const tasks = await Task.find({ date: new Date(date), userId })
        return NextResponse.json( tasks, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}