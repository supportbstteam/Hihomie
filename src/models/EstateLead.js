import mongoose from 'mongoose';

const EstateLeadSchema = new mongoose.Schema({
  // Basic Information
  lead_id: { type: String },
  name: { type: String, required: [true, 'Name is required'] },
  phone: { type: String, required: [true, 'Phone number is required'] },
  address: { type: String },
  city: { type: String },
  rent_or_sale: { 
    type: String, 
    enum: ['Rent', 'Sale', 'Both', ''], 
    default: '' 
  },

  // Assignment & Source
  registration_date: { type: Date },
  capturer: { type: String },
  assigned_agent: { type: String },
  source_channel: { type: String },

  // Tracking & Status
  lead_status: { type: String },
  last_contact: { type: Date },
  last_contact_result: { type: String },
  next_call: { type: Date },
  days_since_last_contact: { type: Number },
  days_until_next_call: { type: Number },
  follow_up_overdue: { type: Boolean, default: false },

  // Financials
  sale_price: { type: Number },
  fees: { type: Number },

  // Notes
  observations: { type: String }
}, {
  // Automatically adds createdAt and updatedAt timestamps
  timestamps: true 
});

// Check if the model exists before compiling it to prevent OverwriteModelError in Next.js
const EstateLead = mongoose.models.EstateLead || mongoose.model('EstateLead', EstateLeadSchema);

export default EstateLead;