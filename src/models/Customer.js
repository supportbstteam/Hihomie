import mongoose from 'mongoose'

const CustomerSchema = new mongoose.Schema({
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  origin: { type: String },
  password: { type: String }, // hashed
  automatic: { type: Boolean },
  flag: { type: Number, default: 1 },
}, { timestamps: true })

export default mongoose.models.Customer || mongoose.model('Customer', CustomerSchema)