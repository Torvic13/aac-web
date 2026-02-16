import Analytics from "../models/Analytics.js";

// POST /api/analytics/event  (PÚBLICO)
// body: { key: "aprender_m1" }
export async function trackEvent(req, res) {
  try {
    const { key } = req.body || {};

    if (!key || typeof key !== "string") {
      return res.status(400).json({ ok: false, message: "Falta key" });
    }

    // incrementa o crea
    const doc = await Analytics.findOneAndUpdate(
      { key },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );

    return res.json({ ok: true, key: doc.key, count: doc.count });
  } catch (err) {
    console.error("❌ trackEvent:", err.message);
    return res.status(500).json({ ok: false, message: "Error registrando evento" });
  }
}

// GET /api/analytics/summary  (PROTEGIDO)
// devuelve un resumen para el Admin
export async function getSummary(req, res) {
  try {
    const all = await Analytics.find().lean();

    // helper
    const get = (k) => all.find((x) => x.key === k)?.count || 0;

    const summary = {
      aprender: {
        page: get("aprender_page"),
        m1: get("aprender_m1"),
        m2: get("aprender_m2"),
        m3: get("aprender_m3"),
      },
    };

    return res.json({ ok: true, summary });
  } catch (err) {
    console.error("❌ getSummary:", err.message);
    return res.status(500).json({ ok: false, message: "Error obteniendo analytics" });
  }
}
