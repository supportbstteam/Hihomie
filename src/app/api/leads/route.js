import { NextResponse } from "next/server";
import LeadStatus from "@/models/LeadStatus";
import Document from "@/models/Document";

export async function GET(request) {
    const { searchParams } = request.nextUrl;
    const userStatus = searchParams.get("userStatus");

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    let result = [];
    switch (userStatus) {
        case "Pending Documentation":
            const documentSubmittedUser = await Document.distinct("cardId");
            result = await LeadStatus.aggregate([
                {
                    $unwind: "$cards"
                },
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $gte: ["$cards.createdAt", threeMonthsAgo] },
                                { $not: { $in: [{ $toString: "$cards._id" }, documentSubmittedUser] } }
                            ]
                        }
                    }
                },
                {
                    $project: {
                        id: { $toString: "$cards._id" },
                        _id: 0,
                        name: { $concat: ["$cards.first_name", " ", "$cards.last_name"] },
                        email: "$cards.email"
                    }
                }
            ]);
            break;
        case "Contacted Users":
            result = await LeadStatus.aggregate([
                {
                    $unwind: "$cards"
                },
                {
                    $match: {
                        "cards.contacted": "yes",
                        "cards.createdAt": { $gte: threeMonthsAgo }
                    }
                },
                {
                    $project: {
                        id: { $toString: "$cards._id" },
                        _id: 0,
                        name: { $concat: ["$cards.first_name", " ", "$cards.last_name"] },
                        email: "$cards.email"
                    }
                }
            ]);
            break;
        case "Users Not Contacted":
            result = await LeadStatus.aggregate([
                {
                    $unwind: "$cards"
                },
                {
                    $match: {
                        $and: [
                            {
                                $or: [
                                    { "cards.contacted": "no" },      // explicitly "no"
                                    { "cards.contacted": { $exists: false } } // no field present
                                ]
                            },
                            {
                                "cards.createdAt": { $gte: threeMonthsAgo }
                            }
                        ]
                    }
                },
                {
                    $project: {
                        id: { $toString: "$cards._id" },
                        _id: 0,
                        name: { $concat: ["$cards.first_name", " ", "$cards.last_name"] },
                        email: "$cards.email"
                    }
                }
            ]);
            break;
        default:
            break;
    }

    return NextResponse.json({ leads: result, message: "Leads Fetched Successfully" });
}
