// lib/client-auth.js - Client-side only utilities
"use client";

// Get token from localStorage
export function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

// Set token in localStorage
export function setToken(token) {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
}

// Remove token from localStorage
export function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}

// Check if user is admin (client-side only)
export function isAdmin() {
  const token = getToken();
  if (!token) return false;
  
  try {
    // Decode JWT token without verification (client-side safe)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role === "ADMIN";
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
}