import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = Router();

const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "admin123";

// ⚠️ OJO: esto se recalcula cada reinicio (está ok para demo)
const ADMIN_PASS_HASH = bcrypt.hashSync(ADMIN_PASS, 10);

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ ok: false, message: "Faltan credenciales" });
  }

  if (username !== ADMIN_USER) {
    return res.status(401).json({ ok: false, message: "Credenciales incorrectas" });
  }

  const ok = await bcrypt.compare(password, ADMIN_PASS_HASH);
  if (!ok) {
    return res.status(401).json({ ok: false, message: "Credenciales incorrectas" });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ ok: false, message: "Falta JWT_SECRET en .env" });
  }

  const token = jwt.sign(
    { username: ADMIN_USER, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  return res.json({ ok: true, token });
});

// GET /api/auth/me
router.get("/me", (req, res) => {
  const auth = req.headers.authorization || "";
  const [type, token] = auth.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ ok: false, message: "No autorizado" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ ok: true, user: payload });
  } catch {
    return res.status(401).json({ ok: false, message: "Token inválido" });
  }
});

export default router;
