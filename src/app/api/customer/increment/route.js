import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import LeadStatus from '@/models/LeadStatus'

export async function GET() {
  try {

    await dbConnect();


    // const statuses = await LeadStatus.find();

    // // Step 2: Collect all cards
    // let allCards = [];

    // statuses.forEach(status => {
    //   status.cards.forEach(card => {
    //     allCards.push({
    //       statusId: status._id,
    //       cardId: card._id,
    //       createdAt: card.createdAt,
    //     });
    //   });
    // });

    // // Step 3: Sort cards by createdAt
    // allCards.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // // Step 4: Assign global numbering with arrayFilters
    // let counter = 1;

    // for (let item of allCards) {
    //   await LeadStatus.updateOne(
    //     { _id: item.statusId },
    //     {
    //       $set: { "cards.$[elem].lead_title": counter }
    //     },
    //     {
    //       arrayFilters: [{ "elem._id": item.cardId }],
    //       strict: false
    //     }
    //   );

    //   counter++;
    // }

    // console.log("DONE — Updated total:", counter - 1);



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