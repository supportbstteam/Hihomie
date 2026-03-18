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

}, { timestamps: true });

export default mongoose.models.Property || mongoose.model("Property", PropertySchema);