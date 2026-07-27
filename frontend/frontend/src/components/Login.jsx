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

            // ---> ADD THIS BLOCK TO SAVE THE TOKEN <---
            if (data.access_token) {
                localStorage.setItem("token", data.access_token);
            }

            // Redirect or handle post-login navigation to the dashboard
            window.location.href = "/dashboard"; 

        } catch (err) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };
};