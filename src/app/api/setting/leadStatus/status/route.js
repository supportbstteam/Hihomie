import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import LeadStatus from '@/uploads/models/LeadStatus'

export async function PUT(req) {
  try {
    await dbConnect(); // DB connect

    const { id, status_name, color, order } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // Update the record
    const updatedData = await LeadStatus.findByIdAndUpdate(
      id,
      { status_name, color, order },
      { new: true, runValidators: true }
    );

    if (!updatedData) {
      return NextResponse.json({ error: "Lead Status not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Lead Status updated successfully", data: updatedData },
      { status: 200 }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}