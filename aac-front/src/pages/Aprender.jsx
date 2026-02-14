import { useMemo, useState } from "react";
import styles from "./Aprender.module.css";

const modulesData = [
  {
    id: "m1",
    title: "Módulo 1: Ahorro",
    videos: [
      {
        id: "v1",
        title: "¿Qué es ahorrar? (bases)",
        youtubeId: "952ILTHDgC4",
        duration: "6:12",
        description: "Aprende lo esencial para empezar a ahorrar desde hoy.",
      },
      {
        id: "v2",
        title: "5 tips rápidos para ahorrar",
        youtubeId: "952ILTHDgC4",
        duration: "5:40",
        description: "Consejos simples y prácticos para tu día a día.",
      },
    ],
  },
  {
    id: "m2",
    title: "Módulo 2: Presupuesto",
    videos: [
      {
        id: "v3",
        title: "Regla 50/30/20 explicada",
        youtubeId: "952ILTHDgC4",
        duration: "8:40",
        description: "Ordena tus gastos con una regla fácil de aplicar.",
      },
      {
        id: "v4",
        title: "Cómo registrar gastos (sin morir)",
        youtubeId: "952ILTHDgC4",
        duration: "7:05",
        description: "Métodos sencillos para llevar control de tu dinero.",
      },
    ],
  },
  {
    id: "m3",
    title: "Módulo 3: Metas",
    videos: [
      {
        id: "v5",
        title: "Metas financieras en 3 pasos",
        youtubeId: "952ILTHDgC4",
        duration: "5:48",
        description: "Define metas claras y mantenlas en el tiempo.",
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
                className={`${styles.moduleBtn} ${m.id === activeModuleId ? styles.active : ""}`}
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
                  className={`${styles.videoItem} ${v.id === activeVideoId ? styles.videoActive : ""}`}
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
