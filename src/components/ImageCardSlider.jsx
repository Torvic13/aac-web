import { useEffect, useState } from "react";

const images = [
  "/img/1.jpg",
  "/img/2.jpg",
  "/img/3.jpg",
];
export default function ImageCardSlider() {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
    }, 3000); // cambia cada 3s
    return () => clearInterval(id);
  }, []);

  return (
    <div className="card-slider">
      <div className="card-slider__imgWrap">
        <img className="card-slider__img" src={images[index]} alt="slide" />

        <button className="card-slider__btn card-slider__btn--left" onClick={prev}>
          ‹
        </button>
        <button className="card-slider__btn card-slider__btn--right" onClick={next}>
          ›
        </button>

        <div className="card-slider__dots">
          {images.map((_, i) => (
            <button
              key={i}
              className={`card-slider__dot ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
              aria-label={`Ir a imagen ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
