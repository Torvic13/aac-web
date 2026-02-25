import { useEffect, useState, useCallback, useMemo } from "react";
import styles from "./AnalyticsTab.module.css";

const EVENTS_PER_PERSON = 3; // 👈 3 eventos = 1 persona (aprox)

export default function AnalyticsTab({ logout }) {
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingChart, setLoadingChart] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const [summary, setSummary] = useState(null);

  const [range, setRange] = useState("day");
  const [moduleKey, setModuleKey] = useState("");
  const [series, setSeries] = useState({ labels: [], values: [] }); // values = PERSONAS

  const safeJson = async (res) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { ok: false, message: "Respuesta inválida del servidor." };
    }
  };

  const getTokenOrLogout = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      logout();
      return null;
    }
    return token;
  }, [logout]);

  const loadSummary = useCallback(async () => {
    const token = getTokenOrLogout();
    if (!token) return;

    const res = await fetch(
      "https://aac-back.onrender.com/api/analytics/summary",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.status === 401) return logout();

    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.message || "Error cargando summary");

    setSummary(data);
  }, [logout, getTokenOrLogout]);

  const loadSeries = useCallback(async () => {
    const token = getTokenOrLogout();
    if (!token) return;

    const qs = new URLSearchParams();
    qs.set("range", range);
    if (moduleKey) qs.set("key", moduleKey);

    const res = await fetch(
      `https://aac-back.onrender.com/api/analytics/timeseries?${qs.toString()}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.status === 401) return logout();

    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.message || "Error cargando gráfico");

    // data.values llega en EVENTOS por bucket -> lo convertimos a PERSONAS
    const labels = Array.isArray(data.labels) ? data.labels : [];
    const eventValues = Array.isArray(data.values) ? data.values : [];

    const personValues = eventValues.map((v) =>
      Math.ceil((Number(v) || 0) / EVENTS_PER_PERSON)
    );

    setSeries({
      labels,
      values: personValues, // 👈 ahora el gráfico usa "personas"
    });
  }, [logout, getTokenOrLogout, range, moduleKey]);

  const refreshAll = useCallback(async () => {
    try {
      setErrMsg("");
      setLoadingSummary(true);
      setLoadingChart(true);
      await Promise.all([loadSummary(), loadSeries()]);
    } catch (e) {
      setErrMsg(e.message || "Error inesperado");
    } finally {
      setLoadingSummary(false);
      setLoadingChart(false);
    }
  }, [loadSummary, loadSeries]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  useEffect(() => {
    (async () => {
      try {
        setErrMsg("");
        setLoadingChart(true);
        await loadSeries();
      } catch (e) {
        setErrMsg(e.message || "Error inesperado");
      } finally {
        setLoadingChart(false);
      }
    })();
  }, [range, moduleKey, loadSeries]);

  // --- KPIs (eventos crudos) ---
  const counts = useMemo(() => summary?.byKey || {}, [summary]);
  const m1 = counts["aprender_m1"] || 0;
  const m2 = counts["aprender_m2"] || 0;
  const m3 = counts["aprender_m3"] || 0;
  const totalEvents =
    typeof summary?.total === "number" ? summary.total : m1 + m2 + m3;

  // Personas (estimado) en el rango actual = suma de valores del gráfico
  const peopleInRange = useMemo(
    () => (series.values || []).reduce((a, b) => a + (Number(b) || 0), 0),
    [series.values]
  );

  const maxVal = Math.max(1, ...(series.values || []));

  return (
    <section className={styles.grid}>
      {/* Card grande */}
      <div className={`${styles.card} ${styles.span2}`}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>Analytics</h2>
            <p className={styles.cardMeta}>
              Gráfico = <b>personas únicas (estimadas)</b> por{" "}
              {range === "day" ? "día" : range === "week" ? "semana" : "mes"}
              {moduleKey ? ` (solo ${moduleKey})` : " (todos los módulos)"}
            </p>
          </div>

          <div className={styles.topbarActions}>
            <button
              className={styles.ghostBtn}
              onClick={refreshAll}
              disabled={loadingSummary || loadingChart}
            >
              {loadingSummary || loadingChart ? "Actualizando..." : "Refrescar"}
            </button>
          </div>
        </div>

        {errMsg && <p className={styles.error}>❌ {errMsg}</p>}

        {/* Filtros */}
        <div className={styles.analyticsControls}>
          <div className={styles.control}>
            <label className={styles.controlLabel}>Módulo</label>
            <select
              className={styles.select}
              value={moduleKey}
              onChange={(e) => setModuleKey(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="aprender_m1">Módulo 1</option>
              <option value="aprender_m2">Módulo 2</option>
              <option value="aprender_m3">Módulo 3</option>
            </select>
          </div>

          <div className={styles.control}>
            <label className={styles.controlLabel}>Rango</label>
            <select
              className={styles.select}
              value={range}
              onChange={(e) => setRange(e.target.value)}
            >
              <option value="day">Día</option>
              <option value="week">Semana</option>
              <option value="month">Mes</option>
            </select>
          </div>
        </div>

        {/* Gráfico */}
        <div className={styles.chartWrap}>
          {loadingChart ? (
            <p className={styles.cardMeta}>Cargando gráfico...</p>
          ) : series.labels.length === 0 ? (
            <p className={styles.empty}>Aún no hay datos para este filtro.</p>
          ) : (
            <div className={styles.bars}>
              {series.labels.map((lab, i) => {
                const v = series.values[i] || 0; // v = PERSONAS
                const h = Math.round((v / maxVal) * 100);
                return (
                  <div
                    key={lab + i}
                    className={styles.barItem}
                    title={`${lab}: ${v} personas (estimadas)`}
                  >
                    <div className={styles.bar} style={{ height: `${h}%` }} />
                    <span className={styles.barLabel}>{lab}</span>
                    <span className={styles.barValue}>{v}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* KPIs */}
      <div className={styles.kpi}>
        <p className={styles.kpiLabel}>Personas en este rango</p>
        <p className={styles.kpiValue}>{loadingChart ? "..." : peopleInRange}</p>
        <p className={styles.kpiHint}>Únicas por bucket (estimado)</p>
      </div>

      <div className={styles.kpi}>
        <p className={styles.kpiLabel}>Eventos totales</p>
        <p className={styles.kpiValue}>{loadingSummary ? "..." : totalEvents}</p>
        <p className={styles.kpiHint}>Suma de popups aceptados</p>
      </div>

      <div className={styles.kpi}>
        <p className={styles.kpiLabel}>Módulo 1 (eventos)</p>
        <p className={styles.kpiValue}>{loadingSummary ? "..." : m1}</p>
        <p className={styles.kpiHint}>aprender_m1</p>
      </div>

      <div className={styles.kpi}>
        <p className={styles.kpiLabel}>Módulo 2 (eventos)</p>
        <p className={styles.kpiValue}>{loadingSummary ? "..." : m2}</p>
        <p className={styles.kpiHint}>aprender_m2</p>
      </div>

      <div className={styles.kpi}>
        <p className={styles.kpiLabel}>Módulo 3 (eventos)</p>
        <p className={styles.kpiValue}>{loadingSummary ? "..." : m3}</p>
        <p className={styles.kpiHint}>aprender_m3</p>
      </div>
    </section>
  );
}