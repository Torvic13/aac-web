export default function ContactSection() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Front-only por ahora
    alert("✅ Mensaje enviado (demo). Luego lo conectamos al backend.");
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-grid">
        <div className="contact-image">
          <span>Imagen</span>
        </div>

        <div className="contact-form-wrap">
          <h2>Contáctanos</h2>
          <p>Déjanos tus datos y te responderemos lo antes posible.</p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              Nombre
              <input type="text" name="name" placeholder="Tu nombre" required />
            </label>

            <label>
              Correo
              <input type="email" name="email" placeholder="tu@correo.com" required />
            </label>

            <label>
              Celular
              <input type="tel" name="phone" placeholder="+51 999 999 999" />
            </label>

            <label>
              Mensaje
              <textarea name="message" rows="4" placeholder="Cuéntanos en qué te ayudamos..." required />
            </label>

            <button type="submit">Enviar</button>
          </form>
        </div>
      </div>
    </section>
  );
}
