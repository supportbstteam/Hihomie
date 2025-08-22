import { NextResponse } from 'next/server'

import dbConnect from '@/lib/db'
import Customer from '@/models/Customer'

export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const { id } = params; // 👈 take id from URL

    const deletedUser = await Customer.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json(
      { 
        message: "Customer deleted successfully", 
        _id: deletedUser._id   // 👈 id bhi bhej do
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}