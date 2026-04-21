import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const Logo = () => (
    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 34, height: 34, borderRadius: 8, background: 'linear-gradient(135deg, #1a3c5e, #0f2847)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5"/>
          <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="1.5"/>
          <circle cx="12" cy="12" r="2" fill="white"/>
          <line x1="12" y1="3" x2="12" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="21" y1="12" x2="17" y2="12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="12" y1="21" x2="12" y2="17" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="3" y1="12" x2="7" y2="12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <span style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.4px', whiteSpace: 'nowrap' }}>
        Credit<span style={{ color: '#1a3c5e' }}>Vault</span>
      </span>
    </Link>
  );

  const navLinks = [
    ['/#products', 'Products'],
    ['/#security', 'Security'],
    ['/#about', 'About'],
    ['/faq', 'FAQ'],
  ];

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none',
        transition: 'box-shadow 0.3s',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo />

          {/* Desktop links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }} className="nav-desktop">
            {navLinks.map(([href, label]) => (
              <Link key={label} to={href}
                style={{ fontSize: 14, fontWeight: 500, color: '#374151', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => e.target.style.color = '#1a3c5e'}
                onMouseLeave={e => e.target.style.color = '#374151'}>
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="nav-desktop">
            {token ? (
              <Link to="/dashboard" style={{ padding: '8px 18px', borderRadius: 8, background: '#1a3c5e', color: 'white', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
                My Account
              </Link>
            ) : (
              <>
                <Link to="/signin" style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#374151', textDecoration: 'none', border: '1.5px solid #e2e8f0', background: 'white' }}>
                  Sign In
                </Link>
                <Link to="/signup" style={{ padding: '8px 18px', borderRadius: 8, background: '#1a3c5e', color: 'white', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
                  Open Account
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="nav-mobile"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: '#374151', display: 'none', alignItems: 'center', justifyContent: 'center' }}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 98, backdropFilter: 'blur(2px)' }}
            />
            {/* Drawer */}
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              style={{ position: 'fixed', top: 64, left: 0, right: 0, zIndex: 99, background: 'white', borderBottom: '1px solid #e2e8f0', boxShadow: '0 8px 30px rgba(0,0,0,0.1)', padding: '12px 20px 24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {navLinks.map(([href, label]) => (
                  <Link key={label} to={href} onClick={() => setMenuOpen(false)}
                    style={{ padding: '13px 4px', fontSize: 15, fontWeight: 500, color: '#0f172a', textDecoration: 'none', borderBottom: '1px solid #f1f5f9' }}>
                    {label}
                  </Link>
                ))}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
                  {token ? (
                    <Link to="/dashboard" onClick={() => setMenuOpen(false)}
                      style={{ textAlign: 'center', padding: '13px', borderRadius: 9, background: '#1a3c5e', color: 'white', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
                      My Account
                    </Link>
                  ) : (
                    <>
                      <Link to="/signin" onClick={() => setMenuOpen(false)}
                        style={{ textAlign: 'center', padding: '13px', borderRadius: 9, border: '1.5px solid #e2e8f0', color: '#374151', fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
                        Sign In
                      </Link>
                      <Link to="/signup" onClick={() => setMenuOpen(false)}
                        style={{ textAlign: 'center', padding: '13px', borderRadius: 9, background: '#1a3c5e', color: 'white', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
                        Open Account — It's Free
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;