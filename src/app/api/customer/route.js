import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/db'
import Customer from '@/models/Customer'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import LeadStatus from '@/models/LeadStatus'
import CardAssignUser from '@/models/CardAssignUser'
import mongoose from "mongoose";
import Increment from '@/models/Increment'

export async function POST(req) {

  try {
    const { lead_title, surname, first_name, last_name, company, designation, email, phone, lead_value, assigned, type_of_opration, customer_situation, purchase_status, commercial_notes, manager_notes, detailsData, addressDetailsData, selectedColId, contacted, contract_signed, origin } = await req.json()
    
    let final_origin = origin || "online";

    await dbConnect();

    const maxCard = await LeadStatus.aggregate([
      { $unwind: "$cards" },
      {
        $group: {
          _id: null,
          maxNumber: { $max: { $toInt: "$cards.lead_title" } }
        }
      }
    ]);

    let maxNumber = maxCard.length > 0 ? maxCard[0].maxNumber : 0;

    if (maxNumber === 0) {
      maxNumber = 1;
    } else {
      maxNumber += 1;
    }


    const newCard = {
      lead_title: maxNumber,
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
      property_enquiry: final_origin,
    };




    // Find the LeadStatus by ID and push the new card
    const updatedColumn = await LeadStatus.findByIdAndUpdate(
      selectedColId,
      { $push: { cards: newCard } },
      { new: true } // return the updated document
    );

    // these two lines are used to assign the card to the manager or staff or any user at the time of lead creation
    const newCardId = updatedColumn.cards[updatedColumn.cards.length - 1]._id;
    if (!assigned || assigned.trim() === "") {
      console.log("No user assigned, skipping assignment creation");
    } else {
      await CardAssignUser.create({
        userId: assigned,
        cardId: newCardId,
        colId: selectedColId
      });
    }

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

export async function PUT(req) {
  try {
    const {
      colId, id, surname, first_name, last_name,
      company, designation, email, phone, lead_value,
      assigned, status, type_of_opration, customer_situation,
      purchase_status, commercial_notes, manager_notes,
      detailsData, addressDetailsData, contacted, contract_signed
    } = await req.json();

    await dbConnect();


    // Validation
    if (!colId || !id) {
      return NextResponse.json({ error: "colId and id are required" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(colId)) {
      return NextResponse.json({ error: "Invalid colId" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid card id" }, { status: 400 });
    }


    // 1️⃣ Update the card in its current column
    const updatedColumn = await LeadStatus.findOneAndUpdate(
      { _id: colId, "cards._id": id },
      {
        $set: {
          // "cards.$.lead_title": lead_title,
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


    // If no card updated → card does not exist
    if (!updatedColumn) {
      return NextResponse.json({
        error: "Card not found in this column",
      }, { status: 404 });
    }

    // Extract updated card after update
    const updatedCard = updatedColumn.cards.id(id);

    // 2️⃣ If status changed, move the card
    if (status != colId) {

      // Source column
      const sourceCol = await LeadStatus.findById(colId);
      if (!sourceCol) {
        return NextResponse.json({ error: "Source column not found" }, { status: 404 });
      }

      const cardIndex = sourceCol.cards.findIndex(
        (c) => c._id.toString() === id
      );
      if (cardIndex === -1) {
        return NextResponse.json({ error: "Card not found in source column" }, { status: 404 });
      }

      const [movedCard] = sourceCol.cards.splice(cardIndex, 1);
      await sourceCol.save();

      // Destination column
      const destCol = await LeadStatus.findById(status);
      if (!destCol) {
        return NextResponse.json({ error: "Destination column not found" }, { status: 404 });
      }

      destCol.cards.push(movedCard);
      await destCol.save();
    }

    // 3️⃣ Final return
    return NextResponse.json({
      message: "Card updated successfully",
      data: updatedCard,
    }, { status: 200 });

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


