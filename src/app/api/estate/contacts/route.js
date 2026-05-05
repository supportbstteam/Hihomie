import { NextResponse } from 'next/server';
import dbConnect from "@/lib/db";
import EstateContact from '@/models/EstateContact';

export async function POST(request) {
    try {
        // 1. Connect to the database
        await dbConnect();

        // 2. Parse the incoming form data
        const body = await request.json();

        // 3. Basic Validation
        if (!body.name || !body.phone || !body.email) {
            return NextResponse.json(
                { error: "Name Phone and email are required fields." },
                { status: 400 }
            );
        }

        // Optional: Clean up empty strings for Number/Date fields so MongoDB doesn't throw cast errors
        const cleanedBody = { ...body };

        // 4. Create the document in MongoDB
        const newContact = await EstateContact.create(cleanedBody);

        // 5. Return Success Response
        return NextResponse.json(
            {
                message: "Contact created successfully!",
                data: newContact
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error creating contact in MongoDB:", error);

        // Handle Mongoose validation errors specifically
        if (error.name === 'ValidationError') {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Internal Server Error while creating contact." },
            { status: 500 }
        );
    }
}

export async function GET(req) {
    try {
        // 1. Connect to the database
        await dbConnect();

        const { searchParams } = new URL(req.url);

        const page = parseInt(searchParams.get("page")) || 1;
        const name = searchParams.get("name") || "";
        const phone = searchParams.get("phone") || "";
        const email = searchParams.get("email") || "";
        const address = searchParams.get("address") || "";
        const assigned_agent = searchParams.get("assigned_agent") || "";
        const status = searchParams.get("status") || "";

        const matchConditions = {};

        if (name) {
            matchConditions.name = { $regex: name, $options: "i" };
        }

        if (address) {
            matchConditions.address = { $regex: address, $options: "i" };
        }

        if (phone) {
            matchConditions.phone = { $regex: phone };
        }

        if (email) {
            matchConditions.email = { $regex: email, $options: "i" };
        }

        if (assigned_agent) {
            matchConditions.assigned_agent = { $regex: `^${assigned_agent}$` };
        }

        if (status) {
            matchConditions.contact_status = { $regex: `^${status}$`, $options: "i" };
        }

        const limit = 25;
        const skip = (page - 1) * limit;

        const result = await EstateContact.aggregate([
            ...(Object.keys(matchConditions).length ? [{ $match: matchConditions }] : []),
            { $sort: { createdAt: -1 } },
            {
                $facet: {
                    data: [{ $skip: skip }, { $limit: limit }],
                    totalCount: [{ $count: "count" }]
                }
            }
        ]);

        const contacts = result[0].data;
        const totalCount = result[0].totalCount[0]?.count || 0;
        const totalPages = Math.ceil(totalCount / limit) <= 0 ? 1 : Math.ceil(totalCount / limit);

        return NextResponse.json(
            {
                success: true,
                data: contacts,
                totalCount,
                page,
                totalPages: totalPages
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error fetching contacts from MongoDB:", error);
        return NextResponse.json(
            { error: "Internal Server Error while fetching contacts." },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { message: "Contact ID is required" },
                { status: 400 }
            );
        }

        // 2. Delete the contact from MongoDB
        const deletedContact = await EstateContact.findByIdAndDelete(id);

        if (!deletedContact) {
            return NextResponse.json(
                { message: "Contact not found" },
                { status: 404 }
            );
        }

        // 3. Return success response to trigger the .fulfilled case in Redux
        return NextResponse.json(
            {
                success: true,
                message: "Contact deleted successfully!",
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Contact Deletion Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}
