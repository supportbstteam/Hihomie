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
