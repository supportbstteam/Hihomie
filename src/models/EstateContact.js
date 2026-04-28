import mongoose from 'mongoose';

const EstateContactSchema = new mongoose.Schema({
  // Basic Information
  contact_id: { type: String },
  name: { type: String, required: [true, 'Name is required'] },
  phone: { type: String, required: [true, 'Phone number is required'] },
  email: { type: String, required: [true, 'Email is required']},
  address: { type: String },
  city: { type: String },
  assigned_agent: { type: String },
  source_channel: { type: String },

  // Tracking & Status
  contact_status: { type: String },

  // Notes
  observations: { type: String }
}, {
  // Automatically adds createdAt and updatedAt timestamps
  timestamps: true 
});

// Check if the model exists before compiling it to prevent OverwriteModelError in Next.js
const EstateContact = mongoose.models.EstateContact || mongoose.model('EstateContact', EstateContactSchema);

export default EstateContact;