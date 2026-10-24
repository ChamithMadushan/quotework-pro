import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/create', label: 'Create Quotation' },
  { to: '/guides', label: 'Guides' },
  { to: '/how-it-works', label: 'How it Works' },
  { to: '/about', label: 'About' },
];

export function Layout() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">Skip to content</a>

      <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
        <div className="container">
          <div className="header-inner">
            <NavLink to="/" className="brand" aria-label="QuoteWork Pro home">
              <span className="brand-mark" aria-hidden="true">Q</span>
              <div>
                <div className="brand-name">QuoteWork Pro</div>
              </div>
            </NavLink>

            <nav className="nav" aria-label="Primary navigation">
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} end={link.to === '/'}>
                  {link.label}
                </NavLink>
              ))}
              <Link to="/create" className="btn btn-accent btn-sm">
                ✦ Start Free
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main id="main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="brand-mark" aria-hidden="true" style={{ width: 30, height: 30, fontSize: '0.9rem' }}>Q</span>
                <span>QuoteWork Pro</span>
              </div>
              <p className="footer-desc">
                A free, privacy-first quotation generator built for Sri Lankan SMEs,
                freelancers, and suppliers. No account needed — your data stays in your browser.
              </p>
            </div>
            <div className="footer-links-col">
              <h4>Product & Resources</h4>
              <ul>
                <li><Link to="/create">Create Quotation</Link></li>
                <li><Link to="/guides">Quotation Guides</Link></li>
                <li><Link to="/guides/quotation-format-sri-lanka">Sri Lanka Quotation Format</Link></li>
                <li><Link to="/how-it-works">How it Works</Link></li>
                <li><Link to="/about">About</Link></li>
              </ul>
            </div>
            <div className="footer-links-col">
              <h4>Legal</h4>
              <ul>
                <li><Link to="/privacy">Privacy Policy</Link></li>
              </ul>
              <div style={{ marginTop: 16, fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                QuoteWork Pro is a free worksheet tool. It does not provide legal, tax, or accounting advice.
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} QuoteWork Pro · Built for Sri Lanka 🇱🇰</span>
            <span>Drafts are saved locally in your browser · No data sent to servers</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
