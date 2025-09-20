import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import LeadStatus from '@/models/LeadStatus'

export async function GET() {
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

        const totalLeads = result[0].totalItemCount;

        return NextResponse.json({ message: 'Total Leads fetched successfully', data: totalLeads, successTag: "get_total_lead" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
