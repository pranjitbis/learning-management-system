"use client";
import { useState } from "react";
import styles from "../authCss/Auth.module.css";
import Nav from "../components/Header/Page";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess]  = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    if (response.ok) {
      setSuccess(data.message); // Use the message from the API response
      window.location.assign("/login");
    } else {
      setError(data.error || "Registration failed");
    }
  };

  return (
    <div>
      <Nav />
      <div className={styles.container}>
        <div className={styles.card}>
          <h2>Register</h2>
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
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
          <button onClick={handleSubmit}>Register</button>
          <div className={styles.link}>
            Already have an account? <a href="/login">Login</a>
          </div>
        </div>
      </div>
    </div>
  );
}
