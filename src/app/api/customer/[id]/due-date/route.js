import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Comments from '@/models/Comments'
import DueDates from '@/models/DueDates'
import LeadStatus from '@/models/LeadStatus';
import { t } from "@/components/translations";

export async function POST(req, { params }) {
    try {
        const { id } = await params;
        const { due_date, due_date_note, userId, colId } = await req.json();


        const [date, time] = due_date.split(" ");

        await dbConnect();

        const newDueDate = new DueDates({
            due_date : date,
            due_time : time,
            due_date_note,
            userId,
            cardId: id,
            colId,
        });

        await newDueDate.save();


        await LeadStatus.updateOne(
            { _id: colId, "cards._id": id },
            { $set: { "cards.$.updatedAt": new Date() } }
        );

        return NextResponse.json({ message: t("tm2") }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: t("internal_se") }, { status: 500 });
    }
}

export async function GET(req, context) {
    const { id } = await context.params;
    try {
        await dbConnect();

        const dueDates = await DueDates.find({ cardId: id }).lean();

        return NextResponse.json({ dueDates }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: t("internal_se") }, { status: 500 });
    }
}

export async function DELETE(req, context) {
    const { id } = await context.params;

    try {
        await dbConnect();

        const deletedDueDate = await DueDates.findByIdAndDelete(id);

        if (!deletedDueDate) {
            return NextResponse.json({ error: t("tm3") }, { status: 404 });
        }

        return NextResponse.json({ message: t("tm4") }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: t("internal_se") }, { status: 500 });
    }
}