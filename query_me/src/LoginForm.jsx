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
        onLoginSuccess(data);
      } else {
        setMessage(`❌ ${data.message || "Login failed"}`);
      }
    } catch (err) {
      setMessage("❌ Failed to connect to the server.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(to right, #4e54c8, #8f94fb)",
      }}
    >
      <div
        className="card shadow-lg border-0"
        style={{ maxWidth: "420px", width: "100%", borderRadius: "20px" }}
      >
        <div
          className="card-body"
          style={{
            backgroundColor: "#f8f9fa",
            borderRadius: "20px",
          }}
        >
          <h2 className="text-center mb-4 text-primary fw-bold">
            <i className="bi bi-database-fill-check me-2"></i>Query Me Login
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label fw-semibold text-dark">
                <i className="bi bi-person-circle me-2 text-primary"></i>Username
              </label>
              <input
                type="text"
                className="form-control rounded-pill"
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-semibold text-dark">
                <i className="bi bi-lock-fill me-2 text-danger"></i>Password
              </label>
              <input
                type="password"
                className="form-control rounded-pill"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-success rounded-pill fw-bold">
                <i className="bi bi-box-arrow-in-right me-2"></i>Login
              </button>
              <button
                type="button"
                className="btn btn-outline-info rounded-pill fw-semibold"
                onClick={onSignupClick}
              >
                <i className="bi bi-person-plus-fill me-2"></i>Sign Up
              </button>
            </div>
          </form>

          {message && (
            <div className="alert alert-warning mt-3 py-2 text-center small rounded-pill">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}







