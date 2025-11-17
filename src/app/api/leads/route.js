import { NextResponse } from "next/server";
import LeadStatus from "@/models/LeadStatus";

export async function GET(request) {
    const { searchParams } = request.nextUrl;
    const userStatus = searchParams.get("userStatus");

    const result = await LeadStatus.aggregate([
        {
            $match: { status: userStatus }
        },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);

    const users = [
        { id: 1, name: "John Doe", email: "bstteam106@gmail.com" },
        { id: 2, name: "Jane Smith", email: "dixitbrothers601@gmail.com" },
        { id: 3, name: "Bob Johnson", email: "bob.johnson@example.com" },
        { id: 4, name: "Alice Brown", email: "alice.brown@example.com" },
        { id: 5, name: "Charlie Davis", email: "charlie.davis@example.com" },
    ];
    return NextResponse.json({ leads: users, message: "Leads Fetched Successfully" });
}
