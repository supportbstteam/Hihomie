import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import LeadStatus from '@/models/LeadStatus'
import Increment from '@/models/Increment';


export async function POST(req) {

  try {
    const { token, lead_title, surname, first_name, last_name, email, phone, snake_case, operation, reserved_property, price_property, net_earnings, catalonia, monthly_net_earnings, minimum_savings, down_payment, additional_security, paying_any_other_loans, pay_on_other_loans, old_are_you, registry_ASNEF, mortgage, second_monthly_net_earnings, second_paying_any_other_loans, owner_property, campaign } = await req.json()
    await dbConnect();

    // const leadStatusData = await LeadStatus.findOneAndUpdate({ status_name: 'Nuevo lead' });


    if (token != '2y:5254polkiju69852tokenther5895sdsd1sd477sd477dslhashdsfoiasdfkcheck') {
      return NextResponse.json({ error: 'You are not authorized' }, { status: 500 })
    }

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

    let lead_status_id = '68c297a3212f4d647f1c1087';

    const newCard = {
      lead_title: maxNumber,
      surname,
      first_name,
      last_name,
      phone,
      email,
      snake_case,
      operation,
      reserved_property,
      price_property,
      net_earnings,
      catalonia,
      monthly_net_earnings,
      minimum_savings,
      down_payment,
      additional_security,
      paying_any_other_loans,
      pay_on_other_loans,
      old_are_you,
      registry_ASNEF,
      mortgage,
      second_monthly_net_earnings,
      second_paying_any_other_loans,
      owner_property,
      campaign,
      status: lead_status_id,
      property_enquiry: 'Online',
    };

    // Find the LeadStatus by ID and push the new card
    const updatedColumn = await LeadStatus.findByIdAndUpdate(
      lead_status_id,
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
export async function GET(req) {
  try {

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

    return NextResponse.json(maxNumber, { status: 200 })
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}











