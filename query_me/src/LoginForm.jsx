import React, { useState } from "react";

export default function LoginForm({ onSignupClick, onLoginSuccess }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Logging in...");

    try {
      const res = await fetch("http://127.0.0.1:5000/api/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ Welcome, ${data.firstName} ${data.lastName}!`);
        onLoginSuccess(data);  // 🔥 Notify parent (App.js) of successful login
      } else {
        setMessage(`❌ ${data.message || "Login failed"}`);
      }
    } catch (err) {
      setMessage("❌ Failed to connect to the server.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#ffefd5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "320px",
          padding: "25px 30px",
          backgroundColor: "#00796b",
          borderRadius: "12px",
          boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
          color: "white",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "24px", fontWeight: "700" }}>
          Query Me Login
        </h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username" style={labelStyle}>Username</label>
          <input
            type="text"
            name="username"
            id="username"
            value={form.username}
            onChange={handleChange}
            required
            placeholder="Enter your username"
            style={inputStyle}
          />

          <label htmlFor="password" style={labelStyle}>Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
            style={inputStyle}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button type="submit" style={submitButtonStyle}>Login</button>
            <button type="button" onClick={onSignupClick} style={switchButtonStyle}>
              Don&apos;t have an account? Sign Up
            </button>
          </div>
        </form>

        {message && (
          <p style={{ marginTop: "16px", fontSize: "14px", color: "#ffe082" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

// === Styles ===
const inputStyle = {
  width: "100%",
  padding: "10px 15px",
  marginBottom: "20px",
  borderRadius: "25px",
  border: "none",
  outline: "none",
  fontSize: "16px",
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  textAlign: "left",
};

const submitButtonStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#004d40",
  color: "white",
  fontWeight: "700",
  fontSize: "16px",
  borderRadius: "25px",
  border: "none",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
};

const switchButtonStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#ffffff",
  color: "#004d40",
  fontWeight: "700",
  fontSize: "16px",
  borderRadius: "25px",
  border: "2px solid #004d40",
  cursor: "pointer",
  transition: "all 0.3s ease",
};





