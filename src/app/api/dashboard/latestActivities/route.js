import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import LeadStatus from '@/uploads/models/LeadStatus'

export async function GET() {
    try {
        await dbConnect()

        const result = await LeadStatus.aggregate([
            {
                $unwind: "$cards"
            },
            {
                $sort: { "cards.createdAt": -1 }
            },
            {
                $limit: 5
            },
            {
                $project: {
                    _id: '$cards._id',
                    status_name: '$status_name',
                    lead_title: '$cards.lead_title',
                    first_name: '$cards.first_name',
                    last_name: '$cards.last_name',
                    lead_value: '$cards.lead_value',
                    createdAt: '$cards.createdAt',
                }
            }
        ]);

        return NextResponse.json({ message: 'Latest Activities fetched successfully', data: result, successTag: "latest_activities" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
