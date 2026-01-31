import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import LeadStatus from '@/models/LeadStatus'
import getUserFromServerSession from '@/lib/getUserFromServerSession'
import { assign } from 'nodemailer/lib/shared'
import CardAssignUser from '@/models/CardAssignUser'

export async function POST(req) {
  try {

    const { status_name, color, order } = await req.json()

    await dbConnect() // Connect to DB

    const data = await LeadStatus.create({ status_name, color, order })

    return NextResponse.json({ message: "Lead Status created successfully", data }, { status: 201 })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET() {
  const user = await getUserFromServerSession();

  await dbConnect();

  if (user.role !== "admin") {
    try {
      const pipeline = [
        // 1) create string versions of all cards' _id for matching
        {
          $addFields: {
            _cardIdsStr: {
              $map: {
                input: { $ifNull: ["$cards", []] },
                as: "c",
                in: { $toString: "$$c._id" }
              }
            }
          }
        },

        // 2) lookup assignments for this user (your original lookup, unchanged)
        {
          $lookup: {
            from: "cardassignusers",
            let: { userIdStr: { $toString: user.id } }, // user.id from your JS context
            pipeline: [
              { $match: { $expr: { $eq: ["$userId", "$$userIdStr"] } } },
              { $project: { cardId: 1, _id: 0 } }
            ],
            as: "assignedCards"
          }
        },

        // 3) lookup documents that reference these cards (docs.cardId is assumed to be stored as string)
        {
          $lookup: {
            from: "documents",
            let: { cardIds: "$_cardIdsStr" },
            pipeline: [
              { $match: { $expr: { $in: ["$cardId", "$$cardIds"] } } },
              { $project: { _id: 0, cardId: 1 /*, other fields if needed */ } }
            ],
            as: "docs"
          }
        },

        // 4) project fields and filter/map the cards array:
        {
          $project: {
            _id: "$_id",
            status_name: "$status_name",
            color: "$color",
            order: "$order",
            // filter only cards assigned to this user, then map each card to add documentSubmitted
            cards: {
              $map: {
                input: {
                  $filter: {
                    input: { $ifNull: ["$cards", []] },
                    as: "card",
                    // check if string(card._id) exists in assignedCards.cardId
                    cond: {
                      $in: [{ $toString: "$$card._id" }, "$assignedCards.cardId"]
                    }
                  }
                },
                as: "card",
                in: {
                  $mergeObjects: [
                    "$$card",
                    {
                      documentSubmitted: {
                        $cond: [
                          {
                            $gt: [
                              {
                                $size: {
                                  $filter: {
                                    input: "$docs",
                                    as: "d",
                                    cond: { $eq: ["$$d.cardId", { $toString: "$$card._id" }] }
                                  }
                                }
                              },
                              0
                            ]
                          },
                          "yes",
                          "no"
                        ]
                      }
                    }
                  ]
                }
              }
            }
          }
        },

        //  SORT CARDS BY createdAt DESC
        {
          $addFields: {
            cards: {
              $sortArray: {
                input: "$cards",
                sortBy: { createdAt: -1 }
              }
            }
          }
        },

        // 5) sort and cleanup if needed
        { $sort: { order: 1 } },

        // remove temporary arrays from the output
        { $project: { _cardIdsStr: 0, assignedCards: 0, docs: 0 } }
      ];

      const data = await LeadStatus.aggregate(pipeline);

      return NextResponse.json({ data }, { status: 201 })
    } catch (error) {
      console.error("GET Error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }

  try {
    const data = await LeadStatus.aggregate([
      // 1) build string version of cards' _id for matching
      {
        $addFields: {
          _cardIdsStr: {
            $map: {
              input: { $ifNull: ["$cards", []] },
              as: "c",
              in: { $toString: "$$c._id" }
            }
          }
        }
      },

      // 2) lookup assignments (you already had this)
      {
        $lookup: {
          from: "cardassignusers",
          let: { cardIds: "$_cardIdsStr" },
          pipeline: [
            { $match: { $expr: { $in: ["$cardId", "$$cardIds"] } } },
            { $project: { _id: 0, cardId: 1, userId: 1 } }
          ],
          as: "assignments"
        }
      },

      // 3) lookup documents that reference these cards
      {
        $lookup: {
          from: "documents",
          let: { cardIds: "$_cardIdsStr" },
          pipeline: [
            // find any documents whose cardId (string) is in the cardIds list
            { $match: { $expr: { $in: ["$cardId", "$$cardIds"] } } },
            // include fields you need; here we only need cardId and maybe status/date
            { $project: { _id: 0, cardId: 1, userId: 1 } }
          ],
          as: "docs"
        }
      },

      // 4) map over cards and attach assignedUsers + documentSubmitted
      {
        $addFields: {
          cards: {
            $map: {
              input: { $ifNull: ["$cards", []] },
              as: "c",
              in: {
                $mergeObjects: [
                  "$$c",
                  {
                    // assignedUsers as before
                    assignedUsers: {
                      $map: {
                        input: {
                          $filter: {
                            input: "$assignments",
                            as: "a",
                            cond: { $eq: ["$$a.cardId", { $toString: "$$c._id" }] }
                          }
                        },
                        as: "m",
                        in: "$$m.userId"
                      }
                    },
                    // documentSubmitted: "Yes" if any matching doc exists, otherwise "No"
                    documentSubmitted: {
                      $cond: [
                        {
                          $gt: [
                            {
                              $size: {
                                $filter: {
                                  input: "$docs",
                                  as: "d",
                                  cond: { $eq: ["$$d.cardId", { $toString: "$$c._id" }] }
                                }
                              }
                            },
                            0
                          ]
                        },
                        "yes",
                        "no"
                      ]
                    }
                  }
                ]
              }
            }
          }
        }
      },

      // 🔥 SORT CARDS BY createdAt DESC
      {
        $addFields: {
          cards: {
            $sortArray: {
              input: "$cards",
              sortBy: { createdAt: -1 }
            }
          }
        }
      },

      // 5) sort + cleanup temporaries
      { $sort: { order: 1 } },
      { $project: { _cardIdsStr: 0, assignments: 0, docs: 0 } }
    ]);

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ GET - Fetch all customers
export async function PUT(req) {
  try {
    await dbConnect();
    const { sourceColId, destColId, cardId } = await req.json();

     const user = await getUserFromServerSession();

    if (!sourceColId || !destColId || !cardId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1️⃣ Find source column
    const sourceCol = await LeadStatus.findById(sourceColId);
    if (!sourceCol) {
      return NextResponse.json({ error: "Source column not found" }, { status: 404 });
    }

    // 2️⃣ Find the card inside source
    const cardIndex = sourceCol.cards.findIndex(
      (c) => c._id.toString() === cardId
    );
    if (cardIndex === -1) {
      return NextResponse.json({ error: "Card not found in source column" }, { status: 404 });
    }

    // 3️⃣ Remove card from source
    const [movedCard] = sourceCol.cards.splice(cardIndex, 1);
    await sourceCol.save();

    movedCard.status = destColId;

    // 4️⃣ Add card into destination column
    const destCol = await LeadStatus.findById(destColId);
    if (!destCol) {
      return NextResponse.json({ error: "Destination column not found" }, { status: 404 });
    }

    destCol.cards.push(movedCard);
    await destCol.save();

    if(user.role != 'admin'){
        await CardAssignUser.findOneAndUpdate(
          { userId: user.id, cardId: cardId },  // find record
          { colId: destColId },                 // update field
          { new: true, upsert: true }           // new doc return + create if not exist
        );
    }else{

      await CardAssignUser.updateMany(
        { cardId: cardId },          // find all records with this cardId
        { $set: { colId: destColId } }  // update colId in ALL
      );

    }

    // 5️⃣ Return updated columns
    return NextResponse.json(
      { message: "Card moved successfully", sourceCol, destCol },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


export async function DELETE(req) {
  try {
    await dbConnect();

    const { id } = await req.json()// comes from URL

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const deleted = await LeadStatus.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Record deleted successfully", deleted },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
