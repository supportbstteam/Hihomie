import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Property from "@/models/Property";
import { createPropertyOnIdealista } from "@/lib/idealista"; // Adjust path as necessary
import { createPropertyOnFotocasa } from "@/lib/fotocasa"; // Adjust path as necessary

export async function POST(request) {
    try {
        await dbConnect();

        // 1. Use formData() instead of json()
        const data = await request.formData();

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
            collaborator: data.get('collaborator'),
            portals: data.getAll('portals'),
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

        const idealistaPayload = {
            // Top-level fields
            type: propertyData.type || "flat", // Default to flat if empty
            code: propertyData.reference,
            reference: propertyData.reference,
            contactId: 105219381,
            scope: "idealista",

            // Address Object
            address: {
                streetName: propertyData.street,
                streetNumber: propertyData.street_number,
                postalCode: propertyData.postal_code,
                visibility: "full",
                country: "Spain",
                precision: "exact",
                town: propertyData.city,
            },

            // Features Object
            features: {
                areaConstructed: propertyData.surface || 0,
                areaUsable: propertyData.usable_surface || 0,
                rooms: propertyData.rooms || 0,
                bathroomNumber: propertyData.bathrooms || 0,
                builtYear: propertyData.year_of_construction || null,
                conservation: propertyData.status === 'available' ? 'good' : 'toRestore',
                energyCertificateRating: propertyData.energy_certificate_type || 'A',
                priceCommunity: propertyData.community_expenses || 0,
                cadastralReference: propertyData.cadastral_reference || "",
                terrace: propertyData.terrace_surface > 0,
                liftAvailable: "true",
                windowsLocation: "internal"
            },

            // Operation Object (Determines if it is for Sale or Rent)
            operation: {
                type: propertyData.is_for_sale ? "sale" : "rent",
                price: propertyData.is_for_sale ? propertyData.sale_price : propertyData.rent_price
            },

            // Descriptions (Required array of objects)
            descriptions: [
                {
                    language: "es",
                    text: propertyData.description || "Nueva propiedad disponible"
                }
            ]
        };

        const fotocasaPayload = {
            // 1. Basic Identifiers
            ExternalId: propertyData.reference || String(Date.now()), // Unique ID
            AgencyReference: propertyData.reference || "REF-001",

            // 2. Type Mapping (Needs integer based on Fotocasa Dictionary)
            // Example: 1 for Flat/Apartment, 2 for House, etc.
            TypeId: parseInt(propertyData.type) || 1,
            SubTypeId: 2, // Default subtype, adjust based on your logic
            ContactTypeId: 1, // 1 for Agency, 3 for Owner (typical)

            // 3. Address (Fotocasa expects an array)
            PropertyAddress: [{
                ZipCode: propertyData.postal_code,
                Street: propertyData.street,
                Number: propertyData.street_number,
                // FloorId needs mapping to Fotocasa Enum (e.g., 1 for "Bajo", 4 for "1st")
                FloorId: parseInt(propertyData.floor) || 1,
                x: -3.21288689804, // Longitude (Required by API)
                y: 43.3397409074, // Latitude (Required by API)
                VisibilityModeId: 1 // 1: Exact, 2: Street, 3: Hidden
            }],

            // 4. Documents (Videos/Photos)
            PropertyDocument: propertyData.video_link ? [{
                TypeId: 7,
                Url: propertyData.video_link,
                SortingId: 1
            }] : [],

            PropertyFeature: [
                { FeatureId: 1, DecimalValue: propertyData.surface },
                { FeatureId: 11, DecimalValue: propertyData.rooms },
                { FeatureId: 12, DecimalValue: propertyData.bathrooms },
                { FeatureId: 3, TextValue: propertyData.description }
            ].filter(f => f.DecimalValue || f.BoolValue || f.TextValue),

            // 6. Contact Info
            PropertyContactInfo: [
                { TypeId: 1, Value: propertyData.commercial_manager || "Agency Contact" }
            ],

            // 7. Transactions (Sale vs Rent)
            PropertyTransaction: [
                ...(propertyData.is_for_sale ? [{
                    TransactionTypeId: 1, // 1 for Sale
                    Price: propertyData.sale_price,
                    ShowPrice: propertyData.show_price
                }] : []),
                ...(propertyData.is_for_rent ? [{
                    TransactionTypeId: 3, // 3 for Rent
                    Price: propertyData.rent_price,
                    ShowPrice: propertyData.show_price
                }] : [])
            ]
        };

        if (propertyData.portals.includes("idealista")) {
            try {
                const idealistaResponse = await createPropertyOnIdealista(idealistaPayload);
                // Optional: log success or save response status to DB
                console.log("Idealista sync successful");
            } catch (portalError) {
                // Catch the error so it doesn't break the main flow
                console.error("Failed to sync with Idealista:", portalError.message);
            }
        }

        if (propertyData.portals.includes("fotocasa")) {
            try {
                const fotocasaResponse = await createPropertyOnFotocasa(fotocasaPayload);
                // Optional: log success or save response status to DB
                console.log("Fotocasa sync successful",);
            } catch (portalError) {
                // Catch the error so it doesn't break the main flow
                console.error("Failed to sync with Fotocasa:", portalError.message);
            }
        }

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

export async function GET(req) {
    try {
        // 1. Connect to the database
        await dbConnect();

        const { searchParams } = new URL(req.url);

        const page = parseInt(searchParams.get("page")) || 1;
        const ref = searchParams.get("ref") || "";
        const location = searchParams.get("location") || "";
        const propertyFor = searchParams.get("propertyFor") || "";
        const type = searchParams.get("type") || "";
        const status = searchParams.get("status") || "";
        // const price_min = parseFloat(searchParams.get("price_min")) || 0;
        // const price_max = parseFloat(searchParams.get("price_max")) || Number.MAX_SAFE_INTEGER;

        const matchConditions = {};

        // ref (Reference) - usually a partial or exact text match
        if (ref) {
            matchConditions.reference = { $regex: ref, $options: "i" };
        }

        // location - text search, case-insensitive
        if (location) {
            matchConditions.full_address = { $regex: location, $options: "i" };
        }

        // propertyFor (e.g., "rent", "sale") - usually an exact match
        if (propertyFor) {
            matchConditions.transaction_type = propertyFor;
        }

        // type (e.g., "apartment", "house") - usually an exact match
        if (type) {
            matchConditions.type = type;
        }

        if (status) {
            matchConditions.status = status;
        }

        const limit = 25;
        const skip = (page - 1) * limit;

        const result = await Property.aggregate([
            ...(Object.keys(matchConditions).length ? [{ $match: matchConditions }] : []),
            { $sort: { createdAt: -1 } },
            {
                $facet: {
                    data: [{ $skip: skip }, { $limit: limit }],
                    totalCount: [{ $count: "count" }]
                }
            }
        ]);

        const properties = result[0].data;
        const totalCount = result[0].totalCount[0]?.count || 0;
        const totalPages = Math.ceil(totalCount / limit) <= 0 ? 1 : Math.ceil(totalCount / limit);

        return NextResponse.json(
            {
                success: true,
                data: properties,
                totalCount,
                page,
                totalPages: totalPages
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