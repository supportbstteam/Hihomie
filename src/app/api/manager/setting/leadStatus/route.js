import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import LeadStatus from '@/models/LeadStatus'
import getUserFromServerSession from '@/lib/getUserFromServerSession'

export async function POST(req) {
    try {

        const { status_name, color } = await req.json()

        await dbConnect() // Connect to DB

        const data = await LeadStatus.create({ status_name, color })

        return NextResponse.json({ message: "Lead Status created successfully", data }, { status: 201 })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// ✅ GET - Fetch all customers
export async function GET() {

    const user = await getUserFromServerSession()

    try {
        await dbConnect(); 

        const pipeline = [
            {
                // Stage 1: Check for documents that have at least one matching nested card.
                // This is not a strict filter; it just helps in the next stage.
                $addFields: {
                    hasMatch: {
                        $anyElementTrue: [
                            {
                                $map: {
                                    input: "$cards",
                                    as: "card",
                                    in: { $eq: ["$$card.assigned", user.id] }
                                }
                            }
                        ]
                    }
                }
            },
            {
                // Stage 2: Reshape the document based on whether a match was found.
                $project: {
                    // Keep all fields from the original document.
                    _id: '$_id',
                    status_name: '$status_name',
                    color: '$color',
                    cards: {
                        $cond: {
                            if: "$hasMatch",
                            // then: "matched",
                            then: {
                                $filter: {
                                    input: "$cards",
                                    as: "card",
                                    cond: { $eq: ["$$card.assigned", user.id] }
                                }
                            },
                            else: []
                        }
                    },
                }
            }
        ]
        const data = await LeadStatus.aggregate(pipeline);
        return NextResponse.json({ data }, { status: 201 })
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// ✅ GET - Fetch all customers
export async function PUT(req) {
    try {
        await dbConnect();
        const { sourceColId, destColId, cardId } = await req.json();

        if (!sourceColId || !destColId || !cardId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1️⃣ Find source column
        const sourceCol = await LeadStatus.findById(sourceColId);
        if (!sourceCol) {
            return NextResponse.json({ error: "Source column not found" }, { status: 404 });
        }

        // 2️⃣ Find the card inside source
        const cardIndex = sourceCol.cards.findIndex(
            (c) => c._id.toString() === cardId
        );
        if (cardIndex === -1) {
            return NextResponse.json({ error: "Card not found in source column" }, { status: 404 });
        }

        // 3️⃣ Remove card from source
        const [movedCard] = sourceCol.cards.splice(cardIndex, 1);
        await sourceCol.save();

        movedCard.status = destColId;

        // 4️⃣ Add card into destination column
        const destCol = await LeadStatus.findById(destColId);
        if (!destCol) {
            return NextResponse.json({ error: "Destination column not found" }, { status: 404 });
        }

        destCol.cards.push(movedCard);
        await destCol.save();

        // 5️⃣ Return updated columns
        return NextResponse.json(
            { message: "Card moved successfully", sourceCol, destCol },
            { status: 200 }
        );
    } catch (error) {
        console.error("PUT Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}


export async function DELETE(req) {
    try {
        await dbConnect();

        const { id } = await req.json()// comes from URL

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const deleted = await LeadStatus.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json({ error: "Record not found" }, { status: 404 });
        }

        return NextResponse.json(
            { message: "Record deleted successfully", deleted },
            { status: 200 }
        );
    } catch (error) {
        console.error("DELETE Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
