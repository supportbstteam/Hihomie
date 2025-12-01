import { NextResponse } from 'next/server'
import LeadStatus from "../../../../models/LeadStatus";
import dbConnect from "@/lib/db";
import getUserFromServerSession from '@/lib/getUserFromServerSession';

export async function GET() {
  const user = await getUserFromServerSession();

  await dbConnect();

  if (user.role !== "admin") {
    try {
      const cards = await LeadStatus.aggregate([
        {
          $lookup: {
            from: "cardassignusers",
            let: { userIdStr: { $toString: user.id } },
            pipeline: [
              { $match: { $expr: { $eq: ["$userId", "$$userIdStr"] } } },
              { $project: { cardId: 1, _id: 0 } }
            ],
            as: "assignedCards"
          }
        },
        {
          $addFields: {
            cards: {
              $filter: {
                input: "$cards",
                as: "card",
                cond: { $in: [{ $toString: "$$card._id" }, "$assignedCards.cardId"] },
              },
            },
          },
        },
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


export async function DELETE(req) {
  try {
    await dbConnect();

    const { cardId, columId } = await req.json()// comes from URL

    const updatedStatus = await LeadStatus.findByIdAndUpdate(
      columId,
      { $pull: { cards: { _id: cardId } } },
      { new: true }
    );

    if (!updatedStatus) {
      return NextResponse.json({ success: false, message: "Column not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Card deleted successfully", data: updatedStatus });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
