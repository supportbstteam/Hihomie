import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import EstateLead from "@/models/EstateLead";

export async function GET(req, context) {
    const { id } = await context.params;
    try {
        await dbConnect();

        const lead = await EstateLead.findById(id);

        if (!lead) {
            return NextResponse.json(
                { message: "Lead not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            {
                success: true,
                data: lead,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(request, context) {
    const { id } = await context.params;

    try {
        await dbConnect();
        const body = await request.json();

        const updatedLead = await EstateLead.findByIdAndUpdate(id, body, {
            new: true,
        });
        return NextResponse.json(
            {
                success: true,
                data: updatedLead,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}