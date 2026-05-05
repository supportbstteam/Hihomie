import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Agenda from "@/models/EstateAgenda";

// these models are imported to ensure they are registered with Mongoose and can be populated to use .populate() in get handler
import Contact from "@/models/EstateContact";  
import Property from "@/models/Property";   
import User from "@/models/User";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const newAgenda = await Agenda.create(body);

    return NextResponse.json(
      { message: "Task scheduled successfully", agenda: newAgenda },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await dbConnect();
 
    const { searchParams } = new URL(request.url);
 
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
 
    const filter = {};
 
    if (startDate && endDate) {
      filter.date = { $gte: startDate, $lte: endDate };
    }
 
    const agendas = await Agenda.find(filter)
      .populate("responsible", "name lname email")
      .populate("contact", "name lname email")
      .populate("property", "property_title full_address")
      .sort({ date: 1, startTime: 1 });
 
    return NextResponse.json(
      { message: "Agendas fetched successfully", data: agendas },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /agenda error:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}