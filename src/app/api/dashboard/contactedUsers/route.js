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
