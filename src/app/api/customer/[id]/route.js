import { NextResponse } from 'next/server'

import dbConnect from '@/lib/db'
import Customer from '../../../../models/Customer'
import LeadStatus from '../../../../models/LeadStatus'

export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const { id } = params; // 👈 capture id from URL

    const deletedUser = await LeadStatus.findOneAndUpdate(
      { "cards._id": id },
      { $pull: { cards: { _id: id } } }
    );

    if (!deletedUser) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const data = {
      colId: deletedUser._id,
      cardId: id
    }

    return NextResponse.json({ message: "Customer deleted successfully", data }, { status: 200 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
