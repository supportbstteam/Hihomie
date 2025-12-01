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
                                $expr: { $eq: ["$cards._id", { $toObjectId: "$$lookupCardId" }] }
                            }
                        },
                    ],
                    as: "card"
                }
            },
            {
                $unwind: {
                    path: '$card',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    status_name: "$card.status_name"
                }
            },
            {
                $group: {
                    _id: "$status_name",
                    name: { $first: "$status_name" },
                    value: { $sum: 1 },
                }
            },
            {
                $project: {
                    _id: 0,      // exclude _id
                    name: 1,     // include name
                    value: 1     // include value
                },
            },
        ]);
        const mortgageStatusData = [
            { name: "Appraisal", value: 0 },
            { name: "Descalificada", value: 0 },
            { name: "Pre Study", value: 0 },
            { name: "Denied", value: 0 },
            { name: "New Lead", value: 0 },
            { name: "Call Back", value: 0 },
            { name: "Housing Pending", value: 0 },
            { name: "Signature", value: 0 },
            { name: "Granted", value: 0 },
            { name: "Pending Documentation", value: 0 },
            { name: "Send to Bank", value: 0 },
            { name: "Fein", value: 0 },
        ];
        result.forEach((item) => {
            const index = mortgageStatusData.findIndex((i) => i.name === item.name);
            if (index !== -1) {
                mortgageStatusData[index].value = item.value;
            }
        });
        return NextResponse.json({
            message: 'Mortgage Status fetched successfully',
            data: mortgageStatusData,
            successTag: "mortgage_status"
        }, { status: 200 });
    }






    try {
        await dbConnect()

        const result = await LeadStatus.aggregate([
            {
                $group: {
                    _id: "$status_name",
                    name: { $first: "$status_name" },
                    value: { $sum: { $size: { $ifNull: ["$cards", []] } } },
                }
            },
            {
                $project: {
                    _id: 0,      // exclude _id
                    name: 1,     // include name
                    value: 1     // include value
                },
            },
        ]);

        const mortgageStatusData = [
            { name: "Appraisal", value: 0 },
            { name: "Descalificada", value: 0 },
            { name: "Pre Study", value: 0 },
            { name: "Denied", value: 0 },
            { name: "New Lead", value: 0 },
            { name: "Call Back", value: 0 },
            { name: "Housing Pending", value: 0 },
            { name: "Signature", value: 0 },
            { name: "Granted", value: 0 },
            { name: "Pending Documentation", value: 0 },
            { name: "Send to Bank", value: 0 },
            { name: "Fein", value: 0 },
        ];
        result.forEach((item) => {
            const index = mortgageStatusData.findIndex((i) => i.name === item.name);
            if (index !== -1) {
                mortgageStatusData[index].value = item.value;
            }
        });

        return NextResponse.json({
            message: 'Mortgage Status fetched successfully',
            data: mortgageStatusData,
            successTag: "mortgage_status"
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
