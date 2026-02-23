import styles from "./About.module.css";

export default function About() {
  return (
    <div className={styles.page}>
      {/* Fila 1 */}
      <section className={styles.row}>
      <div className={styles.boxImg}>
        <img 
          src="/img/4.jpeg" 
          alt="Educación financiera juvenil"
          className={styles.img}
        />
      </div>

        <div className={styles.boxText}>
          <h2>¿Quiénes somos?</h2>
          <p>
          Somos un proyecto educativo digital que promueve la educación financiera en jóvenes de 15 a 18 años. 
          Brindamos contenidos prácticos y dinámicos sobre ahorro, presupuesto y consumo responsable. 
          Usamos herramientas digitales para facilitar el aprendizaje aplicado a la vida diaria.
          </p>
        </div>
      </section>

      {/* Fila 2 */}
      <section className={`${styles.row} ${styles.rowReverse}`}>
        <div className={styles.boxText}>
          <h2>Nuestra misión</h2>
          <p>
          Ser un referente en educación financiera juvenil a través de plataformas digitales. 
          Formar jóvenes conscientes y preparados para manejar su dinero de manera responsable. 
          Impulsar una educación inclusiva y de calidad mediante herramientas innovadoras.
          </p>
        </div>

        <div className={styles.boxImg}>
          <img 
            src="/img/5.jpeg" 
            alt="Aprendizaje digital"
            className={styles.img}
          />
        </div>
      </section>

      {/* Fila 3 — Imagen derecha, texto izquierda */}
      <section className={styles.row}>
      <div className={styles.boxImg}>
          <img 
            src="/img/6.jpeg" 
            alt="Compromiso educativo"
            className={styles.img}
          />
        </div>
        <div className={styles.boxText}>
          <h2>Nuestro compromiso</h2>
          <p>
          Ofrecer educación financiera clara, accesible y entretenida para los jóvenes. 
          Fomentar el aprendizaje activo mediante retos prácticos y contenidos digitales. 
          Contribuir a la formación de decisiones económicas responsables.
          </p>
        </div>

        
      </section>
    </div>
  );
}
