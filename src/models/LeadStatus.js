import mongoose from 'mongoose'

// Card Schema
const CardSchema = new mongoose.Schema({
  lead_title: { type: String },
  surname: { type: String },
  first_name: { type: String },
  last_name: { type: String },
  company: { type: String },
  designation: { type: String },
  email: { type: String },
  phone: { type: String },
  lead_value: { type: String },
  assigned: { type: String },
  status: { type: String },
  type_of_opration: { type: String },
  customer_situation: { type: String },
  purchase_status: { type: String },
  contacted: { type: String },
  contract_signed: { type: Boolean },
  commercial_notes: { type: String },
  manager_notes: { type: String },
  detailsData: { type: Object },
  addressDetailsData: { type: Object },
  bankDetailsData: { type: Object },

}, { timestamps: true })

// Lead Status Schema
const LeadStatusSchema = new mongoose.Schema({
  status_name: { type: String },
  color: { type: String },
  cards: [CardSchema]  // Array of subdocuments
}, { timestamps: true })

export default mongoose.models.LeadStatus || mongoose.model('LeadStatus', LeadStatusSchema)
