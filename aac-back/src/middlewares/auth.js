import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const parts = authHeader.trim().split(/\s+/); // separa por 1+ espacios

  const type = parts[0];
  const token = parts[1];

  if (!type || !token || type.toLowerCase() !== "bearer") {
    return res.status(401).json({ ok: false, message: "No autorizado" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { username, role }
    return next();
  } catch (err) {
    return res
      .status(401)
      .json({ ok: false, message: "Token inválido o expirado" });
  }
}
