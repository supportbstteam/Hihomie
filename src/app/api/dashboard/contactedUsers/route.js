import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import LeadStatus from '../../../../models/LeadStatus'
import CardAssignUser from '../../../../models/CardAssignUser';

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
                    from: "leadstatuses",
                    let: { lookupCardId: "$cardId" },
                    pipeline: [
                        { $unwind: "$cards" },
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: [{ $toObjectId: "$$lookupCardId" }, "$cards._id"] },
                                        { $eq: ["$cards.contacted", "yes"] }
                                    ]
                                }
                            }
                        },
                        { $project: { _id: 0, matched: "true" } }
                    ],
                    as: "contacted"
                }
            },
            {
                $unwind: {
                    path: '$contacted',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    contactedb: {
                        $cond: {
                            if: { $eq: ["$contacted.matched", "true"] },
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    contactedCount: { $sum: { $cond: { if: "$contactedb", then: 1, else: 0 } } }
                }
            },
        ]);
        const totalLeadsCount = totalLeads.length;
        const user_contacted_count = result[0].contactedCount;
        const user_not_contacted_count = totalLeadsCount - user_contacted_count;
        return NextResponse.json({ message: 'Contacted Leads fetched successfully', data: [{ name: "Users Contacted", value: user_contacted_count }, { name: "Users Not Contacted", value: user_not_contacted_count }], successTag: "get_contacted_lead" }, { status: 200 })
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
                    "cards.contacted": { $eq: "yes" }
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
        const contacted_leads = leadsAttended[0].totalCardCount;
        const non_contacted_leads = totalLeads - contacted_leads;

        return NextResponse.json({ message: 'Contacted Leads fetched successfully', data: [{ name: "Users Contacted", value: contacted_leads }, { name: "Users Not Contacted", value: non_contacted_leads }], successTag: "get_contacted_lead" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
