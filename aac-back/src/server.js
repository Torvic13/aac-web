import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import Contact from "./models/Contact.js";

const app = express();

// Permitir requests desde tu frontend
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

// Conectar a MongoDB Atlas
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Atlas conectado");
  } catch (error) {
    console.error("❌ Error conectando MongoDB:", error.message);
    process.exit(1);
  }
}

// Rutas
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Backend AAC WEB funcionando ✅" });
});

app.post("/api/contact", async (req, res) => {
  try {
    const { nombre, correo, celular, mensaje } = req.body;

    if (!nombre || !correo || !mensaje) {
      return res.status(400).json({
        ok: false,
        message: "Faltan campos obligatorios: nombre, correo, mensaje",
      });
    }

    const saved = await Contact.create({ nombre, correo, celular, mensaje });

    return res.status(201).json({
      ok: true,
      message: "Contacto guardado ✅",
      id: saved._id,
    });
  } catch (error) {
    console.error("❌ Error guardando contacto:", error.message);
    return res.status(500).json({
      ok: false,
      message: "Error guardando contacto",
    });
  }
});


// Iniciar servidor SOLO si Mongo conecta
const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
  });
});
