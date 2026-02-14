import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    correo: { type: String, required: true, trim: true },
    celular: { type: String, trim: true, default: "" },
    mensaje: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);
