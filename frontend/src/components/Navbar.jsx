import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 100,
          background: scrolled
            ? "rgba(255,255,255,0.97)"
            : "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid #e2e8f0",
          transition: "box-shadow 0.3s",
          boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            height: 66,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                background: "#1a3c5e",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 10L10 3L17 10V17H13V13H7V17H3V10Z" fill="white" />
              </svg>
            </div>
            <span
              style={{
                fontSize: 17,
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: "-0.4px",
              }}
            >
              Credit Vault{" "}
              <span style={{ fontWeight: 400, color: "#1a3c5e" }}>Bank</span>
            </span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <div style={{ display: "flex", gap: 24 }}>
              {[
                ["/#products", "Products"],
                ["/#security", "Security"],
                ["/#about", "About"],
              ].map(([href, label]) => (
                <a
                  key={label}
                  href={href}
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#374151",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#1a3c5e")}
                  onMouseLeave={(e) => (e.target.style.color = "#374151")}
                >
                  {label}
                </a>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {token ? (
                <Link
                  to="/dashboard"
                  style={{
                    padding: "8px 18px",
                    borderRadius: 7,
                    background: "#1a3c5e",
                    color: "white",
                    fontWeight: 600,
                    fontSize: 13,
                    textDecoration: "none",
                  }}
                >
                  My Account
                </Link>
              ) : (
                <>
                  <Link
                    to="/signin"
                    style={{
                      padding: "8px 16px",
                      borderRadius: 7,
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#374151",
                      textDecoration: "none",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    style={{
                      padding: "8px 18px",
                      borderRadius: 7,
                      background: "#1a3c5e",
                      color: "white",
                      fontWeight: 600,
                      fontSize: 13,
                      textDecoration: "none",
                    }}
                  >
                    Open Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
