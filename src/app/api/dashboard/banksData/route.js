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

        const result = await CardAssignUser.aggregate([
            {
                $match: matchStage
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
                    _id: { $ifNull: ["$matchedCard.bankDetailsData.bank_name", "unsend"] },
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
                    _id: { $ifNull: ["$cards.bankDetailsData.bank_name", "unsend"] },
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
