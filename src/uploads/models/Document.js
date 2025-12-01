import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
    document_type : {type : String},
    document_name : {type : String},
    document_path : {type : String},
    userId : {type : String},
    cardId : {type : String},
    colId : {type : String},
}, {timestamps : true})

export default mongoose.models.Document || mongoose.model("Document", DocumentSchema);
