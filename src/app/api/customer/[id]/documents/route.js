import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Document from '@/models/Document'

export async function GET(req, context) {
    const { id } = await context.params;
    try {
        await dbConnect();

        const documents = await Document.find({ cardId: id }).lean();

        return NextResponse.json({ documents }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req, context) {
    const { id } = await context.params;
    try {
        await dbConnect();

        const deletedDocument = await Document.findByIdAndDelete(id);

        if (!deletedDocument) {
            return NextResponse.json({ error: "Document not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Document deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}