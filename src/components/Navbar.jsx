import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./NavbarStyles";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const linkStyle = (isActive) => ({
    color: "white",
    textDecoration: "none",
    opacity: isActive ? 1 : 0.85,
    fontWeight: isActive ? 700 : 500,
  });

  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header style={styles.header}>
      <nav style={styles.nav}>
        <Link to="/" style={styles.brand}>
          AAC WEB
        </Link>

        <div className="nav-links-desktop" style={styles.linksDesktop}>
          <Link to="/" style={linkStyle(location.pathname === "/")}>Home</Link>
          <Link to="/about" style={linkStyle(location.pathname === "/about")}>About</Link>
          <Link to="/aprender" style={linkStyle(location.pathname === "/aprender")}>Aprender</Link>

          {/* Contact: baja a la sección en la misma página */}
          <button
            onClick={scrollToContact}
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
              color: "white",
              fontSize: "18px",
              opacity: 0.85,
              fontWeight: 500,
            }}
          >
            Contact
          </button>
        </div>

        <button
          className="nav-burger"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
          style={styles.burgerBtn}
        >
          <span style={styles.burgerLine} />
          <span style={styles.burgerLine} />
          <span style={styles.burgerLine} />
        </button>
      </nav>

      {open && (
        <div className="nav-mobile-menu" style={styles.mobileMenu}>
          <Link to="/" style={styles.mobileLink}>Home</Link>
          <Link to="/about" style={styles.mobileLink}>About</Link>
          <Link to="/aprender" style={styles.mobileLink}>Aprender</Link>

          {/* Contact en móvil */}
          <button
            onClick={scrollToContact}
            style={{
              background: "transparent",
              border: "none",
              textAlign: "left",
              padding: "12px 6px",
              cursor: "pointer",
              color: "white",
              fontSize: "18px",
              opacity: 0.95,
              width: "100%",
            }}
          >
            Contact
          </button>
        </div>
      )}
    </header>
  );
}
