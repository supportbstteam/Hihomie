import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import CardAssignUser from '@/models/CardAssignUser'
import User from '@/models/User'


export async function POST(req, context) {
  try {
    const { params } = context; // ✅ await the context
    const { colId, cardId } = params;

    const text = await req.text();

    let parsedData = [];
    try {
      parsedData = JSON.parse(text);
    } catch (e) {
      console.error("Parsed data error, probably empty body");
    }

    if (!Array.isArray(parsedData) || parsedData.length === 0) {
      return NextResponse.json({ error: "No user data provided" }, { status: 400 });
    }

    await CardAssignUser.deleteMany({ cardId });

    // Save users to DB
    await Promise.all(parsedData.map(userId =>
      CardAssignUser.create({ userId, cardId, colId })
    ));

    const users = await User.find(
      { _id: { $in: parsedData } },  // match only IDs provided
    );

    return NextResponse.json({
      message: "Data received successfully",
      colId,
      cardId,
      data: users,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req, context) {
  try {
    await dbConnect();

    const { colId, cardId } = await context.params;

    // Admin ko exclude karo aur password field ko hata do

    const userIds = await CardAssignUser.find(
      { cardId },
      { userId: 1, _id: 0 } // only return userId, exclude _id
    ).lean();

    // Extract only userId values as an array
    const ids = userIds.map(u => u.userId);

    // Get users matching these IDs
    const users = await User.find(
      { _id: { $in: ids } },
      { password: 0 } // exclude password
    );

    return NextResponse.json({data : users }, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}