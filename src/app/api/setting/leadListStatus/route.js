import { NextResponse } from 'next/server'
import LeadStatus from "@/models/LeadStatus";
import CardAssignUser from "@/models/CardAssignUser";
import User from "@/models/User";
import dbConnect from "@/lib/db";


export async function GET(req) {
  await dbConnect();

  try {
    const cards = await LeadStatus.aggregate([
      { $unwind: "$cards" }, // 🔥 Flatten cards from all statuses

      // 🔥 Lookup assigned users by matching cardId (convert _id -> string)
      {
        $lookup: {
          from: "cardassignusers",
          let: { cardIdStr: { $toString: "$cards._id" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$cardId", "$$cardIdStr"] } } },
            { $project: { userId: 1, _id: 0 } }
          ],
          as: "assignedUsers"
        }
      },

      // 🔥 Lookup actual user data
      {
        $lookup: {
          from: "users",
          let: { userIds: "$assignedUsers.userId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: [
                    "$_id",
                    {
                      $map: {
                        input: "$$userIds",
                        as: "uid",
                        in: { $toObjectId: "$$uid" }
                      }
                    }
                  ]
                }
              }
            },
            { $project: { password: 0 } }
          ],
          as: "users"
        }
      },

      // 🔥 Final shape of each card
      {
        $project: {
          _id: "$cards._id",
          leadStatusname: "$status_name", 
          name: "$cards.lead_title", // renamed
          surname: "$cards.surname",
          lead_title: "$cards.lead_title",
          first_name: "$cards.first_name",
          last_name: "$cards.last_name",
          company: "$cards.company",
          designation: "$cards.designation",
          email: "$cards.email",
          phone: "$cards.phone",
          lead_value: "$cards.lead_value",
          assigned: "$cards.assigned",
          status: "$cards.status",
          type_of_opration: "$cards.type_of_opration",
          customer_situation: "$cards.customer_situation",
          purchase_status: "$cards.purchase_status",
          commercial_notes: "$cards.commercial_notes",
          manager_notes: "$cards.manager_notes",
          detailsData: "$cards.detailsData",
          addressDetailsData: "$cards.addressDetailsData",
          leadStatusId: "$_id",          // 🔥 LeadStatus ID inside card
          createdAt: "$cards.createdAt",// 🔥 LeadStatus Name inside card
          color: 1,
          users: "$users"                // 🔥 Assigned users
        }
      }
    ]);
    return NextResponse.json({ cards }, { status: 201 })
  } catch (error) {
    console.error("Aggregation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}