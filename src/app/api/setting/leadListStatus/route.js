import { NextResponse } from 'next/server'
import LeadStatus from "@/models/LeadStatus";
import CardAssignUser from "@/models/CardAssignUser";
import User from "@/models/User";
import dbConnect from "@/lib/db";


// export async function GET(req) {
//   await dbConnect();

//   try {
//     const leadStatuses = await LeadStatus.aggregate([
//       { $unwind: "$cards" }, // Break out each card

//       // Lookup assigned users for each card
//       {
//         $lookup: {
//           from: "cardassignusers", // collection name (lowercase + plural)
//           localField: "cards._id", // card _id in LeadStatus
//           foreignField: "cardId",  // stored cardId in CardAssignUser
//           as: "assignedUsers",
//         },
//       },

//       // Lookup actual user details
//       {
//         $lookup: {
//           from: "users",
//           let: { userIds: "$assignedUsers.userId" },
//           pipeline: [
//             { $match: { $expr: { $in: ["$_id", { $map: { input: "$$userIds", as: "id", in: { $toObjectId: "$$id" } } }] } } },
//             { $project: { password: 0 } } // remove password
//           ],
//           as: "users"
//         }
//       },

//       // Reshape card data and rename lead_title -> name
//       {
//         $project: {
//           _id: 0,
//           leadStatusId: "$_id",
//           leadStatusName: "$status_name",
//           color: 1,
//           card: {
//             _id: "$cards._id",
//             name: "$cards.lead_title", // 🔥 Rename
//             surname: "$cards.surname",
//             first_name: "$cards.first_name",
//             last_name: "$cards.last_name",
//             company: "$cards.company",
//             designation: "$cards.designation",
//             email: "$cards.email",
//             phone: "$cards.phone",
//             lead_value: "$cards.lead_value",
//             assigned: "$cards.assigned",
//             status: "$cards.status",
//             type_of_opration: "$cards.type_of_opration",
//             customer_situation: "$cards.customer_situation",
//             purchase_status: "$cards.purchase_status",
//             commercial_notes: "$cards.commercial_notes",
//             manager_notes: "$cards.manager_notes",
//             detailsData: "$cards.detailsData",
//             addressDetailsData: "$cards.addressDetailsData",
//             users: "$users" // 🔥 Attach users
//           }
//         }
//       },

//       // Group back by lead status
//       {
//         $group: {
//           _id: { leadStatusId: "$leadStatusId", leadStatusName: "$leadStatusName", color: "$color" },
//           cards: { $push: "$card" }
//         }
//       },

//       {
//         $project: {
//           _id: 0,
//           leadStatusId: "$_id.leadStatusId",
//           leadStatusName: "$_id.leadStatusName",
//           color: "$_id.color",
//           cards: 1
//         }
//       }
//     ]);

//      return NextResponse.json({ leadStatuses }, { status: 201 })

//   } catch (error) {
//     console.error(error);
//      return NextResponse.json({  error: error.message }, { status: 201 })
//   }
// }

// export async function GET(req) {
//   await dbConnect();

//   try {
//     const leadStatuses = await LeadStatus.aggregate([
//       { $unwind: "$cards" }, // Flatten cards

//       // 🔥 Lookup assigned users by converting cardId to string
//       {
//         $lookup: {
//           from: "cardassignusers",
//           let: { cardIdStr: { $toString: "$cards._id" } },
//           pipeline: [
//             { $match: { $expr: { $eq: ["$cardId", "$$cardIdStr"] } } },
//             { $project: { userId: 1, _id: 0 } }
//           ],
//           as: "assignedUsers"
//         }
//       },

//       // 🔥 Lookup actual user data by converting userId to ObjectId
//       {
//         $lookup: {
//           from: "users",
//           let: { userIds: "$assignedUsers.userId" },
//           pipeline: [
//             {
//               $match: {
//                 $expr: {
//                   $in: [
//                     "$_id",
//                     {
//                       $map: {
//                         input: "$$userIds",
//                         as: "uid",
//                         in: { $toObjectId: "$$uid" }
//                       }
//                     }
//                   ]
//                 }
//               }
//             },
//             { $project: { password: 0 } } // remove password field
//           ],
//           as: "users"
//         }
//       },

//       // 🔥 Reshape card data
//       {
//         $project: {
//           _id: 0,
//           leadStatusId: "$_id",
//           leadStatusName: "$status_name",
//           color: 1,
//           card: {
//             _id: "$cards._id",
//             name: "$cards.lead_title", // renamed
//             surname: "$cards.surname",
//             first_name: "$cards.first_name",
//             last_name: "$cards.last_name",
//             company: "$cards.company",
//             designation: "$cards.designation",
//             email: "$cards.email",
//             phone: "$cards.phone",
//             lead_value: "$cards.lead_value",
//             assigned: "$cards.assigned",
//             status: "$cards.status",
//             type_of_opration: "$cards.type_of_opration",
//             customer_situation: "$cards.customer_situation",
//             purchase_status: "$cards.purchase_status",
//             commercial_notes: "$cards.commercial_notes",
//             manager_notes: "$cards.manager_notes",
//             detailsData: "$cards.detailsData",
//             addressDetailsData: "$cards.addressDetailsData",
//             users: "$users"
//           }
//         }
//       },

//       // Group back by Lead Status
//       {
//         $group: {
//           _id: {
//             leadStatusId: "$leadStatusId",
//             leadStatusName: "$leadStatusName",
//             color: "$color"
//           },
//           cards: { $push: "$card" }
//         }
//       },

//       {
//         $project: {
//           _id: 0,
//           leadStatusId: "$_id.leadStatusId",
//           leadStatusName: "$_id.leadStatusName",
//           color: "$_id.color",
//           cards: 1
//         }
//       }
//     ]);

//    return NextResponse.json({ leadStatuses }, { status: 201 })
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({  error: error.message }, { status: 500 })
//   }
// }


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
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}