import { type ReactElement, useEffect, useState } from "react";
import "./App.css";
import { FaLinkedin, FaEnvelope, FaGithub, FaReact, FaPython, FaDatabase, FaDownload, FaBars, FaTimes } from "react-icons/fa";
import { SiDjango, SiTypescript, SiMysql } from "react-icons/si";

interface Project {
  id: number;
  name: string;
  description: string;
  projectUrl: string;
  icon: string;
  technologies: string[];
}

interface Skill {
  id: number;
  name: string;
}

const SKILL_ICONS: Record<string, ReactElement> = {
  react: <FaReact />,
  typescript: <SiTypescript />,
  django: <SiDjango />,
  python: <FaPython />,
  mysql: <SiMysql />,
  sql: <FaDatabase />,
};

const DEFAULT_PROJECTS: Project[] = [
  {
    id: -1,
    name: "BOM Management System with Nexar API Integration",
    description:
      "Developed a Bill of Materials management system to track electronic component data, integrate Nexar API for real-time availability and specifications, and provide a dynamic React UI for BOM upload, component listing, and data visualization.",
    projectUrl: "",
    icon: "⚙️",
    technologies: ["React.js", "Django", "Python", "REST API", "Nexar API", "MySQL"],
  },
  {
    id: -2,
    name: "Employee Management System",
    description:
      "Built a scalable full-stack employee management system with JWT authentication, role-based access for Admin, HR, and Employee users, multi-step validated forms, leave approvals, attendance tracking, and working-hours calculation.",
    projectUrl: "",
    icon: "👥",
    technologies: ["React.js", "Django REST Framework", "JWT", "Role-Based Access", "MySQL"],
  },
  {
    id: -3,
    name: "Solar Energy Kiosk Management System",
    description:
      "Built a Dubai-based solar energy kiosk platform where admins can create solar plants, configure kiosk templates, upload slide content and branding, manage plant galleries, generate public kiosk URLs, and show dynamic energy dashboards with plant details, environmental impact, savings analytics, and generation charts.",
    projectUrl: "",
    icon: "☀️",
    technologies: ["React", "Ant Design", "Spring Boot", "REST APIs", "JWT", "ECharts", "File Upload"],
  },
];

function App() {
  const [typedText, setTypedText] = useState("");
  const roles = ["Software Developer", "React Enthusiast", "Full Stack Builder", "Python Backend Developer"];
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8081/api/projects")
      .then(r => r.json())
      .then((apiProjects: Project[]) => {
        const apiProjectNames = new Set(apiProjects.map(p => p.name.toLowerCase()));
        setProjects([
          ...apiProjects,
          ...DEFAULT_PROJECTS.filter(p => !apiProjectNames.has(p.name.toLowerCase())),
        ]);
      })
      .catch(() => {});
    fetch("http://localhost:8081/api/skills")
      .then(r => r.json())
      .then(setSkills)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const hero = document.querySelector(".hero") as HTMLElement | null;
    const handleMouseMove = (e: MouseEvent) => {
      if (!hero) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      hero.style.setProperty("--rotateY", `${x * 20}deg`);
      hero.style.setProperty("--translateZ", `${y * 120}px`);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Typing effect
  useEffect(() => {
    const current = roles[roleIndex];
    const speed = deleting ? 60 : 100;
    const timeout = setTimeout(() => {
      if (!deleting && charIndex < current.length) {
        setTypedText(current.slice(0, charIndex + 1));
        setCharIndex(c => c + 1);
      } else if (deleting && charIndex > 0) {
        setTypedText(current.slice(0, charIndex - 1));
        setCharIndex(c => c - 1);
      } else if (!deleting && charIndex === current.length) {
        setTimeout(() => setDeleting(true), 1500);
      } else if (deleting && charIndex === 0) {
        setDeleting(false);
        setRoleIndex(i => (i + 1) % roles.length);
      }
    }, speed);
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, roleIndex]);

  // Secret admin shortcut: Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        window.location.href = "/x9k2m";
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="container">
      <header className="top-navbar">
        <div className="nav-logo">JS</div>
        <button
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(open => !open)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <nav className={menuOpen ? "nav-open" : ""}>
          <ul>
            <li><a href="#home" onClick={() => setMenuOpen(false)}>Home</a></li>
            <li><a href="#about" onClick={() => setMenuOpen(false)}>About</a></li>
            <li><a href="#projects" onClick={() => setMenuOpen(false)}>Projects</a></li>
            <li><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a></li>
          </ul>
        </nav>
      </header>

      {/* HERO */}
      <section id="home" className="hero">
        <div className="hero-content">
          <p className="hero-greeting">👋 Hello, I'm</p>
          <h1>
            <span className="highlight">Jaid Sutar</span>
          </h1>
          <h3 className="typed-text">
            {typedText}<span className="cursor">|</span>
          </h3>
          <p className="hero-desc">
            Building modern, scalable web applications with clean code and great UX.
          </p>
          <div className="hero-btns">
            <a href="#projects" className="btn-primary">View My Work</a>
            <a href="#contact" className="btn-secondary">Hire Me</a>
            <a href="/JAID.pdf" download="Jaid_Sutar_Resume.pdf" className="btn-resume">
              <FaDownload /> Download CV
            </a>
          </div>
        </div>

        <div className="hero-portrait" aria-hidden="true" />

        <div className="navbar">
          <a href="https://www.linkedin.com/in/jaid-sutar-6b5601262/" className="icon-link" target="_blank" rel="noreferrer">
            <FaLinkedin />
          </a>
          <a href="mailto:sutarjaid970@gmail.com" className="icon-link">
            <FaEnvelope />
          </a>
          <a href="https://github.com/jaidsutar786" className="icon-link" target="_blank" rel="noreferrer">
            <FaGithub />
          </a>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="about-section">
        <div className="reveal">
          <h2>About <span className="highlight-section">Me</span></h2>
          <p className="about-desc">
            I'm a passionate software developer skilled in React, Django, Python, and SQL.
            I love creating efficient, user-friendly applications and continuously
            learning new technologies to solve real-world problems.
          </p>
          <div className="skills-grid">
            {skills.map(s => (
              <div key={s.id} className="skill-badge">
                {SKILL_ICONS[s.name.toLowerCase()] ?? <FaDatabase />} {s.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="projects-section">
        <div className="reveal">
          <h2 className="projects-title">My <span className="highlight-section">Projects</span></h2>
          <p className="projects-subtitle">
            Here are some of the projects I've built recently using React, Django, Python, and SQL.
          </p>
          <div className="projects-grid">
            {projects.length > 0 ? projects.map(p => (
              <div key={p.id} className="project-card">
                <div className="card-icon">{p.icon}</div>
                <h3>{p.name}</h3>
                <p>{p.description}</p>
                <div className="card-tags">
                  {p.technologies?.map(t => <span key={t}>{t}</span>)}
                </div>
                {p.projectUrl && <a href={p.projectUrl} target="_blank" rel="noreferrer" className="card-link">View Project →</a>}
              </div>
            )) : (
              <p className="no-projects-msg">No projects yet. Add some from the admin panel!</p>
            )}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact-section">
        <div className="reveal contact-wrapper">
          <div className="contact-left">
            <h2>Get In <span className="highlight-section">Touch</span></h2>
            <p className="contact-desc">
              Have a project in mind or just want to say hi? I'd love to hear from you. Let's build something amazing together.
            </p>
            <div className="contact-info-cards">
              <a href="mailto:sutarjaid970@gmail.com" className="info-card">
                <span className="info-icon"><FaEnvelope /></span>
                <div>
                  <p className="info-label">Email</p>
                  <p className="info-value">sutarjaid970@gmail.com</p>
                </div>
              </a>
              <a href="https://www.linkedin.com/in/jaid-sutar-6b5601262/" target="_blank" rel="noreferrer" className="info-card">
                <span className="info-icon"><FaLinkedin /></span>
                <div>
                  <p className="info-label">LinkedIn</p>
                  <p className="info-value">Connect with me</p>
                </div>
              </a>
              <a href="https://github.com/jaidsutar786" target="_blank" rel="noreferrer" className="info-card">
                <span className="info-icon"><FaGithub /></span>
                <div>
                  <p className="info-label">GitHub</p>
                  <p className="info-value">View my code</p>
                </div>
              </a>
            </div>
          </div>

          <div className="contact-right">
            <form className="contact-form" onSubmit={e => e.preventDefault()}>
              <div className="form-field">
                <input type="text" id="name" placeholder=" " required />
                <label htmlFor="name">Your Name</label>
              </div>
              <div className="form-field">
                <input type="email" id="email" placeholder=" " required />
                <label htmlFor="email">Your Email</label>
              </div>
              <div className="form-field">
                <input type="text" id="subject" placeholder=" " />
                <label htmlFor="subject">Subject</label>
              </div>
              <div className="form-field">
                <textarea id="message" placeholder=" " rows={5} required />
                <label htmlFor="message">Your Message</label>
              </div>
              <button type="submit" className="contact-submit-btn">
                <span>Send Message</span>
                <span className="btn-icon">🚀</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2025 Jaid Sutar · Built with React</p>
      </footer>
    </div>
  );
}

export default App;
