import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import ImageCardSlider from "../components/ImageCardSlider";
import InfoCard from "../components/InfoCard";
import ContactSection from "../components/ContactSection";

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollToContact) {
      const el = document.getElementById("contact");
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 200);
      }
    }
  }, [location]);

  const cards = [
    {
      title: "Aprende",
      text: "Educación financiera básica para comprender el manejo del dinero desde temprana edad.",
      imgSrc: "/img/7.jpeg",
    },
    {
      title: "Ahorra",
      text: "Herramientas prácticas para el ahorro, presupuesto y control de gastos.",
      imgSrc: "/img/8.jpeg",
    },
    {
      title: "Crece",
      text: "Formación de hábitos financieros responsables para el futuro.",
      imgSrc: "/img/9.jpeg",
    },
  ];

  return (
    <div style={{ margin: 0, padding: 0 }}>
      <ImageCardSlider />

      <div className="home-content">
        <h1>Bienvenido a AAC WEB</h1>
        <p>Esta es tu página principal.</p>

        <section className="cards-grid">
          {cards.map((c, idx) => (
            <InfoCard key={idx} title={c.title} text={c.text} imgSrc={c.imgSrc} />
          ))}
        </section>

        <ContactSection />
      </div>
    </div>
  );
}
