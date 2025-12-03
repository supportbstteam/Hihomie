import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import CardAssignUser from '@/models/CardAssignUser'

export async function POST(req) { 
    const { leads } = await req.json();

    await dbConnect();

    try {
        for (let lead of leads) {
            await CardAssignUser.create(lead);
        }
        return NextResponse.json({ message: "Leads assigned successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}