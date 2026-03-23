import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Property from "@/models/Property";
import * as XLSX from "xlsx";

export async function POST(request) {
    try {
        await dbConnect();

        // 1. Get the form data
        const formData = await request.formData();
        const file = formData.get("file"); // Assumes your input name is "file"

        if (!file) {
            return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
        }

        // 2. Convert File to Buffer and Parse Excel
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const workbook = XLSX.read(buffer, { type: "buffer" });
        
        // Use the first sheet
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        // Convert sheet to JSON array
        const rawData = XLSX.utils.sheet_to_json(sheet);

        if (rawData.length === 0) {
            return NextResponse.json({ message: "Excel file is empty" }, { status: 400 });
        }

        // 3. Map Excel rows to Property Schema
        const propertiesToInsert = rawData.map((row) => {
            return {
                province: row.province,
                postal_code: row.postal_code,
                city: row.city,
                street: row.street,
                street_number: row.street_number,
                public_address: row.public_address,
                district: row.district,
                area: row.area,
                status: row.status,
                reference: String(row.reference || ""), // Ensure reference is a string
                type: row.type,
                floor: row.floor,
                rooms: Number(row.rooms) || 0,
                bathrooms: Number(row.bathrooms) || 0,
                surface: Number(row.surface) || 0,
                usable_surface: Number(row.usable_surface) || 0,
                year_of_construction: Number(row.year_of_construction) || null,
                community_expenses: Number(row.community_expenses) || 0,
                transaction_type: row.transaction_type,
                show_price_tags: String(row.show_price_tags).toLowerCase() === 'true',
                energy_certificate_type: row.energy_certificate_type,
                emission_certificate_type: row.emission_certificate_type,
                energy_consumption: row.energy_consumption,
                co2_emissions: row.co2_emissions,
                // Handle labels if they are comma-separated in a single cell
                labels: row.labels ? String(row.labels).split(',').map(l => l.trim()) : [],
                description: row.description,
                owner_1: row.owner_1,
                owner_2: row.owner_2,
                owner_3: row.owner_3,
                capturer: row.capturer,
                commercial_manager: row.commercial_manager,
                full_address: row.full_address,
                property_title: row.property_title,
                video_link: row.video_link,
                agreement_type: row.agreement_type,
                agreement_valid_from: row.agreement_valid_from,
                agreement_valid_until: row.agreement_valid_until,
                commission_percentage: Number(row.commission_percentage) || 0,
                commission_value: Number(row.commission_value) || 0,
                shared_commission_percentage: Number(row.shared_commission_percentage) || 0,
                is_for_rent: String(row.is_for_rent).toLowerCase() === 'true',
                rent_price: Number(row.rent_price) || 0,
                is_for_sale: String(row.is_for_sale).toLowerCase() === 'true',
                sale_price: Number(row.sale_price) || 0,
                show_price: String(row.show_price).toLowerCase() === 'true',
                cadastral_reference: row.cadastral_reference,
                keychain_reference: row.keychain_reference,
                supplier_reference: row.supplier_reference,
                short_description: row.short_description,
                registration_surface: Number(row.registration_surface) || 0,
                terrace_surface: Number(row.terrace_surface) || 0,
                garage_surface: Number(row.garage_surface) || 0,
                garage_space_price: Number(row.garage_space_price) || 0,
                payment_frequency: row.payment_frequency,
                bail: Number(row.bail) || 0,
                guarantee: Number(row.guarantee) || 0,
                real_estate_fee: Number(row.real_estate_fee) || 0,
                rental_price_reference_index: Number(row.rental_price_reference_index) || 0,
                urbanization: row.urbanization,
                block: row.block,
                portal: row.portal,
                gate: row.gate,
                collaborator: row.collaborator
            };
        });

        // 4. Filter out invalid rows (Same validation as your single create API)
        const validEntries = propertiesToInsert.filter(p => p.reference && p.street);

        if (validEntries.length === 0) {
            return NextResponse.json({ message: "No valid rows found in Excel" }, { status: 400 });
        }

        // 5. Bulk Insert
        // ordered: false allows successful inserts even if some throw duplicate key errors
        const result = await Property.insertMany(validEntries, { ordered: false });

        return NextResponse.json({
            success: true,
            message: `Imported ${result.length} properties successfully.`,
            count: result.length
        }, { status: 201 });

    } catch (error) {
        console.error("Excel Import Error:", error);

        // Handle partial success (duplicate references)
        if (error.code === 11000) {
            return NextResponse.json({
                success: true,
                message: "Imported new properties, but skipped duplicate references.",
                insertedCount: error.insertedDocs?.length || 0
            }, { status: 207 });
        }

        return NextResponse.json({ 
            message: "Internal Server Error", 
            error: error.message 
        }, { status: 500 });
    }
}