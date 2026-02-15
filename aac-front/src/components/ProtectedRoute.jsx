import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const [ok, setOk] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setOk(false);

    fetch("http://localhost:4000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => setOk(r.ok))
      .catch(() => setOk(false));
  }, []);

  if (ok === null) return <div style={{ padding: 30 }}>Verificando...</div>;
  if (!ok) return <Navigate to="/login" replace />;
  return children;
}
