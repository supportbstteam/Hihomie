import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Property from "@/models/Property";
import { createPropertyOnIdealista } from "@/lib/idealista"; // Adjust path as necessary
import { createPropertyOnFotocasa } from "@/lib/fotocasa"; // Adjust path as necessary
import removeEmptyFields from "@/lib/removeEmptyFields";

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
            country: data.get('country'),
            area: data.get('area'),
            status: data.get('status'),
            reference: data.get('reference'),
            type: data.get('type'),
            floor: data.get('floor'),

            // Number conversions safely handled
            rooms: data.get('rooms') ? Number(data.get('rooms')) : undefined,
            bathrooms: data.get('bathrooms') ? Number(data.get('bathrooms')) : undefined,
            surface: data.get('surface') ? Number(data.get('surface')) : undefined,
            usable_surface: data.get('usable_surface') ? Number(data.get('usable_surface')) : undefined,
            year_of_construction: data.get('year_of_construction') ? Number(data.get('year_of_construction')) : undefined,
            community_expenses: data.get('community_expenses') ? Number(data.get('community_expenses')) : undefined,

            transaction_type: data.get('transaction_type'),
            show_price_tags: data.get('show_price_tags') === 'true',
            energy_certificate_type: data.get('energy_certificate_type'),
            emission_certificate_type: data.get('emission_certificate_type'),
            energy_consumption: data.get('energy_consumption'),
            co2_emissions: data.get('co2_emissions'),
            labels: data.getAll('labels'),
            description: JSON.parse(data.get('description')),
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

            // Number conversions safely handled
            commission_percentage: data.get('commission_percentage') ? Number(data.get('commission_percentage')) : undefined,
            commission_value: data.get('commission_value') ? Number(data.get('commission_value')) : undefined,
            shared_commission_percentage: data.get('shared_commission_percentage') ? Number(data.get('shared_commission_percentage')) : undefined,

            is_for_rent: data.get('is_for_rent') === 'true',
            rent_price: data.get('rent_price') ? Number(data.get('rent_price')) : undefined,
            is_for_sale: data.get('is_for_sale') === 'true',
            sale_price: data.get('sale_price') ? Number(data.get('sale_price')) : undefined,
            show_price: data.get('show_price') === 'true',

            cadastral_reference: data.get('cadastral_reference'),
            keychain_reference: data.get('keychain_reference'),
            supplier_reference: data.get('supplier_reference'),
            short_description: data.get('short_description'),

            // Number conversions safely handled
            registration_surface: data.get('registration_surface') ? Number(data.get('registration_surface')) : undefined,
            terrace_surface: data.get('terrace_surface') ? Number(data.get('terrace_surface')) : undefined,
            garage_surface: data.get('garage_surface') ? Number(data.get('garage_surface')) : undefined,
            garage_space_price: data.get('garage_space_price') ? Number(data.get('garage_space_price')) : undefined,

            payment_frequency: data.get('payment_frequency'),

            // Number conversions safely handled
            bail: data.get('bail') ? Number(data.get('bail')) : undefined,
            guarantee: data.get('guarantee') ? Number(data.get('guarantee')) : undefined,
            real_estate_fee: data.get('real_estate_fee') ? Number(data.get('real_estate_fee')) : undefined,
            rental_price_reference_index: data.get('rental_price_reference_index') ? Number(data.get('rental_price_reference_index')) : undefined,

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

        let idealistaPayload = {
            // Top-level fields
            type: propertyData.type, // Will be deleted if empty
            code: propertyData.reference,
            reference: propertyData.reference,
            contactId: 105274808,
            scope: "idealista",

            // Address Object
            address: {
                streetName: propertyData.street,
                streetNumber: propertyData.street_number,
                postalCode: propertyData.postal_code,
                visibility: "full",
                country: propertyData.country || "Spain",
                precision: "exact",
                town: propertyData.city,
            },

            // Features Object
            features: {
                areaConstructed: propertyData.surface || undefined,
                areaUsable: propertyData.usable_surface || undefined,
                rooms: propertyData.rooms || undefined,
                bathroomNumber: propertyData.bathrooms || undefined,
                builtYear: propertyData.year_of_construction || undefined,
                conservation: propertyData.status === 'available' ? 'good' : 'toRestore',
                energyCertificateRating: propertyData.energy_certificate_type,
                priceCommunity: propertyData.community_expenses,
                cadastralReference: propertyData.cadastral_reference,
                terrace: propertyData.terrace_surface > 0,
                liftAvailable: true,
                windowsLocation: "internal"
            },

            // Operation Object 
            operation: {
                type: propertyData.is_for_sale ? "sale" : (propertyData.is_for_rent ? "rent" : undefined),
                price: propertyData.is_for_sale ? propertyData.sale_price : propertyData.rent_price
            },

            // Descriptions: If there's no description, make it undefined so the whole array is dropped
            descriptions: propertyData.description ? [
                {
                    language: "es",
                    text: propertyData.description.es
                }
            ] : undefined
        };

        // idealistaPayload = removeEmptyFields(idealistaPayload);

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
                { FeatureId: 3, TextValue: propertyData.description.es }
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
                // Look for the detailed response data from Axios!
                const errorDetails = portalError.response?.data
                    ? JSON.stringify(portalError.response.data)
                    : portalError.message;

                console.error("Failed to sync with Idealista. Details:", errorDetails);
            }
        }

        if (propertyData.portals.includes("fotocasa")) {
            try {
                const fotocasaResponse = await createPropertyOnFotocasa(fotocasaPayload);
                console.log("Fotocasa sync successful");
            } catch (portalError) {
                const errorDetails = portalError.response?.data
                    ? JSON.stringify(portalError.response.data, null, 2)
                    : portalError.message;

                console.error("Failed to sync with Fotocasa. Details:", errorDetails);
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