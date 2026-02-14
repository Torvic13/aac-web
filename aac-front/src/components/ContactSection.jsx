import { useState } from "react";

export default function ContactSection() {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    celular: "",
    mensaje: "",
  });

  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", msg: "" });

    // validación mínima
    if (!form.nombre || !form.correo || !form.mensaje) {
      setStatus({ type: "error", msg: "Completa Nombre, Correo y Mensaje." });
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
        setStatus({ type: "error", msg: data.message || "Error al enviar." });
        return;
      }

      setStatus({ type: "ok", msg: "Mensaje enviado ✅" });
      setForm({ nombre: "", correo: "", celular: "", mensaje: "" });
    } catch (err) {
      setStatus({ type: "error", msg: "No se pudo conectar al servidor." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <h2>Contáctanos</h2>
      <p>Déjanos tus datos y te responderemos lo antes posible.</p>

      <form onSubmit={onSubmit} className="contact-form">
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

        {status.msg && (
          <p style={{ marginTop: 12, opacity: 0.9 }}>
            {status.type === "error" ? "❌ " : "✅ "}
            {status.msg}
          </p>
        )}
      </form>
    </section>
  );
}
