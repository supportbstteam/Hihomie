import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import LeadStatus from '@/models/LeadStatus'
import Document from '@/models/Document'

export async function GET() {
    try {
        await dbConnect()

        const result = await LeadStatus.aggregate([
            {
                $group: {
                    _id: null, // Group all documents into a single bucket
                    totalItemCount: { $sum: { $size: "$cards" } }, // Sum up the size of the 'cards' array for each doc
                },
            },
        ]);

        const documentSubmittedUser = await Document.distinct("cardId");

        const count = documentSubmittedUser.length;

        const totalLeads = result[0].totalItemCount;
        const documentSubmittedUserCount = count;
        const documentNotSubmittedUserCount = totalLeads - documentSubmittedUserCount;

        return NextResponse.json({ message: 'Document submitted users fetched successfully', data: [{ name: "Documents Submitted Users", value: documentSubmittedUserCount }, { name: "Documents Not Submitted Users", value: documentNotSubmittedUserCount }], successTag: "get_document_submitted_user" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
