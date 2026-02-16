import mongoose from "mongoose";

const IncrementSchema = new mongoose.Schema({
    increment: { type: Number },
}, {timestamps : true})

export default mongoose.models.Increment || mongoose.model("Increment", IncrementSchema);