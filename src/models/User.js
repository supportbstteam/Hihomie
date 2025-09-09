import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: { type: String },
  lname : {type : String},
  phone : {type : Number},
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // hashed
  status  : {type : Boolean},
  jobTitle : {type : String},
  image : {type : String},
  role: { type: String, enum: ['manager', 'staff'], default: 'staff' },
  additionalInfo: { type: String },
}, { timestamps: true })

export default mongoose.models.User || mongoose.model('User', UserSchema)
