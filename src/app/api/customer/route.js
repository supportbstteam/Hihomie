import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/db'
import Customer from '@/uploads/models/Customer'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import LeadStatus from '@/uploads/models/LeadStatus'
import CardAssignUser from '@/uploads/models/CardAssignUser'

export async function POST(req) {

  try {
    const { lead_title, surname, first_name, last_name, company, designation, email, phone, lead_value, assigned, type_of_opration, customer_situation, purchase_status, commercial_notes, manager_notes, detailsData, addressDetailsData, selectedColId, contacted, contract_signed } = await req.json()

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
      status: selectedColId,
      type_of_opration,
      customer_situation,
      purchase_status,
      commercial_notes,
      manager_notes,
      detailsData,
      addressDetailsData,
      contacted,
      contract_signed,
    };

    // Find the LeadStatus by ID and push the new card
    const updatedColumn = await LeadStatus.findByIdAndUpdate(
      selectedColId,
      { $push: { cards: newCard } },
      { new: true } // return the updated document
    );

    // these two lines are used to assign the card to the manager or staff or any user at the time of lead creation
    const newCardId = updatedColumn.cards[updatedColumn.cards.length - 1]._id;
    await CardAssignUser.create({ userId: assigned, cardId: newCardId, colId: selectedColId })

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
export async function GET(req) {
  const { searchParams } = req.nextUrl;
  const email_like = searchParams.get("email_like");
  try {
    await dbConnect();

    const users = await LeadStatus.aggregate([
      { $unwind: "$cards" },
      {
        $match: {
          $or: [
            { "cards.email": { $regex: email_like, $options: "i" } },
            {
              $expr: {
                $regexMatch: {
                  input: { $concat: ["$cards.first_name", " ", "$cards.last_name"] },
                  regex: email_like,
                  options: "i",
                },
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 0,
          name: { $concat: ["$cards.first_name", " ", "$cards.last_name"] },
          email: "$cards.email",
        },
      },
    ]);

    return NextResponse.json(users, { status: 201 })
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import mongoose from "mongoose";

export async function PUT(req) {
  try {

    const { colId, id, lead_title, surname, first_name, last_name, company, designation, email, phone, lead_value, assigned, status, type_of_opration, customer_situation, purchase_status, commercial_notes, manager_notes, detailsData, addressDetailsData, contacted, contract_signed } = await req.json()


    await dbConnect();


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
          "cards.$.contacted": contacted,
          "cards.$.contract_signed": contract_signed,
        },
      },
      { new: true }
    );


    if (status != colId) {

      // 1️⃣ Find source column
      const sourceCol = await LeadStatus.findById(colId);
      if (!sourceCol) {
        return NextResponse.json({ error: "Source column not found" }, { status: 404 });
      }

      // 2️⃣ Find the card inside source
      const cardIndex = sourceCol.cards.findIndex(
        (c) => c._id.toString() === id
      );
      if (cardIndex === -1) {
        return NextResponse.json({ error: "Card not found in source column" }, { status: 404 });
      }

      // 3️⃣ Remove card from source
      const [movedCard] = sourceCol.cards.splice(cardIndex, 1);
      await sourceCol.save();

      // 4️⃣ Add card into destination column
      const destCol = await LeadStatus.findById(status);
      if (!destCol) {
        return NextResponse.json({ error: "Destination column not found" }, { status: 404 });
      }

      destCol.cards.push(movedCard);
      await destCol.save();
    }


    const { password: _, ...userData } = updatedColumn.cards.toObject();

    if (!updatedColumn) {
      return NextResponse.json({ error: "Card not found", customer: userData }, { status: 404 });
    }

    return NextResponse.json({ message: "Card updated successfully", data: updatedColumn }, { status: 200 });

  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}




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

    return NextResponse.json({ message: "Customer deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// export async function DELETE(req, { params }) {
//   try {
//     await dbConnect();

//     const { id } = params; // 👈 capture id from URL

//     const deletedUser = await Customer.findByIdAndDelete(id);

//     if (!deletedUser) {
//       return NextResponse.json({ error: "Customer not found" }, { status: 404 });
//     }

//     return NextResponse.json({ message: "Customer deleted successfully" }, { status: 200 });
//   } catch (error) {
//     console.error("DELETE Error:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

