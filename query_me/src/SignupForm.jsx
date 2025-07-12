import React, { useState } from "react";

export default function SignupForm({ onLoginClick }) {
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Creating account...");

    try {
      const res = await fetch("http://127.0.0.1:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Account created successfully!");
        setForm({ email: "", username: "", password: "" });
      } else {
        setMessage(`❌ ${data.error || "Signup failed"}`);
      }
    } catch (err) {
      setMessage("❌ Failed to connect to server.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fff0f5",
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
          backgroundColor: "#6a1b9a",
          borderRadius: "12px",
          boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
          color: "white",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "24px", fontWeight: "700" }}>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email" style={labelStyle}>
            Email (must match an employee)
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Enter your employee email"
            style={inputStyle}
          />

          <label htmlFor="username" style={labelStyle}>
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={form.username}
            onChange={handleChange}
            required
            placeholder="Choose a username"
            style={inputStyle}
          />

          <label htmlFor="password" style={labelStyle}>
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Enter a password"
            style={inputStyle}
          />

          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button type="submit" style={submitButtonStyle}>
              Create Account
            </button>
            <button
              type="button"
              onClick={onLoginClick}
              style={switchButtonStyle}
            >
              Already have an account? Login
            </button>
          </div>
        </form>

        {message && (
          <p
            style={{ marginTop: "16px", fontSize: "14px", color: "#ffe082" }}
          >
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
  backgroundColor: "#4a0072",
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
  color: "#4a0072",
  fontWeight: "700",
  fontSize: "16px",
  borderRadius: "25px",
  border: "2px solid #4a0072",
  cursor: "pointer",
  transition: "all 0.3s ease",
};





