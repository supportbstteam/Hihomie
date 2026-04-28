import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import EstateContact from '@/models/EstateContact'

export async function GET() {
    try {

        await dbConnect();

        const maxCard = await EstateContact.aggregate([
            {
                $group: {
                    _id: null, // This groups all documents in the collection into a single result
                    maxNumber: { $max: { $toInt: "$contact_id" } }
                }
            }
        ]);

        let maxNumber = maxCard.length > 0 ? maxCard[0].maxNumber : 0;

        if (maxNumber === 0) {
            maxNumber = 1;
        } else {
            maxNumber += 1;
        }

        return NextResponse.json(maxNumber, { status: 200 })
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}