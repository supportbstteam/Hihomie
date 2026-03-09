import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Property from "@/models/Property";
import path from "path";
import fs from "fs/promises";

export async function POST(request) {
    try {
        await dbConnect();

        // 1. Use formData() instead of json()
        const data = await request.formData();

        // // Define upload directory (inside public folder)
        // const uploadDir = path.join(process.cwd(), "public", "estate", "uploads", "documents");

        // // Ensure the directory exists
        // try {
        //     await fs.access(uploadDir);
        // } catch {
        //     await fs.mkdir(uploadDir, { recursive: true });
        // }

        // // Helper function to save file
        // const saveFile = async (file) => {
        //     if (!file || typeof file === 'string') return null;

        //     const bytes = await file.arrayBuffer();
        //     const buffer = Buffer.from(bytes);

        //     // Create a unique filename to avoid overwrites
        //     const uniqueName = `${Date.now()}-${file.name.replaceAll(" ", "_")}`;
        //     const filePath = path.join(uploadDir, uniqueName);

        //     await fs.writeFile(filePath, buffer);
        //     return `/uploads/properties/${uniqueName}`; // Return the public URL path
        // };

        // // Process Files
        // const energyCertPath = await saveFile(data.get('energy_certificate'));
        // const emissionCertPath = await saveFile(data.get('emission_certificate'));

        // 2. Extract text fields into an object
        const propertyData = {
            province: data.get('province'),
            postal_code: data.get('postal_code'),
            city: data.get('city'),
            street: data.get('street'),
            street_number: data.get('street_number'),
            public_address: data.get('public_address'),
            district: data.get('district'),
            area: data.get('area'),
            state: data.get('state'),
            reference: data.get('reference'),
            guy: data.get('guy'),
            plant: data.get('plant'),
            rooms: Number(data.get('rooms')),
            bathrooms: Number(data.get('bathrooms')),
            surface: Number(data.get('surface')),
            usable_surface: Number(data.get('usable_surface')),
            year_of_construction: Number(data.get('year_of_construction')),
            community_expenses: Number(data.get('community_expenses')),
            transaction_type: data.get('transaction_type'),
            show_price_tags: data.get('show_price_tags') === 'true',
            energy_consumption: data.get('energy_consumption'),
            co2_emissions: data.get('co2_emissions'),
        };

        // 3. Handle Files
        const energyFile = data.get('energy_certificate'); // This is a File object
        const emissionFile = data.get('emission_certificate'); // This is a File object

        // LOGIC PREVIEW: If you wanted to save the file name to the DB:
        if (energyFile && typeof energyFile !== 'string') {
            // propertyData.energy_certificate_url = energyFile.name; 
            // propertyData.emisson_certificate_url = emissionFile.name; 
        }

        // 4. Validation
        if (!propertyData.reference || !propertyData.street) {
            return NextResponse.json(
                { message: "Reference and Street address are required" },
                { status: 400 }
            );
        }

        // 5. Save to MongoDB
        const newProperty = await Property.create(propertyData);

        return NextResponse.json(
            {
                success: true,
                message: "Property created successfully",
                data: newProperty
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Property Creation Error:", error);

        if (error.code === 11000) {
            return NextResponse.json(
                { message: "A property with this reference already exists" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}