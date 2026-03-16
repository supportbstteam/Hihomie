// import { NextResponse } from 'next/server'
// import dbConnect from '@/lib/db'
// import LeadStatus from '@/models/LeadStatus'
// import Document from '@/models/Document'
// import CardAssignUser from '@/models/CardAssignUser';

// export async function GET(req) {
//     const url = new URL(req.url);
//     const userId = url.searchParams.get('userId');
//     const fromDate = url.searchParams.get('fromDate');
//     const toDate = url.searchParams.get('toDate');

//     if (userId !== "68a2eeb6f31c60d58b33191e") {
//         const matchStage = { userId };

//         if ((fromDate && fromDate !== "undefined") || (toDate && toDate !== "undefined")) {
//             matchStage.createdAt = {};

//             if (fromDate && fromDate !== "undefined") {
//                 matchStage.createdAt.$gte = new Date(`${fromDate}T00:00:00.000Z`);
//             }

//             if (toDate && toDate !== "undefined") {
//                 matchStage.createdAt.$lte = new Date(`${toDate}T23:59:59.999Z`);
//             }
//         }
        
//         const totalLeads = await CardAssignUser.find(matchStage).lean();

//         const result = await CardAssignUser.aggregate([
//             // Stage 1: Find the user's assigned card
//             {
//                 $match: matchStage
//             },

//             // Stage 2: Use a Pipelined Lookup
//             {
//                 $lookup: {
//                     from: "documents",
//                     foreignField: "cardId",
//                     localField: "cardId",
//                     as: "documents"
//                 }
//             },
//             {
//                 $unwind: {
//                     path: '$documents',
//                     preserveNullAndEmptyArrays: true
//                 }
//             },
//             {
//                 $addFields: {
//                     documentsb: {
//                         $toBool: { $ifNull: ["$documents", false] }
//                     }
//                 }
//             },
//             {
//                 $group: {
//                     _id: null,
//                     documentsCount: { $sum: { $cond: { if: "$documentsb", then: 1, else: 0 } } }
//                 }
//             },
//         ]);
//         const totalLeadsCount = totalLeads.length;
//         const user_documents_count = result[0]?.documentsCount ?? 0;
//         const user_not_documents_count = totalLeadsCount - user_documents_count;
//         return NextResponse.json({ message: 'Documents submitted users fetched successfully', data: [{ name: "Documents Submitted Users", value: user_documents_count }, { name: "Documents Not Submitted Users", value: user_not_documents_count }], successTag: "get_document_submitted_user" }, { status: 200 })
//     }



//     try {
//         await dbConnect()

//         const result = await LeadStatus.aggregate([
//             {
//                 $group: {
//                     _id: null, // Group all documents into a single bucket
//                     totalItemCount: { $sum: { $size: "$cards" } }, // Sum up the size of the 'cards' array for each doc
//                 },
//             },
//         ]);

//         const documentSubmittedUser = await Document.distinct("cardId");

//         const count = documentSubmittedUser.length;

//         const totalLeads = result[0].totalItemCount;
//         const documentSubmittedUserCount = count;
//         const documentNotSubmittedUserCount = totalLeads - documentSubmittedUserCount;

//         return NextResponse.json({ message: 'Document submitted users fetched successfully', data: [{ name: "Documents Submitted Users", value: documentSubmittedUserCount }, { name: "Documents Not Submitted Users", value: documentNotSubmittedUserCount }], successTag: "get_document_submitted_user" }, { status: 200 })
//     } catch (error) {
//         return NextResponse.json({ error: error.message }, { status: 500 })
//     }
// }


import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import LeadStatus from '@/models/LeadStatus'
import CardAssignUser from '@/models/CardAssignUser';
import Document from '@/models/Document'; // Assuming this is your model

export async function GET(req) {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const fromDate = url.searchParams.get('fromDate');
    const toDate = url.searchParams.get('toDate');
    // New Params
    const leadType = url.searchParams.get('leadType');
    const status = url.searchParams.get('status');

    try {
        await dbConnect();

        if (userId !== "68a2eeb6f31c60d58b33191e") {
            const matchStage = { userId };

            if ((fromDate && fromDate !== "undefined") || (toDate && toDate !== "undefined")) {
                matchStage.createdAt = {};
                if (fromDate && fromDate !== "undefined") matchStage.createdAt.$gte = new Date(`${fromDate}T00:00:00.000Z`);
                if (toDate && toDate !== "undefined") matchStage.createdAt.$lte = new Date(`${toDate}T23:59:59.999Z`);
            }

            const result = await CardAssignUser.aggregate([
                { $match: matchStage },
                // Join with LeadStatus to check leadType (property_enquiry) and status
                {
                    $lookup: {
                        from: "leadstatuses",
                        let: { lookupCardId: "$cardId" },
                        pipeline: [
                            { $unwind: "$cards" },
                            {
                                $match: {
                                    $expr: { $and: [{ $eq: [{ $toObjectId: "$$lookupCardId" }, "$cards._id"] }] },
                                    ...(leadType && { "cards.property_enquiry": leadType }),
                                    ...(status && { "cards.status": status })
                                }
                            }
                        ],
                        as: "leadDetails"
                    }
                },
                // Only keep leads that match the selected Type/Status
                { $unwind: "$leadDetails" },
                // Now join with Documents to see if they submitted
                {
                    $lookup: {
                        from: "documents",
                        foreignField: "cardId",
                        localField: "cardId",
                        as: "docInfo"
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalFilteredLeads: { $sum: 1 },
                        submittedCount: { $sum: { $cond: [{ $gt: [{ $size: "$docInfo" }, 0] }, 1, 0] } }
                    }
                },
            ]);

            const stats = result[0] || { totalFilteredLeads: 0, submittedCount: 0 };
            const user_not_documents_count = stats.totalFilteredLeads - stats.submittedCount;

            return NextResponse.json({
                message: 'Documents submitted users fetched successfully',
                data: [
                    { name: "Documents Submitted Users", value: stats.submittedCount },
                    { name: "Documents Not Submitted Users", value: user_not_documents_count }
                ],
                successTag: "get_document_submitted_user"
            }, { status: 200 });
        }

        // --- Global Logic (Admin) ---
        const globalMatch = {
            ...(leadType && { "cards.property_enquiry": leadType }),
            ...(status && { "cards.status": status })
        };

        const leads = await LeadStatus.aggregate([
            { $unwind: "$cards" },
            { $match: globalMatch },
            { $project: { cardId: { $toString: "$cards._id" } } }
        ]);

        const filteredCardIds = leads.map(l => l.cardId);
        
        // Find documents only for the filtered leads
        const submittedUserIds = await Document.distinct("cardId", {
            cardId: { $in: filteredCardIds }
        });

        const totalLeadsCount = filteredCardIds.length;
        const documentSubmittedUserCount = submittedUserIds.length;
        const documentNotSubmittedUserCount = totalLeadsCount - documentSubmittedUserCount;

        return NextResponse.json({
            message: 'Document submitted users fetched successfully',
            data: [
                { name: "Documents Submitted Users", value: documentSubmittedUserCount },
                { name: "Documents Not Submitted Users", value: documentNotSubmittedUserCount }
            ],
            successTag: "get_document_submitted_user"
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}