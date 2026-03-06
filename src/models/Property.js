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
    state: { type: String },
    reference: { type: String },
    guy: { type: String },
    plant: { type: String },
    rooms: { type: Number }, 
    bathrooms: { type: Number }, 
    surface: { type: Number }, 
    usable_surface: { type: Number },
    year_of_construction: { type: Number },
    community_expenses: { type: Number },

    // Options
    transaction_type: { 
        type: String, 
        enum: ['rent', 'sale'], 
        default: 'sale' 
    },
    show_price_tags: { type: Boolean, default: false },
    energy_consumption: { type: String },
    co2_emissions: { type: String },

}, { timestamps: true });

export default mongoose.models.Property || mongoose.model("Property", PropertySchema);