import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import LeadStatus from '@/models/LeadStatus'
import CardAssignUser from '@/models/CardAssignUser';

export async function GET(req) {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const fromDate = url.searchParams.get('fromDate');
    const toDate = url.searchParams.get('toDate');
    const leadType = url.searchParams.get('leadType');
    const statusFilter = url.searchParams.get('status');

    try {
        await dbConnect();

        // 1. MANAGER/STAFF VIEW
        if (userId && userId !== "68a2eeb6f31c60d58b33191e") {
            const matchStage = { userId };

            if ((fromDate && fromDate !== "undefined") || (toDate && toDate !== "undefined")) {
                matchStage.createdAt = {};
                if (fromDate && fromDate !== "undefined") matchStage.createdAt.$gte = new Date(`${fromDate}T00:00:00.000Z`);
                if (toDate && toDate !== "undefined") matchStage.createdAt.$lte = new Date(`${toDate}T23:59:59.999Z`);
            }

            const result = await LeadStatus.aggregate([
                {
                    $lookup: {
                        from: "cardassignusers",
                        let: { statusId: { $toString: "$_id" } }, // Use ID string to match card.status
                        pipeline: [
                            { $match: matchStage },
                            {
                                $lookup: {
                                    from: "leadstatuses",
                                    let: { lookupCardId: "$cardId" },
                                    pipeline: [
                                        { $unwind: "$cards" },
                                        {
                                            $match: {
                                                $expr: { $eq: ["$cards._id", { $toObjectId: "$$lookupCardId" }] },
                                                // Match the status ID stored in the card to the current bucket
                                                ...(leadType && { "cards.property_enquiry": leadType }),
                                                // ...(statusFilter && { "cards.status": statusFilter })
                                            }
                                        }
                                    ],
                                    as: "leadInfo"
                                }
                            },
                            { $unwind: "$leadInfo" },
                            // This is the key: Does the lead found belong to the Status row we are currently on?
                            { $match: { $expr: { $eq: ["$leadInfo.cards.status", "$$statusId"] } } }
                        ],
                        as: "matchedAssignments"
                    }
                },
                { $sort: { order: 1 } },
                {
                    $project: {
                        _id: 0,
                        name: "$status_name",
                        value: { $size: "$matchedAssignments" }
                    }
                },
            ]);

            return NextResponse.json({ data: result }, { status: 200 });
        }

        // 2. ADMIN/GLOBAL VIEW
        const result = await LeadStatus.aggregate([
            { $sort: { order: 1 } },
            {
                $project: {
                    _id: 0,
                    name: "$status_name",
                    value: {
                        $size: {
                            $filter: {
                                input: { $ifNull: ["$cards", []] },
                                as: "card",
                                cond: {
                                    $and: [
                                        // Global filters applied to the array elements
                                        leadType ? { $eq: ["$$card.property_enquiry", leadType] } : true,
                                        statusFilter ? { $eq: ["$$card.status", statusFilter] } : true
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        ]);

        return NextResponse.json({ data: result }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}