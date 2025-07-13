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
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
      }}
    >
      <div
        className="card shadow-lg border-0"
        style={{ maxWidth: "420px", width: "100%", borderRadius: "20px" }}
      >
        <div
          className="card-body"
          style={{ backgroundColor: "#fdfbfb", borderRadius: "20px" }}
        >
          <h2 className="text-center mb-4 text-purple fw-bold">
            <i className="bi bi-person-plus-fill me-2 text-danger"></i>Sign Up
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">
                <i className="bi bi-envelope-fill me-2 text-info"></i>Email (must match an employee)
              </label>
              <input
                type="email"
                className="form-control rounded-pill"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your employee email"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="username" className="form-label fw-semibold">
                <i className="bi bi-person-circle me-2 text-primary"></i>Username
              </label>
              <input
                type="text"
                className="form-control rounded-pill"
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Choose a username"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-semibold">
                <i className="bi bi-lock-fill me-2 text-danger"></i>Password
              </label>
              <input
                type="password"
                className="form-control rounded-pill"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter a password"
                required
              />
            </div>

            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-success rounded-pill fw-bold">
                <i className="bi bi-person-check-fill me-2"></i>Create Account
              </button>
              <button
                type="button"
                onClick={onLoginClick}
                className="btn btn-outline-primary rounded-pill fw-semibold"
              >
                <i className="bi bi-arrow-left me-2"></i>Already have an account? Login
              </button>
            </div>
          </form>

          {message && (
            <div className="alert alert-warning mt-3 text-center small rounded-pill">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}






