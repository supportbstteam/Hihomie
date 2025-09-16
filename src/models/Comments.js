import mongoose from "mongoose";

const CommentsSchema = new mongoose.Schema({
    comment : {type : String},
    userId : {type : String},
    cardId : {type : String},
    colId : {type : String},
}, {timestamps : true})

export default mongoose.models.Comments || mongoose.model("Comments", CommentsSchema);
