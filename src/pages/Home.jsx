import ImageCardSlider from "../components/ImageCardSlider";

export default function Home() {
  return (
    <div style={{ margin: 0, padding: 0 }}>
      <div style={{ margin: 0, padding: 0 }}>
        <ImageCardSlider />
      </div>

      <div style={{ padding: "30px" }}>
        <h1 style={{ marginTop: 0 }}>Bienvenido a AAC WEB</h1>
        <p>Esta es tu página principal.</p>
      </div>
    </div>
  );
}
