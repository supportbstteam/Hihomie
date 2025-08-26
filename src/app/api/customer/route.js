import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/db'
import Customer from '@/models/Customer'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import LeadStatus from '@/models/LeadStatus'

export async function POST(req) {

    try {
        const { first_name, last_name, email, phone, origin, automatic, password,selectedColId } = await req.json()

         const newCard = {
            first_name,
            last_name,
            email,
            phone,
            origin,
            automatic,
            password
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


    return NextResponse.json({customer: userData,},{ status: 201 })
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// export async function PUT(req) {
//   try {
//     const { id, first_name, last_name, phone, origin, automatic, email,colId } = await req.json();

//     await dbConnect();

//     console.log(colId)

    // 1. Pehle customer nikaalo
    // const existingCustomer = await Customer.findById(id);
    // if (!existingCustomer) {
    //   return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    // }

    // // 2. Agar email change kar raha hai to check karo ki dusre customer ke paas to nahi hai
    // if (email && email !== existingCustomer.email) {
    //   const emailExists = await Customer.findOne({ email });
    //   if (emailExists) {
    //     return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    //   }
    // }

    // // 3. Update karo
    // const user = await Customer.findByIdAndUpdate(
    //   id,
    //   { first_name, last_name, phone, origin, automatic, email },
    //   { new: true }
    // );

    // const { password: _, ...userData } = user.toObject();

    // return NextResponse.json(
    //   { message: "Customer updated successfully", customer: userData },
    //   { status: 200 }
    // );
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

import mongoose from "mongoose";

export async function PUT(req) {
  try {
    const { colId, id, first_name, last_name, phone, origin, automatic, email } = await req.json();


    console.log(colId + " " + id)

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
          "cards.$.first_name": first_name,
          "cards.$.last_name": last_name,
          "cards.$.phone": phone,
          "cards.$.origin": origin,
          "cards.$.automatic": automatic,
          "cards.$.email": email,
        },
      },
      { new: true }
    );

    if (!updatedColumn) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
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

