import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import LeadStatus from '@/models/LeadStatus'

export async function GET() {
    try {
        await dbConnect()

        // Get start and end of current week (Sunday to Saturday)
        const now = new Date();
        // now.setDate(now.getDate() - 5); 

        // Get the previous Sunday
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // This correctly sets to previous Sunday
        startOfWeek.setHours(0, 0, 0, 0);

        // Set end of week to next Saturday at 23:59:59
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const result = await LeadStatus.aggregate([
            {
                $unwind: "$cards"
            },
            {
                $match: {
                    "cards.createdAt": {
                        $gte: startOfWeek,
                        $lte: endOfWeek // Using $lte is slightly more inclusive
                    }
                }
            },
            {
                // ✅ CORRECTED STAGE
                $group: {
                    _id: { $dayOfWeek: "$cards.createdAt" }, // Group directly by the calculated day number
                    count: { $sum: 1 }
                }
            },
            {
                // Add a new stage to format the _id into a name
                $project: {
                    _id: 0, // Exclude the default _id
                    count: 1, // Keep the count field
                    dayName: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$_id", 1] }, then: "Sunday" },
                                { case: { $eq: ["$_id", 2] }, then: "Monday" },
                                { case: { $eq: ["$_id", 3] }, then: "Tuesday" },
                                { case: { $eq: ["$_id", 4] }, then: "Wednesday" },
                                { case: { $eq: ["$_id", 5] }, then: "Thursday" },
                                { case: { $eq: ["$_id", 6] }, then: "Friday" },
                                { case: { $eq: ["$_id", 7] }, then: "Saturday" }
                            ],
                            default: "Unknown"
                        }
                    }
                }
            },
            {
                $sort: { "_id": 1 } // Sort by the original day number if needed, though grouping often handles this
            }
        ]);

        const weeklyLeads = [
            { name: "Sunday", value: 0 },
            { name: "Monday", value: 0 },
            { name: "Tuesday", value: 0 },
            { name: "Wednesday", value: 0 },
            { name: "Thursday", value: 0 },
            { name: "Friday", value: 0 },
            { name: "Saturday", value: 0 },
        ];

        result.forEach(item => {
            // Find the object in the weeklyLeads array where the name matches
            const dayObject = weeklyLeads.find(day => day.name === item.dayName);
        
            // If the object is found, update its value
            if (dayObject) {
                dayObject.value = item.count;
            }
        });

        return NextResponse.json({
            message: 'New Leads This Week fetched successfully',
            data: weeklyLeads, // Use the fully populated object
            successTag: "new_leads_this_week"
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
