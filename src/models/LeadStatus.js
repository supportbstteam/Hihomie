import mongoose from 'mongoose'

// Card Schema
const CardSchema = new mongoose.Schema({
  lead_title: { type: Number },
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
  snake_case: { type: String },
  customer_situation: { type: String },
  purchase_status: { type: String },
  contacted: { type: String },
  contract_signed: { type: Boolean },
  commercial_notes: { type: String },
  manager_notes: { type: String },
  detailsData: { type: Object },
  addressDetailsData: { type: Object },
  bankDetailsData: { type: Object },
  situation: { type: String },
  self_employed: { type: String },
  operation: { type: String },
  reserved_property: { type: String },
  price_property: { type: String },
  net_earnings: { type: String },
  catalonia: { type: String },
  monthly_net_earnings: { type: String },
  minimum_savings: { type: String },
  down_payment: { type: String },
  additional_security: { type: String },
  paying_any_other_loans: { type: String },
  pay_on_other_loans: { type: String },
  old_are_you: { type: String },
  registry_ASNEF: { type: String },
  mortgage: { type: String },
  second_monthly_net_earnings: { type: String },
  second_paying_any_other_loans: { type: String },
  owner_property: { type: String },
  campaign: { type: String },
  property_enquiry: { type: String },

}, { timestamps: true })

// Lead Status Schema
const LeadStatusSchema = new mongoose.Schema({
  status_name: { type: String },
  color: { type: String },
  order: { type: Number, default: 0 },
  cards: [CardSchema]  // Array of subdocuments
}, { timestamps: true })

export default mongoose.models.LeadStatus || mongoose.model('LeadStatus', LeadStatusSchema)
