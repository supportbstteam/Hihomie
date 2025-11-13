import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import LeadStatus from '@/models/LeadStatus'

export async function POST(req) {
  try {

    const { status_name, color, order } = await req.json()
    console.log(status_name, color, order)

    await dbConnect() // Connect to DB

    const data = await LeadStatus.create({ status_name, color, order })

    return NextResponse.json({ message: "Lead Status created successfully", data }, { status: 201 })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// ✅ GET - Fetch all customers
export async function GET() {
  try {
    await dbConnect();
    const data = await LeadStatus.find().sort({ order: 1 }).lean();
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
