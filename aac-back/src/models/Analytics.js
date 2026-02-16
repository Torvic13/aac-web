import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true }, // ej: "aprender_m1"
    count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Analytics", analyticsSchema);
