'use client';
import { useState } from "react";
import { useRouter } from 'next/navigation';
import styles from "../authCss/Auth.module.css";
import Nav from "../components/Header/Page";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        // Save minimal user info
        sessionStorage.setItem("user", JSON.stringify({ name: data.user.name, role: data.role }));

        // Redirect based on role
        if (data.role === "ADMIN") router.push("/admin");
        else router.push("/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <div className={styles.container}>
      <Nav />
      <div className={styles.card}>
        <h2>Login</h2>
        {error && <p className={styles.error}>{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button onClick={handleSubmit}>Login</button>
        <div className={styles.link}>
          Don't have an account? <a href="/register">Register</a>
        </div>
      </div>
    </div>
  );
}
