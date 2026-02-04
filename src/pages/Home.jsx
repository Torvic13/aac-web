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
      title: "Servicio 1",
      text: "Texto referente a lo que se refiere el logo.",
      imgSrc: "",
    },
    {
      title: "Servicio 2",
      text: "Texto referente a lo que se refiere el logo.",
      imgSrc: "",
    },
    {
      title: "Servicio 3",
      text: "Texto referente a lo que se refiere el logo.",
      imgSrc: "",
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
