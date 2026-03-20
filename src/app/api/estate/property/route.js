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

        // Define upload directory (inside public folder)
        const uploadDir = path.join(process.cwd(), "public", "estate", "uploads", "documents");

        // Ensure the directory exists
        try {
            await fs.access(uploadDir);
        } catch {
            await fs.mkdir(uploadDir, { recursive: true });
        }

        // Helper function to save file
        const saveFile = async (file) => {
            if (!file || typeof file === 'string') return null;

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Create a unique filename to avoid overwrites
            const uniqueName = `${Date.now()}-${file.name.replaceAll(" ", "_")}`;
            const filePath = path.join(uploadDir, uniqueName);

            await fs.writeFile(filePath, buffer);
            return `/uploads/properties/${uniqueName}`; // Return the public URL path
        };

        // Process Files
        const energyCertPath = await saveFile(data.get('energy_certificate'));
        const emissionCertPath = await saveFile(data.get('emission_certificate'));

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
            status: data.get('status'),
            reference: data.get('reference'),
            type: data.get('type'),
            floor: data.get('floor'),
            rooms: Number(data.get('rooms')),
            bathrooms: Number(data.get('bathrooms')),
            surface: Number(data.get('surface')),
            usable_surface: Number(data.get('usable_surface')),
            year_of_construction: Number(data.get('year_of_construction')),
            community_expenses: Number(data.get('community_expenses')),
            transaction_type: data.get('transaction_type'),
            show_price_tags: data.get('show_price_tags') === 'true',
            energy_certificate_type: data.get('energy_certificate_type'),
            emission_certificate_type: data.get('emission_certificate_type'),
            energy_consumption: data.get('energy_consumption'),
            co2_emissions: data.get('co2_emissions'),
            labels: data.getAll('labels'),
            description: data.get('description'),
            owner_1: data.get('owner_1'),
            owner_2: data.get('owner_2'),
            owner_3: data.get('owner_3'),
            capturer: data.get('capturer'),
            commercial_manager: data.get('commercial_manager'),

            full_address: data.get('full_address'),
            property_title: data.get('property_title'),
            video_link: data.get('video_link'),
            agreement_type: data.get('agreement_type'),
            agreement_valid_from: data.get('agreement_valid_from'),
            agreement_valid_until: data.get('agreement_valid_until'),
            commission_percentage: Number(data.get('commission_percentage')),
            commission_value: Number(data.get('commission_value')),
            shared_commission_percentage: Number(data.get('shared_commission_percentage')),
            is_for_rent: data.get('is_for_rent') === 'true',
            rent_price: Number(data.get('rent_price')),
            is_for_sale: data.get('is_for_sale') === 'true',
            sale_price: Number(data.get('sale_price')),
            show_price: data.get('show_price') === 'true',
            cadastral_reference: data.get('cadastral_reference'),
            keychain_reference: data.get('keychain_reference'),
            supplier_reference: data.get('supplier_reference'),
            short_description: data.get('short_description'),
            registration_surface: Number(data.get('registration_surface')),
            terrace_surface: Number(data.get('terrace_surface')),
            garage_surface: Number(data.get('garage_surface')),
            garage_space_price: Number(data.get('garage_space_price')),
            payment_frequency: data.get('payment_frequency'),
            bail: Number(data.get('bail')),
            guarantee: Number(data.get('guarantee')),
            real_estate_fee: Number(data.get('real_estate_fee')),
            rental_price_reference_index: Number(data.get('rental_price_reference_index')),
            urbanization: data.get('urbanization'),
            block: data.get('block'),
            portal: data.get('portal'),
            gate: data.get('gate'),
            collaborator: data.get('collaborator')
        };

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

export async function GET() {
    try {
        // 1. Connect to the database
        await dbConnect();

        // 2. Fetch all properties from the database
        const properties = await Property.find({}).sort({ createdAt: -1 });

        // 3. Check if properties exist
        if (!properties || properties.length === 0) {
            return NextResponse.json(
                { success: true, message: "No properties found", data: [] },
                { status: 200 }
            );
        }

        // 4. Return the data
        return NextResponse.json(
            {
                success: true,
                data: properties,
            },
            { status: 200 }
        );

    } catch (error) {
        
        return NextResponse.json(
            { 
                success: false, 
                message: "Internal Server Error", 
                error: error.message 
            },
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
                { message: "Property ID is required" },
                { status: 400 }
            );
        }

        // 2. Delete the property from MongoDB
        const deletedProperty = await Property.findByIdAndDelete(id);

        if (!deletedProperty) {
            return NextResponse.json(
                { message: "Property not found" },
                { status: 404 }
            );
        }

        // 3. Return success response to trigger the .fulfilled case in Redux
        return NextResponse.json(
            { 
                success: true, 
                message: "Property deleted successfully!",
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Property Deletion Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}