import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import LeadStatus from "@/models/LeadStatus";
import Document from "@/models/Document";
import CardAssignUser from "@/models/CardAssignUser";
import User from "@/models/User";
import mongoose from "mongoose";

export async function GET(request) {
    const { searchParams } = request.nextUrl;
    const userStatus = searchParams.get("userStatus");
    const userId = searchParams.get("userId");

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    await dbConnect();

    const user = await User.findById(userId);
    const assignedLeads = await CardAssignUser.find({ userId: userId });
    const assignedCardIds = assignedLeads.map((item) =>
        new mongoose.Types.ObjectId(item.cardId)
    );

    let result = [];
    if (user.role !== "admin") {
        switch (userStatus) {
            case "No Answer":
                result = await LeadStatus.aggregate([
                    {
                        $unwind: "$cards"
                    },
                    {
                        $match: {
                            "status_name": "Call Back",
                            "cards.createdAt": { $gte: threeMonthsAgo },
                            "cards._id": { $in: assignedCardIds },
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
                                    { $not: { $in: [{ $toString: "$cards._id" }, documentSubmittedUser] } },
                                    { $in: ["$cards._id", assignedCardIds] },
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
                            "cards.createdAt": { $gte: threeMonthsAgo },
                            "cards._id": { $in: assignedCardIds },
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
                                    "cards.createdAt": { $gte: threeMonthsAgo },
                                    "cards._id": { $in: assignedCardIds },
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
    } else {
        switch (userStatus) {
            case "No Answer":
                result = await LeadStatus.aggregate([
                    {
                        $unwind: "$cards"
                    },
                    {
                        $match: {
                            "status_name": "Call Back",
                            "cards.createdAt": { $gte: threeMonthsAgo },
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
                                    { $not: { $in: [{ $toString: "$cards._id" }, documentSubmittedUser] } },
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
                            "cards.createdAt": { $gte: threeMonthsAgo },
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
                                    "cards.createdAt": { $gte: threeMonthsAgo },
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
    }

    return NextResponse.json({ leads: result, message: "Leads Fetched Successfully" });
}
