import { useEffect, useState, useCallback, useMemo } from "react";
import styles from "./AnalyticsTab.module.css";

const EVENTS_PER_PERSON = 3;

export default function AnalyticsTab({ logout }) {
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingChart, setLoadingChart] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const [summary, setSummary] = useState(null);

  const [range, setRange] = useState("day");
  const [moduleKey, setModuleKey] = useState("");

  const [series, setSeries] = useState({
    labels: [],
    persons: [],
  });

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
      { headers: { Authorization: `Bearer ${token}` } }
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

    const labels = Array.isArray(data.labels) ? data.labels : [];
    const rawEvents = Array.isArray(data.values)
      ? data.values.map((v) => Number(v) || 0)
      : [];

    const persons = rawEvents.map((v) => Math.floor(v / EVENTS_PER_PERSON));
    setSeries({ labels, persons });
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

  // KPIs (personas históricas)
  const counts = useMemo(() => summary?.byKey || {}, [summary]);
  const m1Events = counts["aprender_m1"] || 0;
  const m2Events = counts["aprender_m2"] || 0;
  const m3Events = counts["aprender_m3"] || 0;

  const totalEvents =
    typeof summary?.total === "number"
      ? summary.total
      : m1Events + m2Events + m3Events;

  const totalPersons = Math.floor(totalEvents / EVENTS_PER_PERSON);
  const m1Persons = Math.floor(m1Events / EVENTS_PER_PERSON);
  const m2Persons = Math.floor(m2Events / EVENTS_PER_PERSON);
  const m3Persons = Math.floor(m3Events / EVENTS_PER_PERSON);

  const maxVal = Math.max(1, ...(series.persons || []));

  return (
    <section className={styles.grid}>
      {/* IZQUIERDA: gráfico */}
      <div className={`${styles.card} ${styles.span2}`}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>Analytics</h2>
            <p className={styles.cardMeta}>
              Gráfico = <b>personas (estimadas)</b> por{" "}
              {range === "day" ? "día" : range === "week" ? "semana" : "mes"}
              {moduleKey ? ` (solo ${moduleKey})` : " (todos los módulos)"}.
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
                const persons = series.persons[i] || 0;
                const h = Math.round((persons / maxVal) * 100);

                return (
                  <div key={lab + i} className={styles.barItem}>
                    <div className={styles.bar} style={{ height: `${h}%` }} />
                    <span className={styles.barLabel}>{lab}</span>
                    {/* ✅ SOLO PERSONAS */}
                    <span className={styles.barValue}>{persons}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ✅ DERECHA: UN SOLO CONTENEDOR */}
      <aside className={`${styles.card} ${styles.spanRight}`}>
        <div className={styles.kpiStack}>
          <div className={styles.kpiBox}>
            <p className={styles.kpiLabel}>Total personas (histórico)</p>
            <p className={styles.kpiValue}>{loadingSummary ? "..." : totalPersons}</p>
          </div>

          <div className={styles.kpiBox}>
            <p className={styles.kpiLabel}>Módulo 1 (personas)</p>
            <p className={styles.kpiValue}>{loadingSummary ? "..." : m1Persons}</p>
          </div>

          <div className={styles.kpiBox}>
            <p className={styles.kpiLabel}>Módulo 2 (personas)</p>
            <p className={styles.kpiValue}>{loadingSummary ? "..." : m2Persons}</p>
          </div>

          <div className={styles.kpiBox}>
            <p className={styles.kpiLabel}>Módulo 3 (personas)</p>
            <p className={styles.kpiValue}>{loadingSummary ? "..." : m3Persons}</p>
          </div>
        </div>
      </aside>
    </section>
  );
}