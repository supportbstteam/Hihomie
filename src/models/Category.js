import mongoose from 'mongoose'

const CategorySchema = new mongoose.Schema({
  category: { type: String },
  status: { type: String },
}, { timestamps: true })

export default mongoose.models.Category || mongoose.model('Category', CategorySchema)