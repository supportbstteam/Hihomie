import mongoose from "mongoose";

const DueDatesSchema = new mongoose.Schema({
    due_date: { type: String },
    due_date_note: { type: String },
    userId : {type : String},
    cardId: { type: String },
    colId: { type: String },
}, {timestamps : true})

export default mongoose.models.DueDates || mongoose.model("DueDates", DueDatesSchema);
