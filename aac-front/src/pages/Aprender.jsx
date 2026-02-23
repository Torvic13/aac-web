import { useMemo, useState, useEffect, useRef } from "react";
import styles from "./Aprender.module.css";

const modulesData = [
  {
    id: "m1",
    title: "Módulo 1: Construyendo mi vida financiera",
    videos: [
      {
        id: "v1",
        title: "Mi vida financiera empieza hoy",
        youtubeId: "7IOpecA89nI",
        duration: "1:16",
        description: "¿Crees que las finanzas son solo para adultos? ¡Error! Tu futuro se construye con las decisiones que tomas hoy. Descubre los 3 pilares básicos (ingresos, gastos y ahorro) para tomar el control de tu dinero desde ahora. 🚀",
      },
      {
        id: "v2",
        title: "Cómo controlar los gastos pequeños",
        youtubeId: "rtYNDIsuCEw",
        duration: "1:16",
        description: "¿A dónde se va tu dinero a fin de mes? ☕🍪 Esos pequeños gustos diarios podrían estar saboteando tus metas. Aprende a identificar los gastos hormiga y descubre trucos sencillos para frenarlos sin dejar de disfrutar.",
      },
    ],
  },
  {
    id: "m2",
    title: "Módulo 2: Ahorrando para mi futuro",
    videos: [
      {
        id: "v3",
        title: "Ahorrar es una decisión",
        youtubeId: "75kc7uzNjCc",
        duration: "1:02",
        description: "Si esperas a que 'sobre dinero para ahorrar', probablemente nunca lo hagas. El ahorro no es un resto, es una prioridad. Te enseñamos el método 50/30/20 para que empieces a guardar dinero de forma inteligente y constante. 📊",
      },
      {
        id: "v4",
        title: "Ahorrar con metas claras",
        youtubeId: "v_Fr6aujhdA",
        duration: "7:05",
        description: "Ahorrar por ahorrar es aburrido, pero ahorrar para un viaje, un curso o tu propio negocio lo cambia todo. 🎯 Ponle nombre y apellido a tus metas y aprende a dividir tus grandes sueños en pasos pequeños y alcanzables.",
      },
    ],
  },
  {
    id: "m3",
    title: "Módulo 3: Manejo responsable de las deudas",
    videos: [
      {
        id: "v5",
        title: " El uso adecuado del crédito",
        youtubeId: "4lByqWunDec",
        duration: "1:06",
        description: "¿La deuda es tu amiga o tu enemiga? Todo depende de cómo la uses. Aprende la diferencia entre una deuda positiva (inversión) y una negativa (consumo), y conoce la regla de oro para no sobreendeudarte. 💳",
      },
      {
        id: "v6",
        title: "Cuidar el dinero en internet",
        youtubeId: "H_S_SmhjRLY",
        duration: "1:07",
        description: "En el mundo digital, tu mayor activo es tu información. No caigas en estafas ni enlaces sospechosos. 🔒 Te damos consejos clave para blindar tus cuentas bancarias y manejar tu dinero en internet con total confianza.",
      },
    ],
  },
];

export default function Aprender() {
  const [activeModuleId, setActiveModuleId] = useState(modulesData[0].id);
  const activeModule = useMemo(
    () => modulesData.find((m) => m.id === activeModuleId),
    [activeModuleId]
  );

  const [activeVideoId, setActiveVideoId] = useState(modulesData[0].videos[0].id);

  const activeVideo = useMemo(() => {
    const m = modulesData.find((x) => x.id === activeModuleId) || modulesData[0];
    return m.videos.find((v) => v.id === activeVideoId) || m.videos[0];
  }, [activeModuleId, activeVideoId]);

  // =========================
  // ✅ POPUP + TRACKING
  // =========================
  const [showWelcome, setShowWelcome] = useState(true);
  const [pendingKey, setPendingKey] = useState(`aprender_${modulesData[0].id}`);
  const sentKeysRef = useRef(new Set()); // evita duplicados si el usuario acepta varias veces sin cambiar módulo

  // Cuando cambias de módulo, vuelve a mostrar popup y prepara key
  useEffect(() => {
    setPendingKey(`aprender_${activeModuleId}`);
    setShowWelcome(true);
  }, [activeModuleId]);

  const sendAnalyticsEvent = async (key) => {
    // evita duplicar el mismo key en la misma sesión si ya se envió
    if (sentKeysRef.current.has(key)) return;

    try {
      await fetch("http://localhost:4000/api/analytics/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });

      sentKeysRef.current.add(key);
    } catch (e) {
      // si falla no rompemos la UX; solo no cuenta
      // console.log("No se pudo registrar analytics", e);
    }
  };

  const acceptWelcome = async () => {
    setShowWelcome(false);
    await sendAnalyticsEvent(pendingKey);
  };

  // Si cambias de módulo, selecciona el primer video de ese módulo
  const onSelectModule = (moduleId) => {
    setActiveModuleId(moduleId);
    const m = modulesData.find((x) => x.id === moduleId);
    if (m?.videos?.length) setActiveVideoId(m.videos[0].id);
  };

  return (
    <div className={styles.page}>
      {/* Banner */}
      <section
        className={styles.banner}
        style={{ backgroundImage: `url("/img/banner.jpg")` }}
      >
        <div className={styles.bannerOverlay} />

        <div className={styles.bannerInner}>
          <h1 className={styles.bannerTitle}>Aprender</h1>
          <p className={styles.bannerText}>
            Videos educativos para ahorrar y mejorar tus finanzas.
          </p>
        </div>
      </section>

      {/* ✅ POPUP */}
      {showWelcome && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalCard}>
            <div className={styles.modalIcon}>👋</div>
            <h3 className={styles.modalTitle}>¡Bienvenido!</h3>
            <p className={styles.modalText}>
              Estás ingresando a <strong>{activeModule?.title}</strong>.
            </p>

            <button className={styles.modalBtn} onClick={acceptWelcome}>
              Aceptar
            </button>
          </div>
        </div>
      )}

      {/* Layout: sidebar + contenido */}
      <div className={styles.layout}>
        {/* Sidebar módulos */}
        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>Módulos</h2>

          <div className={styles.moduleList}>
            {modulesData.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`${styles.moduleBtn} ${
                  m.id === activeModuleId ? styles.active : ""
                }`}
                onClick={() => onSelectModule(m.id)}
              >
                {m.title}
              </button>
            ))}
          </div>
        </aside>

        {/* Zona video */}
        <main className={styles.content}>
          {/* Header del módulo + lista de videos */}
          <div className={styles.contentTop}>
            <div>
              <div className={styles.moduleLabel}>Estás en:</div>
              <div className={styles.moduleName}>{activeModule?.title}</div>
            </div>

            <div className={styles.videoList}>
              {activeModule?.videos.map((v, idx) => (
                <button
                  key={v.id}
                  type="button"
                  className={`${styles.videoItem} ${
                    v.id === activeVideoId ? styles.videoActive : ""
                  }`}
                  onClick={() => setActiveVideoId(v.id)}
                >
                  <span className={styles.videoIndex}>Video {idx + 1}</span>
                  <span className={styles.videoTitle}>{v.title}</span>
                  <span className={styles.videoDuration}>{v.duration}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Player */}
          <div className={styles.playerWrap}>
            <div className={styles.player}>
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className={styles.videoInfo}>
              <h3 className={styles.videoInfoTitle}>{activeVideo.title}</h3>
              <p className={styles.videoInfoDesc}>{activeVideo.description}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
