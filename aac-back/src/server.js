import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

const app = express();

/* -----------------------  VALIDACIÓN DE ENV  ----------------------- */
if (!process.env.MONGO_URI) {
  console.error("❌ Falta MONGO_URI en .env");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error("❌ Falta JWT_SECRET en .env");
  process.exit(1);
}

/* -----------------------  CONFIGURACIÓN DE CORS  ----------------------- */

// ⬅️ CAMBIA ESTE dominio por el EXACTO DE TU VERCEL
const allowedOrigins = [
  "http://localhost:3000",
  "https://aac-web-self.vercel.app", 
  // ejemplo: "https://aac-web.vercel.app"
];

app.use(
  cors({
    origin(origin, callback) {
      // Permitir Insomnia/Postman (sin origin) y los origins permitidos
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("❌ CORS bloqueó la petición"));
    },
    credentials: true,
  })
);

/* -----------------------  MIDDLEWARES  ----------------------- */
app.use(express.json());

/* -----------------------  HEALTH CHECK  ----------------------- */
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Backend AAC WEB funcionando ✅" });
});

/* -----------------------  RUTAS  ----------------------- */
app.use("/api/auth", authRoutes);
app.use("/api", contactRoutes);
app.use("/api", analyticsRoutes);

/* -----------------------  MONGO + START SERVER  ----------------------- */
const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Atlas conectado");

    app.listen(PORT, () => {
      console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error.message);
    process.exit(1);
  }
}

start();