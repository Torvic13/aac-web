import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

// 👇 base de la API: prod -> Render, dev -> localhost
const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://aac-back.onrender.com/api"
    : "http://localhost:4000/api";

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

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // 👈 AHORA COINCIDE CON TU auth.routes.js
          username: form.username,
          password: form.password,
        }),
      });

      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await res.json()
        : { message: "Respuesta inválida del servidor (no es JSON)." };

      if (!res.ok) {
        throw new Error(data.message || "No se pudo iniciar sesión");
      }

      // guarda token y pasa a admin
      localStorage.setItem("token", data.token);
      navigate("/admin");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.bg} />

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.avatar} aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 21a8 8 0 0 0-16 0"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M12 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h2 className={styles.title}>Bienvenido</h2>
          <p className={styles.subtitle}>
            Ingresa tus credenciales para continuar.
          </p>

          <form onSubmit={onSubmit} className={styles.form}>
            <label className={styles.label}>
              Usuario
              <input
                className={styles.input}
                name="username"
                placeholder="Usuario"
                value={form.username}
                onChange={onChange}
                autoComplete="username"
              />
            </label>

            <label className={styles.label}>
              Contraseña
              <input
                className={styles.input}
                name="password"
                type="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={onChange}
                autoComplete="current-password"
              />
            </label>

            <button className={styles.button} type="submit" disabled={loading}>
              {loading ? "Ingresando..." : "Ingresar"}
            </button>

            {error && <p className={styles.error}>{error}</p>}
          </form>
        </div>
      </main>
    </div>
  );
}