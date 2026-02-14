import { useEffect, useRef, useState } from "react";
import styles from "./ContactSection.module.css";

export default function ContactSection() {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    celular: "",
    mensaje: "",
  });

  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const showToast = (type, msg, ms = 3000) => {
    setStatus({ type, msg });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setStatus({ type: "", msg: "" }), ms);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.correo || !form.mensaje) {
      showToast("error", "Completa Nombre, Correo y Mensaje.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:4000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast("error", data.message || "Error al enviar.");
        return;
      }

      showToast("ok", "Mensaje enviado correctamente ✅");
      setForm({ nombre: "", correo: "", celular: "", mensaje: "" });
    } catch (err) {
      showToast("error", "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className={styles.contactSection}>
      <div className={styles.contactGrid}>
        {/* Imagen lado izquierdo */}
        <div className={styles.contactImage}>
          {/* Cuando quieras poner imagen real, descomenta esto: */}
          {/* <img src="/img/tu-imagen.jpg" alt="Contacto" /> */}
          <span>Imagen</span>
        </div>

        {/* Formulario */}
        <div className={styles.contactFormWrap}>
          <h2>Contáctanos</h2>
          <p>Déjanos tus datos y te responderemos lo antes posible.</p>

          <form onSubmit={onSubmit} className={styles.contactForm}>
            <label>
              Nombre
              <input
                name="nombre"
                value={form.nombre}
                onChange={onChange}
                placeholder="Tu nombre"
              />
            </label>

            <label>
              Correo
              <input
                name="correo"
                type="email"
                value={form.correo}
                onChange={onChange}
                placeholder="tu@correo.com"
              />
            </label>

            <label>
              Celular
              <input
                name="celular"
                value={form.celular}
                onChange={onChange}
                placeholder="+51 999 999 999"
              />
            </label>

            <label>
              Mensaje
              <textarea
                name="mensaje"
                value={form.mensaje}
                onChange={onChange}
                placeholder="Cuéntanos en qué te ayudamos..."
                rows={5}
              />
            </label>

            <button type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </form>
        </div>
      </div>

      {/* Toast flotante */}
      {status.msg && (
        <div
          className={`${styles.toast} ${
            status.type === "error" ? styles.toastError : styles.toastOk
          }`}
        >
          {status.msg}
        </div>
      )}
    </section>
  );
}
