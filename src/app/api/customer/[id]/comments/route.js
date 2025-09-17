import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Comments from '@/models/Comments'

export async function POST(req, { params }) {
    try {
        const { id } = await params;
        const { comment, colId, userId } = await req.json();
        await dbConnect();

        const newComment = new Comments({
            comment,
            colId,
            cardId: id,
            userId: userId,
        });

        await newComment.save();

        return NextResponse.json({ message: "Comment added successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req, context) { 
    const { id } = await context.params;
    try {
        await dbConnect();

        const comments = await Comments.find({ cardId: id }).lean();

        return NextResponse.json({ comments }, { status: 200 });
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