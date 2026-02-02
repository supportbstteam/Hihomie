import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/db'
import Customer from '@/models/Customer'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import LeadStatus from '@/models/LeadStatus'
import CardAssignUser from '@/models/CardAssignUser'
import mongoose from "mongoose";
import getUserFromServerSession from '@/lib/getUserFromServerSession'

export async function POST(req) {



  try {
    const { token,lead_title, surname, first_name, last_name, email, phone,} = await req.json()
     await dbConnect();
    const leadStatusData = await LeadStatus.findOneAndUpdate({ status_name: "Prioritarios" });
    if(token != '2y:5254polkiju69852tokenther5895sdsd1sd477sd477dslhashdsfoiasdfkcheck'){
       return NextResponse.json({ error: 'You are not authorized' }, { status: 500 })
    }
  
    const newCard = {
      lead_title,
      surname,
      first_name,
      last_name,
      phone,
      email,
      status: leadStatusData._id,
    };

    // Find the LeadStatus by ID and push the new card
    const updatedColumn = await LeadStatus.findByIdAndUpdate(
      leadStatusData._id,
      { $push: { cards: newCard } },
      { new: true } // return the updated document
    );

    // these two lines are used to assign the card to the manager or staff or any user at the time of lead creation
    // const newCardId = updatedColumn.cards[updatedColumn.cards.length - 1]._id;
    // if (!assigned || assigned.trim() === "") {
    //   console.log("No user assigned, skipping assignment creation");
    // } else {
    //   await CardAssignUser.create({
    //     userId: assigned,
    //     cardId: newCardId,
    //     colId: selectedColId
    //   });
    // }

    if (!updatedColumn) {
      return NextResponse.json({ error: 'Column not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Card added successfully', data: updatedColumn }, { status: 200 });

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}













