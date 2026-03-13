import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import LeadStatus from '@/models/LeadStatus'
import CardAssignUser from '@/models/CardAssignUser';
import { t } from "@/components/translations";

export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const { id } = await params; // 👈 capture id from URL
    
    await CardAssignUser.deleteMany({ cardId: id });

    const deletedLead = await LeadStatus.findOneAndUpdate(
      { "cards._id": id },
      { $pull: { cards: { _id: id } } }
    );

    if (!deletedLead) {
      return NextResponse.json({ error: t("tm8") }, { status: 404 });
    }

    return NextResponse.json({ message: t("tm9") }, { status: 200 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: t("internal_se") }, { status: 500 });
  }
}
