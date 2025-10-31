import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import LeadStatus from '@/models/LeadStatus'
import Document from '@/models/Document'
import CardAssignUser from '@/models/CardAssignUser';

export async function GET(req) {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    if (userId !== "68a2eeb6f31c60d58b33191e") {
        const totalLeads = await CardAssignUser.find({ userId: userId }).lean();
        
        const result = await CardAssignUser.aggregate([
            // Stage 1: Find the user's assigned card
            {
                $match: { userId: userId }
            },

            // Stage 2: Use a Pipelined Lookup
            {
                $lookup: {
                    from: "documents",
                    foreignField: "cardId",
                    localField: "cardId",
                    as: "documents"
                }
            },
            {
                $unwind: {
                    path: '$documents',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    documentsb: {
                        $toBool: { $ifNull: ["$documents", false] }
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    documentsCount: { $sum: { $cond: { if: "$documentsb", then: 1, else: 0 } } }
                }
            },
        ]);
        const totalLeadsCount = totalLeads.length;
        const user_documents_count = result[0].documentsCount;
        const user_not_documents_count = totalLeadsCount - user_documents_count;
        return NextResponse.json({ message: 'Documents submitted users fetched successfully', data: [{ name: "Documents Submitted Users", value: user_documents_count }, { name: "Documents Not Submitted Users", value: user_not_documents_count }], successTag: "get_document_submitted_user" }, { status: 200 })
    }
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
