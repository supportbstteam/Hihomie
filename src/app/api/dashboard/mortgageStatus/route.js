import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import LeadStatus from '@/models/LeadStatus'

export async function GET() {
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

        return NextResponse.json({
            message: 'Mortgage Status fetched successfully',
            data: result,
            successTag: "mortgage_status"
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
