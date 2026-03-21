import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Property from "@/models/Property";

export async function GET(req, context) {
    const { id } = await context.params;
    try {
        await dbConnect();

        const property = await Property.findById(id);

        if (!property) {
            return NextResponse.json(
                { message: "Property not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            {
                success: true,
                data: property,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(request, context) {
    const { id } = await context.params;

    try {
        await dbConnect();
    
        const formData = await request.formData();
        const updateData = {};

        // 2. Dynamically build the update object
        for (const [key, value] of formData.entries()) {
            // Skip labels in the loop so we can handle it as an array below
            if (key === 'labels') continue;

            // Convert stringified booleans back to real booleans
            if (value === 'true') {
                updateData[key] = true;
            } else if (value === 'false') {
                updateData[key] = false;
            } 
            // Convert empty strings to null to prevent Mongoose CastErrors 
            // (e.g., clearing a number field like "surface" or "rent_price")
            else if (value === '') {
                updateData[key] = null; 
            } 
            // Standard string/number values
            else {
                updateData[key] = value;
            }
        }
        
        updateData.labels = formData.has('labels') ? formData.getAll('labels') : [];

        // 4. Update the document in MongoDB
        const updatedProperty = await Property.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        );

        if (!updatedProperty) {
            return NextResponse.json(
                { success: false, message: "Property not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Property updated successfully!",
                data: updatedProperty,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("PUT Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}