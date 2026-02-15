import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      // ✅ evita el error "Unexpected token <"
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "El backend no devolvió JSON. Revisa que el backend esté en http://localhost:4000 y exista /api/auth/login."
        );
      }

      if (!res.ok) throw new Error(data.message || "Error");

      localStorage.setItem("token", data.token);
      navigate("/admin");
    } catch (err) {
      setError(err.message || "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px 30px", maxWidth: 420, margin: "0 auto" }}>
      <h2>Acceso Administrador</h2>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 14 }}>
        <input
          name="username"
          placeholder="Usuario"
          value={form.username}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={onChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        {error && <p style={{ color: "crimson" }}>{error}</p>}
      </form>
    </div>
  );
}
