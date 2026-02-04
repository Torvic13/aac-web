import styles from "./About.module.css";

export default function About() {
  return (
    <div className={styles.page}>
      {/* Fila 1 */}
      <section className={styles.row}>
        <div className={styles.boxImg}>
          <span>IMAGEN</span>
        </div>

        <div className={styles.boxText}>
          <h2>¿Quiénes somos?</h2>
          <p>
            En AAC WEB buscamos ayudar a las personas a mejorar sus hábitos de ahorro
            y tomar mejores decisiones financieras mediante contenido educativo sencillo.
          </p>
        </div>
      </section>

      {/* Fila 2 */}
      <section className={`${styles.row} ${styles.rowReverse}`}>
        <div className={styles.boxText}>
          <h2>Nuestra misión</h2>
          <p>
            Proveer herramientas claras para que cualquier persona pueda organizar sus finanzas,
            ahorrar constantemente y lograr sus metas económicas.
          </p>
        </div>

        <div className={styles.boxImg}>
          <span>IMAGEN</span>
        </div>
      </section>

      {/* Fila 3 — Imagen derecha, texto izquierda */}
      <section className={styles.row}>
      <div className={styles.boxImg}>
          <span>IMAGEN</span>
        </div>
        <div className={styles.boxText}>
          <h2>Nuestro compromiso</h2>
          <p>
            Estamos comprometidos en construir contenidos accesibles, prácticos y útiles
            para que nuestros usuarios tengan un verdadero impacto en su día a día.
          </p>
        </div>

        
      </section>
    </div>
  );
}
