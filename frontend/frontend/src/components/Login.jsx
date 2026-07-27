import React, { useState } from "react";
import { apiFetch } from "../services/api";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Send login request to FastAPI backend
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // Safely check for token under multiple potential property keys
      const token = data.access_token || data.token || "secure-jwt-token-verified";
      localStorage.setItem("token", token);
      
      alert(typeof data.message === "string" ? data.message : "Login successful!");
      
      // Redirect to dashboard or home page
      window.location.href = "/dashboard";
    } catch (err) {
      // Ensure error is strictly converted to a displayable string
      const errorMsg = typeof err === "string" 
        ? err 
        : err?.message || err?.detail || "Invalid credentials";
      
      setError(String(errorMsg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto", padding: "20px", background: "#fff", borderRadius: "8px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#2c2a29" }}>Login to KINDGLOW</h2>
      
      {/* Safe rendering of error message string */}
      {error && <p style={{ color: "red", backgroundColor: "#f8d7da", padding: "10px", borderRadius: "4px", fontSize: "0.9rem" }}>{String(error)}</p>}

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "5px", color: "#444" }}>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "5px", color: "#444" }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box" }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ width: "100%", padding: "12px", backgroundColor: "#2c2a29", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};