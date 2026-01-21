import { NextResponse } from "next/server";
import LeadStatus from "@/models/LeadStatus";
import dbConnect from "@/lib/db";
import CardAssignUser from "@/models/CardAssignUser";

export async function POST(req) {
  try {
    await dbConnect();

    const { leads } = await req.json();

    console.log("Received:", leads);

    if (!leads || leads.length === 0) {
      return NextResponse.json(
        { message: "Lead data is required" },
        { status: 400 }
      );
    }

    // Loop and remove each card from its respective column
    for (const lead of leads) {
      await LeadStatus.updateOne(
        { _id: lead.colId },
        { $pull: { cards: { _id: lead.cardId } } }
      );
    }

    const allCardIds = leads.map((l) => l.cardId);

    await CardAssignUser.deleteMany({ cardId: { $in: allCardIds } });

    return NextResponse.json(
      { message: "Delete successful" },
      { status: 201 }
    );

  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


