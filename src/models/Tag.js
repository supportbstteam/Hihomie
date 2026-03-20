import mongoose from "mongoose";

const TagSchema = new mongoose.Schema({
  num_id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  deleted: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Tag || mongoose.model("Tag", TagSchema);