import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:4000/api";

export default function ProtectedRoute({ children }) {
  const [ok, setOk] = useState(null); // null = cargando

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setOk(false);
      return;
    }

    fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => setOk(r.ok)) // true si 2xx, false si 401/500/etc.
      .catch(() => setOk(false));
  }, []);

  if (ok === null) return <div style={{ padding: 30 }}>Verificando...</div>;
  if (!ok) return <Navigate to="/login" replace />;
  return children;
}