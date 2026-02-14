export default function Footer() {
  return (
    <footer style={{
      marginTop: "40px",
      padding: "20px",
      background: "#eee",
      textAlign: "center"
    }}>
      <p>AAC WEB © {new Date().getFullYear()}</p>
    </footer>
  );
}
