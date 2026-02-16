import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import LeadStatus from '@/models/LeadStatus'
import mongoose from 'mongoose'

export async function PUT(req, context) {
    const { id } = await context.params;

    try {
        const { colId, bank_name } = await req.json();
        await dbConnect();

        if (!colId || !id) {
            return NextResponse.json({ error: "colId and id are required" }, { status: 400 });
        }

        if (!mongoose.Types.ObjectId.isValid(colId)) {
            return NextResponse.json({ error: "Invalid colId" }, { status: 400 });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid card id" }, { status: 400 });
        }

        const updatedColumn = await LeadStatus.findOneAndUpdate(
            { _id: colId, "cards._id": id },
            {
                $set: {
                    "cards.$.bankDetailsData.bank_name": bank_name,
                    "cards.$.updatedAt": new Date(),
                },
            },
            { new: true }
        );


        if (!updatedColumn) {
            return NextResponse.json({ error: "Card not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Bank updated successfully", data: updatedColumn }, { status: 200 });

    } catch (error) {
        console.error("Update Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}
