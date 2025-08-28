import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/db'
import Customer from '@/models/Customer'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import LeadStatus from '@/models/LeadStatus'

export async function POST(req) {

  try {
    const {lead_title, surname, first_name, last_name, company, designation, email, phone, lead_value, assigned, status, type_of_opration, customer_situation, purchase_status ,commercial_notes, manager_notes, detailsData, addressDetailsData, selectedColId } = await req.json()

    const newCard = {
      lead_title,
        surname,
        first_name,
        last_name,
        company,
        designation,
        phone,
        email,
        lead_value,
        assigned,
        status,
        type_of_opration,
        customer_situation,
        purchase_status,
        commercial_notes,
        manager_notes,
        detailsData,
        addressDetailsData,
    };

    // Find the LeadStatus by ID and push the new card
    const updatedColumn = await LeadStatus.findByIdAndUpdate(
      selectedColId,
      { $push: { cards: newCard } },
      { new: true } // return the updated document
    );

    if (!updatedColumn) {
      return NextResponse.json({ error: 'Column not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Card added successfully', data: updatedColumn }, { status: 200 });

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// ✅ GET - Fetch all customers
export async function GET() {
  try {
    await dbConnect();

    const users = await Customer.find().lean();

    const userData = users.map(({ password, ...rest }) => ({
      ...rest,
    }));


    return NextResponse.json({ customer: userData, }, { status: 201 })
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import mongoose from "mongoose";

export async function PUT(req) {
  try {

    const {colId, id,lead_title, surname, first_name, last_name, company, designation, email, phone, lead_value, assigned, status, type_of_opration, customer_situation, purchase_status ,commercial_notes, manager_notes, detailsData, addressDetailsData } = await req.json()

    await dbConnect(colId);

    if (!colId || !id) {
      return NextResponse.json({ error: "colId and id are required" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(colId)) {
      return NextResponse.json({ error: "Invalid colId" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid card id" }, { status: 400 });
    }

    const updatedColumn = await LeadStatus.findOneAndUpdate(
      { _id: colId, "cards._id": id },
      {
        $set: {
          "cards.$.lead_title": lead_title,
          "cards.$.surname": surname,
          "cards.$.first_name": first_name,
          "cards.$.last_name": last_name,
          "cards.$.company": company,
          "cards.$.designation": designation,
          "cards.$.phone": phone,
          "cards.$.email": email,
          "cards.$.lead_value": lead_value,
          "cards.$.assigned": assigned,
          "cards.$.status": status,
          "cards.$.type_of_opration": type_of_opration,
          "cards.$.customer_situation": customer_situation,
          "cards.$.purchase_status": purchase_status,
          "cards.$.commercial_notes": commercial_notes,
          "cards.$.manager_notes": manager_notes,
          "cards.$.detailsData": detailsData,
          "cards.$.addressDetailsData": addressDetailsData,
        },
      },
      { new: true }
    );

    const { password: _, ...userData } = updatedColumn.cards.toObject();


    console.log(updatedColumn)

    if (!updatedColumn) {
      return NextResponse.json({ error: "Card not found", customer: userData }, { status: 404 });
    }

    return NextResponse.json({ message: "Card updated successfully", data: updatedColumn }, { status: 200 });

  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}




// ✅ GET - Fetch all customers

export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const { id } = params; // 👈 capture id from URL

    const deletedUser = await Customer.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Customer deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

