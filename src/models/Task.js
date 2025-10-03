import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    userId : {type : String},
}, {timestamps : true})

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
