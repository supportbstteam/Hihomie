import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Comments from '@/models/Comments'
import DueDates from '@/models/DueDates'

export async function POST(req, { params }) {
    try {
        const { id } = await params;
        const { due_date, due_date_note, userId, colId } = await req.json();
        // console.log(due_date, due_date_note, userId, colId, id);
        // return;
        await dbConnect();

        const newDueDate = new DueDates({
            due_date,
            due_date_note,
            userId,
            cardId: id,
            colId,
        });

        await newDueDate.save();

        return NextResponse.json({ message: "Due date added successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req, context) { 
    const { id } = await context.params;
    try {
        await dbConnect();

        const dueDate = await DueDates.findOne({ cardId: id }).lean();

        return NextResponse.json({ dueDate }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req, context) { 
    const { id } = await context.params;
    try {
        await dbConnect();

        const deletedComment = await Comments.findByIdAndDelete(id);

        if (!deletedComment) {
            return NextResponse.json({ error: "Comment not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Comment deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
 }