import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import LeadStatus from '@/models/LeadStatus'
import CardAssignUser from '@/models/CardAssignUser';

export async function GET(req) {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const fromDate = url.searchParams.get('fromDate');
    const toDate = url.searchParams.get('toDate');

    if (userId !== "68a2eeb6f31c60d58b33191e") {

        const matchStage = { userId };

        if ((fromDate && fromDate !== "undefined") || (toDate && toDate !== "undefined")) {
            matchStage.createdAt = {};

            if (fromDate && fromDate !== "undefined") {
                matchStage.createdAt.$gte = new Date(`${fromDate}T00:00:00.000Z`);
            }

            if (toDate && toDate !== "undefined") {
                matchStage.createdAt.$lte = new Date(`${toDate}T23:59:59.999Z`);
            }
        }

        const totalLeads = await CardAssignUser.find(matchStage).lean();

        const result = await CardAssignUser.aggregate([
            // Stage 1: Find the user's assigned card
            {
                $match: matchStage
            },

            // Stage 2: Use a Pipelined Lookup
            {
                $lookup: {
                    from: "leadstatuses",
                    let: { lookupCardId: "$cardId" },
                    pipeline: [
                        { $unwind: "$cards" },
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: [{ $toObjectId: "$$lookupCardId" }, "$cards._id"] },
                                        { $eq: ["$cards.contract_signed", true] }
                                    ]
                                }
                            }
                        },
                        { $project: { _id: 0, matched: "true" } }
                    ],
                    as: "signed"
                }
            },
            {
                $unwind: {
                    path: '$signed',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    signedb: {
                        $cond: {
                            if: { $eq: ["$signed.matched", "true"] },
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSignedCount: { $sum: { $cond: { if: "$signedb", then: 1, else: 0 } } }
                }
            },
        ]);
        const totalLeadsCount = totalLeads.length;
        const user_signed_count = result[0]?.totalSignedCount ?? 0;
        const user_not_signed_count = totalLeadsCount - user_signed_count;
        return NextResponse.json({ message: 'Total Leads fetched successfully', data: [{ name: "Contract Signed", value: user_signed_count }, { name: "Contract Not Signed", value: user_not_signed_count }], successTag: "get_contract_signed_lead" }, { status: 200 })
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

        const leadsAttended = await LeadStatus.aggregate([
            {
                // 1. Deconstruct the 'cards' array field
                $unwind: "$cards",
            },
            {
                // 2. Filter the resulting documents to include only those
                //    where the unwound card's status matches the target
                $match: {
                    "cards.contract_signed": { $eq: true }
                },
            },
            {
                // 3. Group all matching cards into a single bucket
                $group: {
                    _id: null,
                    totalCardCount: { $sum: 1 }, // Count the number of documents (which are now individual cards)
                },
            },
        ]);

        const totalLeads = result[0].totalItemCount;
        const contract_signed_leads = leadsAttended[0].totalCardCount;
        const contract_not_signed_leads = totalLeads - contract_signed_leads;

        return NextResponse.json({ message: 'Total Leads fetched successfully', data: [{ name: "Contract Signed", value: contract_signed_leads }, { name: "Contract Not Signed", value: contract_not_signed_leads }], successTag: "get_contract_signed_lead" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
