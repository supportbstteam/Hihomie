import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Task from "@/models/Task";
import User from "@/models/User";
import mongoose from "mongoose";

export async function GET(request) {
    const url = new URL(request.url);
    const date = url.searchParams.get('date');
    try {
        await dbConnect()
        const tasks = await Task.aggregate([
            {
                // Stage 1: Match the documents you want
                $match: { date: new Date(date) }
            },
            {
                // Stage 2: Group them by userId
                $group: {
                    _id: "$userId", // This _id is now the string userId
                    task_Details: { $push: "$$ROOT" }
                }
            },
            {
                // Stage 3: Convert the string _id to a real ObjectId for matching
                $addFields: {
                    "userIdObj": { $toObjectId: "$_id" }
                }
            },
            {
                // Stage 4: "Join" with the users collection
                $lookup: {
                    from: "users",         // The name of the User collection (Mongoose pluralizes it)
                    localField: "userIdObj", // The new ObjectId field from Stage 3
                    foreignField: "_id",     // The _id field in the 'users' collection
                    as: "userDetails"      // Put the found user (as an array) into 'userDetails'
                }
            },
            {
                // Stage 5: Unwind the userDetails array to get the user object
                // (use preserveNullAndEmptyArrays if a user might not be found)
                $unwind: {
                    path: "$userDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                // Stage 6: Add the user_name field
                $addFields: {
                    "user_name": { $ifNull: ["$userDetails.name", "Unknown User"] }
                }
            },
            {
                // Stage 7: (Optional) Clean up helper fields
                $project: {
                    userDetails: 0,
                    userIdObj: 0
                }
            }
        ]);

        // console.log(tasks[0].task_Details[0].task);
        return NextResponse.json(tasks, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}