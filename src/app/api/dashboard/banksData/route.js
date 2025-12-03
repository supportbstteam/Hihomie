import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import LeadStatus from '@/models/LeadStatus'
import CardAssignUser from '@/models/CardAssignUser';

export async function GET(req) {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    if (userId !== "68a2eeb6f31c60d58b33191e") {
        const result = await CardAssignUser.aggregate([
            {
                $match: { userId: userId }
            },
            {
                $lookup: {
                    from: "leadstatuses",
                    let: { lookupCardId: "$cardId" },
                    pipeline: [
                        { $unwind: "$cards" },
                        {
                            $match: {
                                $expr: {
                                    $eq: [{ $toObjectId: "$$lookupCardId" }, "$cards._id"]
                                }
                            }
                        },
                        { $replaceRoot: { newRoot: "$cards" } }
                    ],
                    as: "matchedCard"
                }
            },
            { $unwind: { path: "$matchedCard", preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: "$matchedCard.bankDetailsData.bank_name",
                    count: { $sum: { $cond: [{ $ifNull: ["$matchedCard", false] }, 1, 0] } }
                }
            },
            {
                $addFields: {
                    _sortKey: { $toLower: "$_id" }
                }
            },
            {
                $sort: { _sortKey: 1 }
            },
            {
                $project: {
                    name: "$_id",
                    value: "$count",
                    _id: 0
                }
            }
        ]);
        return NextResponse.json({ message: 'Bank Data fetched successfully', data: result, successTag: "get_banksData" }, { status: 200 })
    }
    try {
        await dbConnect()

        const result = await LeadStatus.aggregate([
            { $unwind: "$cards" },
            {
                $group: {
                    _id: "$cards.bankDetailsData.bank_name",
                    totalCardCount: { $sum: 1 }
                }
            },
            {
                $addFields: {
                    _sortKey: { $toLower: "$_id" }
                }
            },
            { $sort: { _sortKey: 1 } },
            {
                $project: {
                    name: "$_id",
                    value: "$totalCardCount",
                    _id: 0
                }
            }
        ]);

        return NextResponse.json({ message: 'Bank Data fetched successfully', data: result, successTag: "get_banksData" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
