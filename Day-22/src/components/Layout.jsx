import { useState } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" }
];

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container nav-wrap">
          <Link to="/" className="brand" onClick={() => setOpen(false)}>
            <span className="brand-mark">F</span>
            <span>Fuli Eliot</span>
          </Link>

          <nav className={open ? "main-nav open" : "main-nav"}>
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <Link className="nav-cta" to="/contact">Let's talk <ArrowUpRight size={16} /></Link>

          <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
            {open ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <Link to="/" className="brand footer-brand">
              <span className="brand-mark">F</span>
              <span>Fuli Eliot</span>
            </Link>
            <p>Student developer · Heritage Higher Institute of Peace and Development Studies.</p>
          </div>
          <div className="footer-links">
            <NavLink to="/about">About</NavLink>
            <NavLink to="/projects">Projects</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </div>
          <div className="footer-copy">© {new Date().getFullYear()} Fuli Eliot Nchongtakang</div>
        </div>
      </footer>
    </div>
  );
}
