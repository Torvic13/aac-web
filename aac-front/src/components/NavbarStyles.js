const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 999,
    background: "#222",
  },
  nav: {
    height: "70px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 30px",
    color: "white",
  },
  brand: {
    color: "white",
    textDecoration: "none",
    fontSize: "20px",
    fontWeight: 800,
    letterSpacing: "0.5px",
  },
  linksDesktop: {
    display: "flex",
    gap: "30px",
    fontSize: "18px",
  },
  burgerBtn: {
    display: "none",
    width: "44px",
    height: "44px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: 0,
  },
  burgerLine: {
    display: "block",
    width: "26px",
    height: "2px",
    background: "white",
    margin: "6px auto",
    transition: "0.2s ease",
  },
  mobileMenu: {
    display: "none",
    padding: "12px 18px 18px",
    borderTop: "1px solid rgba(255,255,255,0.12)",
  },
  mobileLink: {
    display: "block",
    padding: "12px 6px",
    color: "white",
    textDecoration: "none",
    fontSize: "18px",
    opacity: 0.95,
  },
};

export default styles;
