import { NextResponse } from "next/server";
import DueDates from "@/models/DueDates";
import CardAssignUser from "@/models/CardAssignUser";
import dbConnect from "@/lib/db";

// export async function GET(request) {
//     const url = new URL(request.url);
//     const date = url.searchParams.get('date');
//     const userId = url.searchParams.get('userId');
//     try {
//         await dbConnect()
//         const notes = await DueDates.find({ due_date: date, userId })
//         return NextResponse.json(notes, { status: 200 })
//     } catch (error) {
//         console.error(error)
//         return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
//     }
// }

export async function GET(request) {
    const url = new URL(request.url);
    const date = url.searchParams.get('date');
    const userId = url.searchParams.get('userId');
    const ADMIN_ID = "68a2eeb6f31c60d58b33191e";

    try {
        await dbConnect();

        // 1. Find all leads/cards assigned to this specific user
        const assignedCards = await CardAssignUser.find({ userId }).select('cardId');
        
        // Extract the card IDs into a simple array
        const leadIds = assignedCards.map(item => item.cardId);

        if (leadIds.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        const notes = await DueDates.find({
            cardId: { $in: leadIds }, // Search within the assigned leads
            due_date: date,
            userId: { $in: [userId, ADMIN_ID] } // Filter by the specific user or admin
        });

        return NextResponse.json(notes, { status: 200 });

    } catch (error) {
        console.error("Fetch notes error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}