import mongoose from 'mongoose'

const CardAssignUserSchema = new mongoose.Schema({
    userId: { type: String },
    cardId: { type: String },
    colId: { type: String },
}, { timestamps: true })

export default mongoose.models.CardAssignUser || mongoose.model('CardAssignUser', CardAssignUserSchema)