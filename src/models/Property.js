import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema({
    // Location Details
    province: { type: String },
    postal_code: { type: String },
    city: { type: String },
    street: { type: String },
    street_number: { type: String },
    public_address: { type: String }, 
    district: { type: String },
    area: { type: String },

    // Property Features
    status: { type: String },     // Maps to data.get('status')
    reference: { type: String },
    type: { type: String },
    floor: { type: String },      
    rooms: { type: Number }, 
    bathrooms: { type: Number }, 
    surface: { type: Number }, 
    usable_surface: { type: Number },
    year_of_construction: { type: Number },
    community_expenses: { type: Number },

    // Options & Energy
    transaction_type: { 
        type: String, 
        enum: ['rent', 'sale'], 
        default: 'sale' 
    },
    show_price_tags: { type: Boolean, default: false },
    energy_certificate_type: { type: String },  
    emission_certificate_type: { type: String }, 
    energy_consumption: { type: String },
    co2_emissions: { type: String },

    // Private Data / Management (Added these fields)
    labels: [{ type: String }],
    description: { type: String },
    owner_1: { type: String },
    owner_2: { type: String },
    owner_3: { type: String },
    capturer: { type: String },
    commercial_manager: { type: String },

    full_address: { type: String },
    urbanization: { type: String },
    block: { type: String },
    portal: { type: String },
    gate: { type: String },

    // Core Property Info
    property_title: { type: String },
    video_link: { type: String },
    short_description: { type: String },
    
    // Pricing & Listing Options
    is_for_rent: { type: Boolean, default: false },
    rent_price: { type: Number },
    payment_frequency: { type: String },
    bail: { type: Number },
    guarantee: { type: Number },
    real_estate_fee: { type: Number },
    rental_price_reference_index: { type: Number },
    
    is_for_sale: { type: Boolean, default: false },
    sale_price: { type: Number },
    show_price: { type: Boolean, default: true },
    
    // Agreements & Commissions
    agreement_type: { type: String },
    agreement_valid_from: { type: String },
    agreement_valid_until: { type: String },
    commission_percentage: { type: Number },
    commission_value: { type: Number },
    shared_commission_percentage: { type: Number },
    
    // Additional Surfaces
    registration_surface: { type: Number },
    terrace_surface: { type: Number },
    garage_surface: { type: Number },
    garage_space_price: { type: Number },
    
    // Additional References
    cadastral_reference: { type: String },
    keychain_reference: { type: String },
    supplier_reference: { type: String },
    collaborator: { type: String }

}, { timestamps: true });

export default mongoose.models.Property || mongoose.model("Property", PropertySchema);