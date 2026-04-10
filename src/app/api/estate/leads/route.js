import { NextResponse } from 'next/server';
import dbConnect from "@/lib/db";
import EstateLead from '@/models/EstateLead';

export async function POST(request) {
    try {
        // 1. Connect to the database
        await dbConnect();

        // 2. Parse the incoming form data
        const body = await request.json();

        // 3. Basic Validation
        if (!body.name || !body.phone) {
            return NextResponse.json(
                { error: "Name and Phone are required fields." },
                { status: 400 }
            );
        }

        // Optional: Clean up empty strings for Number/Date fields so MongoDB doesn't throw cast errors
        const cleanedBody = { ...body };
        ['days_since_last_contact', 'days_until_next_call', 'sale_price', 'fees'].forEach(field => {
            if (cleanedBody[field] === '') cleanedBody[field] = null;
        });
        ['registration_date', 'last_contact', 'next_call'].forEach(field => {
            if (cleanedBody[field] === '') cleanedBody[field] = null;
        });

        // 4. Create the document in MongoDB
        const newLead = await EstateLead.create(cleanedBody);

        // 5. Return Success Response
        return NextResponse.json(
            {
                message: "Lead created successfully!",
                data: newLead
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error creating lead in MongoDB:", error);

        // Handle Mongoose validation errors specifically
        if (error.name === 'ValidationError') {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Internal Server Error while creating lead." },
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
        const location = searchParams.get("location") || "";
        const intent = searchParams.get("intent") || "";

        const matchConditions = {};

        if (name) {
            matchConditions.name = { $regex: name, $options: "i" };
        }

        if (location) {
            matchConditions.address = { $regex: location, $options: "i" };
        }

        if (phone) {
            matchConditions.phone = { $regex: phone };
        }

        if (intent) {
            matchConditions.rent_or_sale = { $regex: `^${intent}$`, $options: "i" };
        }

        const limit = 25;
        const skip = (page - 1) * limit;

        // 2. Fetch all leads from MongoDB
        // const leads = await EstateLead.find();

        const result = await EstateLead.aggregate([
            ...(Object.keys(matchConditions).length ? [{ $match: matchConditions }] : []),
            { $sort: { createdAt: -1 } },
            {
                $facet: {
                    data: [{ $skip: skip }, { $limit: limit }],
                    totalCount: [{ $count: "count" }]
                }
            }
        ]);

        const leads = result[0].data;
        const totalCount = result[0].totalCount[0]?.count || 0;
        const totalPages = Math.ceil(totalCount / limit) <= 0 ? 1 : Math.ceil(totalCount / limit);


        return NextResponse.json(
            {
                success: true,
                data: leads,
                totalCount,
                page,
                totalPages: totalPages
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error fetching leads from MongoDB:", error);
        return NextResponse.json(
            { error: "Internal Server Error while fetching leads." },
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
                { message: "Lead ID is required" },
                { status: 400 }
            );
        }

        // 2. Delete the lead from MongoDB
        const deletedLead = await EstateLead.findByIdAndDelete(id);

        if (!deletedLead) {
            return NextResponse.json(
                { message: "Lead not found" },
                { status: 404 }
            );
        }

        // 3. Return success response to trigger the .fulfilled case in Redux
        return NextResponse.json(
            {
                success: true,
                message: "Lead deleted successfully!",
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Lead Deletion Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}
