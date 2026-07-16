import React, { useState, useEffect } from "react";
import "./Admin.css";

const API = "http://localhost:8081/api";

interface Project {
  id?: number;
  name: string;
  description: string;
  projectUrl: string;
  icon: string;
  technologies: string[];
}

type AuthView = "login" | "forgot" | "reset";

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem("admin_token") || "");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [authView, setAuthView] = useState<AuthView>("login");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<Project>({ name: "", description: "", projectUrl: "", icon: "🌐", technologies: [] });
  const [techInput, setTechInput] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (token) fetchProjects();
  }, [token]);

  const fetchProjects = async () => {
    const res = await fetch(`${API}/projects`);
    const data = await res.json();
    setProjects(data);
  };

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("admin_token", data.token);
      setToken(data.token);
      setShowPopup(false);
    } else {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3500);
    }
  };

  const sendForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError("");
    setForgotMsg("");
    try {
      const res = await fetch(`${API}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setForgotMsg("✅ Reset link sent! Check your email inbox.");
      } else {
        setForgotError(data.error || "Something went wrong. Try again.");
      }
    } catch {
      setForgotError("Could not connect to server.");
    }
    setForgotLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setToken("");
  };

  const addTech = () => {
    if (techInput.trim() && !form.technologies.includes(techInput.trim())) {
      setForm({ ...form, technologies: [...form.technologies, techInput.trim()] });
      setTechInput("");
    }
  };

  const removeTech = (tech: string) => {
    setForm({ ...form, technologies: form.technologies.filter(t => t !== tech) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API}/projects/${editId}` : `${API}/projects`;
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    setMessage(editId ? "Project updated!" : "Project added!");
    setForm({ name: "", description: "", projectUrl: "", icon: "🌐", technologies: [] });
    setEditId(null);
    fetchProjects();
    setTimeout(() => setMessage(""), 3000);
  };

  const handleEdit = (p: Project) => {
    setForm(p);
    setEditId(p.id!);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this project?")) return;
    await fetch(`${API}/projects/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setMessage("Project deleted!");
    fetchProjects();
    setTimeout(() => setMessage(""), 3000);
  };

  if (!token) {
    return (
      <div className="admin-login">
        {showPopup && (
          <div className="login-popup">
            <span className="popup-icon">🚫</span>
            <div>
              <p className="popup-title">Access Denied</p>
              <p className="popup-msg">Invalid username or password</p>
            </div>
            <button className="popup-close" onClick={() => setShowPopup(false)}>×</button>
          </div>
        )}
        <div className="login-card">

          {/* LOGIN VIEW */}
          {authView === "login" && (
            <>
              <div className="login-logo">⚙️</div>
              <h2>Admin <span className="admin-highlight">Login</span></h2>
              <p className="login-sub">Portfolio Management Panel</p>
              <form onSubmit={login}>
                <div className="input-group">
                  <span className="input-icon">👤</span>
                  <input type="text" placeholder="Username" value={username}
                    onChange={e => setUsername(e.target.value)} required />
                </div>
                <div className="input-group">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password" value={password}
                    onChange={e => setPassword(e.target.value)} required />
                  <button type="button" className="eye-btn"
                    onClick={() => setShowPassword(s => !s)}>
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                <button type="submit" className="login-btn">Login →</button>
              </form>
              <button className="forgot-link" onClick={() => { setAuthView("forgot"); setForgotMsg(""); setForgotError(""); }}>
                Forgot Password?
              </button>
            </>
          )}

          {/* FORGOT PASSWORD VIEW */}
          {authView === "forgot" && (
            <>
              <div className="login-logo">📧</div>
              <h2>Reset <span className="admin-highlight">Password</span></h2>
              <p className="login-sub">Enter your admin email to receive a reset link.</p>
              <form onSubmit={sendForgotPassword}>
                <div className="input-group">
                  <span className="input-icon">📧</span>
                  <input type="email" placeholder="Admin Email" value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)} required />
                </div>
                {forgotError && <p className="error">⚠️ {forgotError}</p>}
                {forgotMsg  && <p className="success">{forgotMsg}</p>}
                <button type="submit" className="login-btn" disabled={forgotLoading}>
                  {forgotLoading ? "Sending..." : "Send Reset Link →"}
                </button>
              </form>
              <button className="forgot-link" onClick={() => setAuthView("login")}>
                ← Back to Login
              </button>
            </>
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h2>⚙️ Portfolio <span className="admin-highlight">Admin</span></h2>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </header>

      {message && <div className="toast">{message}</div>}

      <div className="admin-content">
        <div className="admin-form-card">
          <h3>{editId ? "✏️ Edit Project" : "➕ Add New Project"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input type="text" placeholder="Project Name" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
              <input type="text" placeholder="Icon (emoji)" value={form.icon}
                onChange={e => setForm({ ...form, icon: e.target.value })} />
            </div>
            <textarea placeholder="Description" rows={3} value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} required />
            <input type="url" placeholder="Project URL (optional)" value={form.projectUrl}
              onChange={e => setForm({ ...form, projectUrl: e.target.value })} />
            <div className="tech-input-row">
              <input type="text" placeholder="Add technology (e.g. React)" value={techInput}
                onChange={e => setTechInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTech())} />
              <button type="button" onClick={addTech}>Add</button>
            </div>
            <div className="tech-tags">
              {form.technologies.map(t => (
                <span key={t} className="tech-tag">
                  {t} <button type="button" onClick={() => removeTech(t)}>×</button>
                </span>
              ))}
            </div>
            <div className="form-actions">
              <button type="submit" className="save-btn">{editId ? "Update Project" : "Save Project"}</button>
              {editId && <button type="button" className="cancel-btn"
                onClick={() => { setEditId(null); setForm({ name: "", description: "", projectUrl: "", icon: "🌐", technologies: [] }); }}>
                Cancel
              </button>}
            </div>
          </form>
        </div>

        <div className="admin-projects">
          <h3>📁 All Projects ({projects.length})</h3>
          {projects.length === 0 && <p className="no-projects">No projects yet. Add one!</p>}
          {projects.map(p => (
            <div key={p.id} className="admin-project-card">
              <div className="project-info">
                <span className="project-icon">{p.icon}</span>
                <div>
                  <h4>{p.name}</h4>
                  <p>{p.description}</p>
                  <div className="tech-tags">
                    {p.technologies?.map(t => <span key={t} className="tech-tag">{t}</span>)}
                  </div>
                </div>
              </div>
              <div className="project-actions">
                <button className="edit-btn" onClick={() => handleEdit(p)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(p.id!)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
