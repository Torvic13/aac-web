import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Admin.module.css";

import ContactsTab from "./admin/ContactsTab";
import AnalyticsTab from "./admin/AnalyticsTab";

export default function Admin() {
  const [tab, setTab] = useState("contacts");
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    navigate("/login");
  }, [navigate]);

  return (
    <div className={styles.page}>
      {/* Top bar */}
      <header className={styles.topbar}>
        <div>
          <h1 className={styles.title}>Panel</h1>
          <p className={styles.subtitle}>Gestiona contactos y revisa métricas.</p>
        </div>

        <div className={styles.topbarActions}>
          <button className={styles.primaryBtn} onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === "contacts" ? styles.tabActive : ""}`}
          onClick={() => setTab("contacts")}
        >
          Contactos
        </button>
        <button
          className={`${styles.tab} ${tab === "analytics" ? styles.tabActive : ""}`}
          onClick={() => setTab("analytics")}
        >
          Analytics
        </button>
      </nav>

      {/* Content */}
      {tab === "contacts" ? (
        <ContactsTab styles={styles} logout={logout} />
      ) : (
        <AnalyticsTab logout={logout} />
      )}
    </div>
  );
}
