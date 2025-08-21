'use client';

import { useState } from "react";
import { useRouter } from 'next/navigation';
import styles from "../authCss/Auth.module.css";
import Nav from "../components/Header/Page";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      if (!data.token) {
        setError("Login failed: token not received");
        return;
      }

      // Save user info in session storage
      sessionStorage.setItem("user", JSON.stringify({ 
        name: data.user.name, 
        role: data.role 
      }));

      // Save token in localStorage for API calls
      localStorage.setItem("lms_token", data.token);

      // Redirect based on role
      if (data.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } else {
      setError(data.error || "Login failed");
    }
  } catch (err) {
    setError("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={styles.container}>
      <Nav />
      
      <div className={styles.card}>
        <h2>Login to Your Account</h2>
        
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="text"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              disabled={loading}
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              disabled={loading}
              className={styles.input}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.signupText}>
            Don't have an account?{" "}
            <a href="/register" className={styles.signupLink}>
              Create one here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}