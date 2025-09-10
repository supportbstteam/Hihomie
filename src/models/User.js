import mongoose from 'mongoose'
import { t } from "@/components/translations";

const UserSchema = new mongoose.Schema({
  name: { type: String },
  lname : {type : String},
  phone : {type : Number},
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // hashed
  status  : {type : Boolean},
  jobTitle : {type : String},
  image : {type : String},
  role: { type: String, enum: [t("manager"), t("staff")], default: t("staff") },
  additionalInfo: { type: String },
}, { timestamps: true })

export default mongoose.models.User || mongoose.model('User', UserSchema)
