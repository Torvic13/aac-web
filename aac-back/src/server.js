import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

const app = express();

// ✅ CORS (ÚNICO)
app.use(
  cors({
    origin: [
      "http://localhost:3000",          // React en desarrollo (CRA)
      "https://aac-web.vercel.app",     // ⬅️ PON AQUÍ TU DOMINIO REAL DE VERCEL
    ],
    credentials: true,
  })
);

// Body parser
app.use(express.json());

// Health
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Backend AAC WEB funcionando ✅" });
});

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api", contactRoutes);
app.use("/api", analyticsRoutes);

// ✅ Validaciones de ENV
if (!process.env.MONGO_URI) {
  console.error("❌ Falta MONGO_URI en .env");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error("❌ Falta JWT_SECRET en .env");
  process.exit(1);
}

// Mongo + Start Server
const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Atlas conectado");

    app.listen(PORT, () => {
      console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error conectando MongoDB:", error.message);
    process.exit(1);
  }
}

start();