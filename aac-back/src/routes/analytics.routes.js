import { Router } from "express";
import AnalyticsEvent from "../models/AnalyticsEvent.js";
import { requireAuth } from "../middlewares/auth.js";
import crypto from "crypto";

const router = Router();

/**
 * Público
 * POST /api/analytics/event
 * body: { key: "aprender_m1", meta?: {...} }
 */
router.post("/analytics/event", async (req, res) => {
  try {
    const { key, meta, createdAt } = req.body || {};
    if (!key) return res.status(400).json({ ok: false, message: "Falta key" });

    const ip =
      req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      "";

    const ua = req.headers["user-agent"] || "";

    const doc = {
      key,
      meta: meta || {},
      ip,
      userAgent: ua,
    };

    // ✅ Solo para DEV: permitir setear fecha
    if (process.env.ALLOW_ANALYTICS_TEST_DATES === "true" && createdAt) {
      doc.createdAt = new Date(createdAt);
    }

    await AnalyticsEvent.create(doc);

    return res.status(201).json({ ok: true });
  } catch (e) {
    console.error("analytics/event error:", e.message);
    return res.status(500).json({ ok: false, message: "Error guardando evento" });
  }
});


/**
 * Protegido: summary (eventos totales, por key)
 * GET /api/analytics/summary
 */
router.get("/analytics/summary", requireAuth, async (req, res) => {
  try {
    const rows = await AnalyticsEvent.aggregate([
      { $group: { _id: "$key", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const byKey = {};
    let total = 0;
    for (const r of rows) {
      byKey[r._id] = r.count;
      total += r.count;
    }

    return res.json({ ok: true, total, byKey });
  } catch (e) {
    console.error("analytics/summary error:", e.message);
    return res.status(500).json({ ok: false, message: "Error obteniendo summary" });
  }
});

/**
 * ✅ Personas únicas por periodo (dedupe por visitorId)
 * GET /api/analytics/timeseries?range=day|week|month&key=aprender_m1
 *
 * - Si NO mandas key: cuenta personas que vieron cualquier módulo (m1/m2/m3)
 * - Si mandas key: cuenta personas que vieron ese módulo
 */
// GET /api/analytics/timeseries?range=day|week|month&key=aprender_m1
router.get("/analytics/timeseries", requireAuth, async (req, res) => {
  try {
    const range = (req.query.range || "day").toString(); // day | week | month
    const key = (req.query.key || "").toString();
    const TZ = "America/Lima";

    const now = new Date();
    const start = new Date(now);

    // Ventanas
    if (range === "day") start.setDate(now.getDate() - 6);          // 7 días
    else if (range === "week") start.setDate(now.getDate() - 56);   // 8 semanas aprox
    else start.setMonth(now.getMonth() - 11);                       // 12 meses

    const match = { createdAt: { $gte: start } };
    if (key) match.key = key;

    let pipeline = [{ $match: match }];

    if (range === "day") {
      pipeline.push(
        {
          $group: {
            _id: {
              $dateToString: { date: "$createdAt", format: "%Y-%m-%d", timezone: TZ },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } }
      );
    } else if (range === "month") {
      pipeline.push(
        {
          $group: {
            _id: {
              $dateToString: { date: "$createdAt", format: "%Y-%m", timezone: TZ },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } }
      );
    } else {
      // week (ISO week) usando timezone de Perú
      pipeline.push(
        {
          $addFields: {
            _parts: { $dateToParts: { date: "$createdAt", timezone: TZ, iso8601: true } },
          },
        },
        {
          $group: {
            _id: {
              y: "$_parts.isoWeekYear",
              w: "$_parts.isoWeek",
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.y": 1, "_id.w": 1 } }
      );
    }

    const rows = await AnalyticsEvent.aggregate(pipeline);

    const labels = rows.map((r) => {
      if (range === "week") return `Semana ${r._id.w} (${r._id.y})`;
      if (range === "month") return r._id; // "YYYY-MM"
      return r._id; // "YYYY-MM-DD"
    });

    const values = rows.map((r) => r.count);

    return res.json({
      ok: true,
      range,
      key: key || "all",
      labels,
      values,
    });
  } catch (e) {
    console.error("analytics/timeseries error:", e);
    return res.status(500).json({ ok: false, message: "Error obteniendo time series" });
  }
});

function formatLabel(d, unit) {
  if (unit === "day") return d.toLocaleDateString();         // 15/2/2026
  if (unit === "week") return `Semana ${getWeekNumber(d)}`;  // Semana 7
  return `${d.getMonth() + 1}/${d.getFullYear()}`;           // 2/2026
}

function getWeekNumber(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return weekNo;
}

export default router;
