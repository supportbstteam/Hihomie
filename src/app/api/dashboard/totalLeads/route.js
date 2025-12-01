import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import LeadStatus from '../../../../models/LeadStatus'
import CardAssignUser from '../../../../models/CardAssignUser'

export async function GET(req) {
  const { searchParams } = req.nextUrl;
  const userId = searchParams.get('userId');

  if (userId !== "68a2eeb6f31c60d58b33191e") {
    const totalLeads = await CardAssignUser.find({ userId: userId }).lean();
    const result = await CardAssignUser.aggregate([
      // Stage 1: Find the user's assigned card
      {
        $match: { userId: userId }
      },

      // Stage 2: Use a Pipelined Lookup
      {
        $lookup: {
          from: "leadstatuses",
          let: { lookupCardId: "$cardId" },
          pipeline: [
            { $unwind: "$cards" },
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: [{ $toObjectId: "$$lookupCardId" }, "$cards._id"] },
                    { $ne: [{ $toObjectId: "68c297a3212f4d647f1c1087" }, "$_id"] }
                  ]
                }
              }
            },
            { $project: { _id: 0, attended: "true" } }
          ],
          as: "attended"
        }
      },
      {
        $unwind: {
          path: '$attended',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          attendedb: {
            $cond: {
              if: { $eq: ["$attended.attended", "true"] },
              then: true,
              else: false
            }
          }
        }
      },
      {
        $group: {
          _id: null,
          attendedCount: { $sum: { $cond: { if: "$attendedb", then: 1, else: 0 } } }
        }
      },
    ]);
    const totalLeadsCount = totalLeads.length;
    const user_attended_count = result[0].attendedCount;
    return NextResponse.json({ message: 'Total Leads fetched successfully', data: [totalLeadsCount, user_attended_count], successTag: "get_total_lead" }, { status: 200 })
  }

  try {
    await dbConnect()

    const result = await LeadStatus.aggregate([
      {
        $group: {
          _id: null, // Group all documents into a single bucket
          totalItemCount: { $sum: { $size: "$cards" } }, // Sum up the size of the 'cards' array for each doc
        },
      },
    ]);

    const leadsAttended = await LeadStatus.aggregate([
      {
        // 1. Deconstruct the 'cards' array field
        $unwind: "$cards",
      },
      {
        // 2. Filter the resulting documents to include only those
        //    where the unwound card's status matches the target
        $match: {
          "cards.status": { $ne: "68c297a3212f4d647f1c1087" }
        },
      },
      {
        // 3. Group all matching cards into a single bucket
        $group: {
          _id: null,
          totalCardCount: { $sum: 1 }, // Count the number of documents (which are now individual cards)
        },
      },
    ]);

    const totalLeads = result[0].totalItemCount;
    const contactedLeads = leadsAttended[0].totalCardCount;

    return NextResponse.json({ message: 'Total Leads fetched successfully', data: [totalLeads, contactedLeads], successTag: "get_total_lead" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
