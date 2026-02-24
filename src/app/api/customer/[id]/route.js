import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import LeadStatus from '@/models/LeadStatus'
import CardAssignUser from '@/models/CardAssignUser';

export async function DELETE(req, { params }) {
  // return NextResponse.json({ message: "Lead Deleted successfully"}, { status: 200 });
  try {
    await dbConnect();

    const { id } = await params; // 👈 capture id from URL

    await CardAssignUser.deleteMany({ cardId: id });

    const deletedLead = await LeadStatus.findOneAndUpdate(
      { "cards._id": id },
      { $pull: { cards: { _id: id } } }
    );

    if (!deletedLead) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Lead Deleted successfully"}, { status: 200 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
