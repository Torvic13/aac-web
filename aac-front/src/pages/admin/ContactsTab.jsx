import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function ContactsTab({ styles, logout }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [query, setQuery] = useState("");

  const navigate = useNavigate();

  const safeJson = async (res) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { ok: false, message: "Respuesta inválida del servidor." };
    }
  };

  const loadContacts = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      logout();
      return;
    }

    try {
      setErrMsg("");
      setLoading(true);

      const res = await fetch("https://aac-back.onrender.com/api/contacts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        logout();
        return;
      }

      const data = await safeJson(res);
      if (!res.ok) throw new Error(data.message || "Error cargando contactos");

      setContacts(data.contacts || []);
    } catch (err) {
      setErrMsg(err.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  }, [logout]);

  const deleteContact = useCallback(
    async (id) => {
      const ok = window.confirm("¿Eliminar este contacto?");
      if (!ok) return;

      const token = localStorage.getItem("token");
      if (!token) {
        logout();
        return;
      }

      try {
        const res = await fetch(`https://aac-back.onrender.com/api/contacts/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          logout();
          return;
        }

        const data = await safeJson(res);
        if (!res.ok) throw new Error(data.message || "Error eliminando");

        setContacts((prev) => prev.filter((c) => c._id !== id));
      } catch (err) {
        alert(err.message || "No se pudo eliminar");
      }
    },
    [logout]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    loadContacts();
  }, [navigate, loadContacts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter((c) => {
      const nombre = (c.nombre || "").toLowerCase();
      const correo = (c.correo || "").toLowerCase();
      const mensaje = (c.mensaje || "").toLowerCase();
      return nombre.includes(q) || correo.includes(q) || mensaje.includes(q);
    });
  }, [contacts, query]);

  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.cardTitle}>Mensajes recibidos</h2>
          <p className={styles.cardMeta}>
            {contacts.length} en total • {filtered.length} visibles
          </p>
        </div>

        <div className={styles.topbarActions}>
          <button className={styles.ghostBtn} onClick={loadContacts} disabled={loading}>
            {loading ? "Cargando..." : "Refrescar"}
          </button>
        </div>
      </div>

      <div className={styles.searchWrap}>
        <input
          className={styles.search}
          placeholder="Buscar por nombre, correo o mensaje..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {errMsg && <p className={styles.error}>❌ {errMsg}</p>}

      {!loading && filtered.length === 0 && (
        <p className={styles.empty}>No hay contactos para mostrar.</p>
      )}

      {filtered.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Celular</th>
                <th>Mensaje</th>
                <th>Fecha</th>
                <th className={styles.thRight}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c._id}>
                  <td className={styles.tdStrong}>{c.nombre}</td>
                  <td>{c.correo}</td>
                  <td>{c.celular || "-"}</td>
                  <td className={styles.tdMessage} title={c.mensaje}>
                    {c.mensaje}
                  </td>
                  <td>{c.createdAt ? new Date(c.createdAt).toLocaleString() : "-"}</td>
                  <td className={styles.tdRight}>
                    <button className={styles.dangerBtn} onClick={() => deleteContact(c._id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
