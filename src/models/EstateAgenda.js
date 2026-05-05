import mongoose from "mongoose";

const EstateAgendaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
    },
    type: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
    //   required: true,
    },
    endTime: {
      type: String,
    //   required: true,
    },
    responsible: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EstateContact",
      default: null,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      default: null,
    },
    observations: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.EstateAgenda || mongoose.model("EstateAgenda", EstateAgendaSchema);