import { NextResponse } from 'next/server'
import LeadStatus from "@/models/LeadStatus";
import dbConnect from "@/lib/db";
import getUserFromServerSession from '@/lib/getUserFromServerSession';

export async function GET(req) {
  const user = await getUserFromServerSession();
  await dbConnect();

  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page")) || 1;
  const limit = 25;
  const skip = (page - 1) * limit;

  // ====================== NON-ADMIN ===========================
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
        { $unwind: "$cards" },

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

        {
          $lookup: {
            from: "documents",
            let: { cardIdStr: { $toString: "$cards._id" } },
            pipeline: [
              { $match: { $expr: { $eq: ["$cardId", "$$cardIdStr"] } } },
              { $project: { _id: 0, cardId: 1 } }
            ],
            as: "docs"
          }
        },

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

        {
          $project: {
            _id: "$cards._id",
            leadStatusname: "$status_name",
            name: "$cards.lead_title",
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
            contacted: "$cards.contacted",
            contract_signed: "$cards.contract_signed",
            bankDetailsData: "$cards.bankDetailsData",
            detailsData: "$cards.detailsData",
            addressDetailsData: "$cards.addressDetailsData",
            leadStatusId: "$_id",
            createdAt: "$cards.createdAt",
            color: 1,
            users: "$users",
            documentSubmitted: {
              $cond: [
                { $gt: [{ $size: "$docs" }, 0] },
                "yes",
                "no"
              ]
            }
          }
        },

        { $sort: { createdAt: -1 } },

        // ⭐⭐⭐ Pagination + Count ⭐⭐⭐
        {
          $facet: {
            data: [
              { $skip: skip },
              { $limit: limit }
            ],
            totalCount: [
              { $count: "count" }
            ]
          }
        }
      ]);

      const totalCount = cards[0].totalCount[0]?.count || 0;

      return NextResponse.json(
        { 
          cards: cards[0].data, 
          totalCount,
          page,
          totalPages: Math.ceil(totalCount / limit)
        },
        { status: 200 }
      );

    } catch (error) {
      console.error("Aggregation Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  // ====================== ADMIN ===========================
  try {
    const cards = await LeadStatus.aggregate([
      { $unwind: "$cards" },

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

      {
        $lookup: {
          from: "documents",
          let: { cardIdStr: { $toString: "$cards._id" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$cardId", "$$cardIdStr"] } } },
            { $project: { _id: 0, cardId: 1 } }
          ],
          as: "docs"
        }
      },

      {
        $project: {
          _id: "$cards._id",
          leadStatusname: "$status_name",
          name: "$cards.lead_title",
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
          contacted: "$cards.contacted",
          contract_signed: "$cards.contract_signed",
          bankDetailsData: "$cards.bankDetailsData",
          detailsData: "$cards.detailsData",
          addressDetailsData: "$cards.addressDetailsData",
          leadStatusId: "$_id",
          createdAt: "$cards.createdAt",
          color: 1,
          users: "$users",
          documentSubmitted: {
            $cond: [
              { $gt: [{ $size: "$docs" }, 0] },
              "yes",
              "no"
            ]
          }
        }
      },

      { $sort: { createdAt: -1 } },

      // ⭐⭐⭐ Pagination + Count ⭐⭐⭐
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limit }
          ],
          totalCount: [
            { $count: "count" }
          ]
        }
      }
    ]);

    const totalCount = cards[0].totalCount[0]?.count || 0;

    return NextResponse.json(
      { 
        cards: cards[0].data, 
        totalCount,
        page,
        totalPages: Math.ceil(totalCount / limit)
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Aggregation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
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
