export default function InfoCard({ title, text, imgSrc }) {
  return (
    <article className="info-card">
      <div className="info-card__img">
        {imgSrc ? (
          <img src={imgSrc} alt={title} />
        ) : (
          <span>Imagen (logo)</span>
        )}
      </div>

      <div className="info-card__body">
        <h3 className="info-card__title">{title}</h3>
        <p className="info-card__text">{text}</p>
      </div>
    </article>
  );
}
