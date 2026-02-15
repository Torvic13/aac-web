import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    navigate("/login");
  }, [navigate]);

  const loadContacts = useCallback(async () => {
    try {
      setErrMsg("");
      setLoading(true);

      const res = await fetch("http://localhost:4000/api/contacts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        logout();
        return;
      }

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error cargando contactos");

      setContacts(data.contacts || []);
    } catch (err) {
      setErrMsg(err.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  const deleteContact = useCallback(
    async (id) => {
      const ok = window.confirm("¿Eliminar este contacto?");
      if (!ok) return;

      try {
        const res = await fetch(`http://localhost:4000/api/contacts/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          logout();
          return;
        }

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Error eliminando");

        setContacts((prev) => prev.filter((c) => c._id !== id));
      } catch (err) {
        alert(err.message || "No se pudo eliminar");
      }
    },
    [token, logout]
  );

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    loadContacts();
  }, [token, navigate, loadContacts]);

  return (
    <div style={{ padding: "28px 30px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h1>Admin - Contactos</h1>
          <p>Listado de mensajes enviados desde el formulario.</p>
        </div>

        <button onClick={logout} style={{ height: 40 }}>
          Cerrar sesión
        </button>
      </div>

      <div style={{ margin: "14px 0" }}>
        <button onClick={loadContacts} disabled={loading}>
          {loading ? "Cargando..." : "Refrescar"}
        </button>
      </div>

      {errMsg && <p style={{ color: "crimson" }}>❌ {errMsg}</p>}

      {!loading && contacts.length === 0 && <p>No hay contactos aún.</p>}

      {contacts.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left" }}>
                <th style={{ padding: 10, borderBottom: "1px solid #ddd" }}>Nombre</th>
                <th style={{ padding: 10, borderBottom: "1px solid #ddd" }}>Correo</th>
                <th style={{ padding: 10, borderBottom: "1px solid #ddd" }}>Celular</th>
                <th style={{ padding: 10, borderBottom: "1px solid #ddd" }}>Mensaje</th>
                <th style={{ padding: 10, borderBottom: "1px solid #ddd" }}>Fecha</th>
                <th style={{ padding: 10, borderBottom: "1px solid #ddd" }}>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {contacts.map((c) => (
                <tr key={c._id}>
                  <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>{c.nombre}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>{c.correo}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>{c.celular || "-"}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid #eee", maxWidth: 360 }}>
                    {c.mensaje}
                  </td>
                  <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>
                    {c.createdAt ? new Date(c.createdAt).toLocaleString() : "-"}
                  </td>
                  <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>
                    <button onClick={() => deleteContact(c._id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
}
