// src/models/AnalyticsEvent.js
import mongoose from "mongoose";

const AnalyticsEventSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, index: true }, // aprender_m1, aprender_m2...
    meta: { type: Object, default: {} },

    ip: { type: String, default: "" },
    userAgent: { type: String, default: "" },

    // ✅ Para contar "personas" sin login (demo): ip + userAgent
    visitorId: { type: String, default: "", index: true },
  },
  { timestamps: true }
);

export default mongoose.model("AnalyticsEvent", AnalyticsEventSchema);