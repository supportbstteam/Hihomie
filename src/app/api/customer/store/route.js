import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import LeadStatus from '@/models/LeadStatus'


export async function POST(req) {

  try {
    const { token,lead_title, surname, first_name, last_name, email, phone,snake_case} = await req.json()
     await dbConnect();
    const leadStatusData = await LeadStatus.findOneAndUpdate({ status_name: lead_title });
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
      snake_case,
      status: leadStatusData._id,
    };

    // Find the LeadStatus by ID and push the new card
    const updatedColumn = await LeadStatus.findByIdAndUpdate(
      leadStatusData._id,
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













