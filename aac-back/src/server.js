import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

const app = express();

// Validaciones de ENV
if (!process.env.MONGO_URI) {
  console.error("❌ Falta MONGO_URI en .env");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error("❌ Falta JWT_SECRET en .env");
  process.exit(1);
}

// Middlewares
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

// Health
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Backend AAC WEB funcionando ✅" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", contactRoutes);
app.use("/api", analyticsRoutes);

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
const allowedOrigins = [
  "http://localhost:3000",
  "https://aac-web-self.vercel.app", // reemplaza por tu URL real
];

app.use(
  cors({
    origin(origin, callback) {
      // permitir Postman/Insomnia (sin origin) y los origins de la lista
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  })
);

start();
