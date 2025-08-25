import mongoose from 'mongoose'

// Card Schema
const CardSchema = new mongoose.Schema({
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String },
  phone: { type: String },
  origin: { type: String },
  automatic: { type: Boolean, default: false },
  password: { type: String }
}, { timestamps: true })

// Lead Status Schema
const LeadStatusSchema = new mongoose.Schema({
  status_name: { type: String },
  color: { type: String },
  cards: [CardSchema]  // Array of subdocuments
}, { timestamps: true })

export default mongoose.models.LeadStatus || mongoose.model('LeadStatus', LeadStatusSchema)
