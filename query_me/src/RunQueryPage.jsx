import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./RunQueryPage.css";

export default function RunQueryPage({ user, onLogout }) {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDownloadToast, setShowDownloadToast] = useState(false);
  const [history, setHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:5000/run_query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Error");

      setResult(data);
      setHistory((h) => [{ question, timestamp: new Date() }, ...h]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // CSV download with timestamped filename
  const downloadCSV = () => {
    if (!result || !result.result.length) return;

    const rows = result.result;
    const headers = Object.keys(rows[0]);

    const csvContent =
      headers.join(",") +
      "\n" +
      rows
        .map((row) =>
          headers
            .map((fieldName) => {
              const escaped = ("" + row[fieldName]).replace(/"/g, '""');
              return `"${escaped}"`;
            })
            .join(",")
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const now = new Date();
    const pad = (n) => n.toString().padStart(2, "0");
    const timestamp = `${now.getFullYear()}-${pad(
      now.getMonth() + 1
    )}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(
      now.getMinutes()
    )}-${pad(now.getSeconds())}`;

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `query_result_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Show toast notification
    setShowDownloadToast(true);
  };

  // Hide toast automatically after 3 seconds
  useEffect(() => {
    if (showDownloadToast) {
      const timer = setTimeout(() => setShowDownloadToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showDownloadToast]);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Welcome, {user?.firstName || "User"}!</h2>
        <button className="btn btn-outline-danger" onClick={onLogout}>
          <i className="bi bi-box-arrow-right me-1"></i>Logout
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mb-4 row g-2">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Enter your question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <button type="submit" className="btn btn-primary w-100">
            Submit
          </button>
        </div>
      </form>

      {history.length > 0 && (
        <div className="mb-4">
          <h5>Query History</h5>
          <ul className="list-group">
            {history.map(({ question: q, timestamp }, i) => (
              <li
                key={i}
                className="list-group-item list-group-item-action"
                onClick={() => setQuestion(q)}
                style={{ cursor: "pointer" }}
                title={`Asked on ${timestamp.toLocaleString()}`}
              >
                {q}
              </li>
            ))}
          </ul>
        </div>
      )}

      {loading && (
        <div className="alert alert-info" role="alert">
          🔄 Processing...
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          ❌ {error}
        </div>
      )}

      {result && (
        <div>
          <p>
            <strong>Generated SQL:</strong>{" "}
            <code>{result.sql}</code>{" "}
            <button
              className="btn btn-outline-secondary btn-sm ms-2"
              onClick={() => navigator.clipboard.writeText(result.sql)}
              title="Copy SQL to clipboard"
            >
              📋 Copy
            </button>
          </p>
          <div className="table-responsive">
            <table className="table table-striped table-bordered mt-3">
              <thead className="table-dark">
                <tr>
                  {result.result.length > 0 &&
                    Object.keys(result.result[0]).map((col) => (
                      <th key={col}>{col}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {result.result.map((row, idx) => (
                  <tr key={idx}>
                    {Object.values(row).map((val, i) => (
                      <td key={i}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            className="btn btn-success mt-3"
            onClick={downloadCSV}
            type="button"
          >
            Download CSV
          </button>
        </div>
      )}

      {/* Download Toast Notification */}
      {showDownloadToast && (
        <div
          className="toast show position-fixed bottom-0 end-0 m-3 bg-success text-white"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          style={{ zIndex: 1055 }}
        >
          <div className="d-flex">
            <div className="toast-body">✅ CSV downloaded successfully!</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => setShowDownloadToast(false)}
              aria-label="Close"
            ></button>
          </div>
        </div>
      )}
    </div>
  );
}







