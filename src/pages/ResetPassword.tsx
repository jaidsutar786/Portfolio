import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./Admin.css";

const API = "http://localhost:8080/api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  const [valid, setValid] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) { setValid(false); return; }
    fetch(`${API}/auth/validate-reset-token?token=${token}`)
      .then(r => r.json())
      .then(d => setValid(d.valid))
      .catch(() => setValid(false));
  }, [token]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 6)  { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    setError("");
    const res = await fetch(`${API}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage("✅ Password reset! Redirecting to login...");
      setTimeout(() => navigate("/x9k2m"), 2500);
    } else {
      setError(data.error || "Something went wrong.");
    }
  };

  return (
    <div className="admin-login">
      <div className="login-card">
        <div className="login-logo">🔐</div>

        {valid === null && <p className="login-sub">Validating link...</p>}

        {valid === false && (
          <>
            <h2>Link <span className="admin-highlight">Expired</span></h2>
            <p className="login-sub">This reset link is invalid or has expired.</p>
            <button className="login-btn" onClick={() => navigate("/x9k2m")}>Back to Login</button>
          </>
        )}

        {valid === true && !message && (
          <>
            <h2>New <span className="admin-highlight">Password</span></h2>
            <p className="login-sub">Enter your new admin password below.</p>
            <form onSubmit={handleReset}>
              <div className="input-group">
                <span className="input-icon">🔒</span>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="New Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="eye-btn" onClick={() => setShowPass(s => !s)}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
              <div className="input-group">
                <span className="input-icon">🔒</span>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                />
              </div>
              {error   && <p className="error">⚠️ {error}</p>}
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password →"}
              </button>
            </form>
          </>
        )}

        {message && <p className="success">{message}</p>}
      </div>
    </div>
  );
}
