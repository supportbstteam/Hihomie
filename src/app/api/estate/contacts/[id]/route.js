import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import EstateContact from '@/models/EstateContact';

export async function GET(req, context) {
    const { id } = await context.params;
    try {
        await dbConnect();

        const contact = await EstateContact.findById(id);

        if (!contact) {
            return NextResponse.json(
                { message: "Contact not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            {
                success: true,
                data: contact,
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

        const updatedContact = await EstateContact.findByIdAndUpdate(id, body, {
            new: true,
        });
        return NextResponse.json(
            {
                success: true,
                data: updatedContact,
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