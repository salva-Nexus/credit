import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Send, CheckCircle } from "lucide-react";

const Footer = () => {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleContact = (e) => {
    e.preventDefault();
    const { name, email, message } = contactForm;
    // Opens default mail client with the form data pre-filled
    const subject = encodeURIComponent(
      `Credit Vault Support — Message from ${name}`,
    );
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    );
    window.location.href = `mailto:creditvault.support@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setContactForm({ name: "", email: "", message: "" });
    }, 4000);
  };

  const inp = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 7,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    color: "white",
    fontSize: 13,
    outline: "none",
    fontFamily: "Inter, sans-serif",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  return (
    <footer
      style={{
        background: "#0f172a",
        color: "#94a3b8",
        paddingTop: 64,
        paddingBottom: 40,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
        {/* Main grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 40,
            marginBottom: 56,
          }}
        >
          {/* Brand */}
          <div>
            <Link
              to="/"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #1a3c5e, #0f2847)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="5"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                  <circle cx="12" cy="12" r="2" fill="white" />
                  <line
                    x1="12"
                    y1="3"
                    x2="12"
                    y2="7"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="21"
                    y1="12"
                    x2="17"
                    y2="12"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="12"
                    y1="21"
                    x2="12"
                    y2="17"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="3"
                    y1="12"
                    x2="7"
                    y2="12"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div>
                <span style={{ fontSize: 15, fontWeight: 900, color: "white" }}>
                  Credit
                </span>
                <span
                  style={{ fontSize: 15, fontWeight: 900, color: "#4a9eff" }}
                >
                  Vault
                </span>
              </div>
            </Link>
            <p
              style={{
                fontSize: 13,
                lineHeight: 1.7,
                color: "#64748b",
                maxWidth: 200,
                margin: "0 0 14px",
              }}
            >
              Secure, modern banking for everyone. FDIC insured up to $250,000.
            </p>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
              {["FDIC", "Equal Housing", "SSL"].map((b) => (
                <span
                  key={b}
                  style={{
                    fontSize: 10,
                    padding: "3px 8px",
                    borderRadius: 4,
                    background: "rgba(255,255,255,0.05)",
                    color: "#64748b",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#475569",
                margin: "0 0 16px",
              }}
            >
              Products
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["/signup", "Checking Account"],
                ["/signup", "Savings Account"],
                ["/dashboard/transfer", "Wire Transfers"],
                ["/dashboard/transfer", "International Banking"],
                ["/dashboard", "Mobile Banking"],
              ].map(([path, label]) => (
                <Link
                  key={label}
                  to={path}
                  style={{
                    fontSize: 13,
                    color: "#64748b",
                    textDecoration: "none",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#94a3b8")}
                  onMouseLeave={(e) => (e.target.style.color = "#64748b")}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#475569",
                margin: "0 0 16px",
              }}
            >
              Company
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["/", "Home"],
                ["/about", "About Us"],
                ["/faq", "FAQ"],
                ["/signin", "Sign In"],
                ["/signup", "Open Account"],
                ["/forgot-password", "Reset Password"],
              ].map(([path, label]) => (
                <Link
                  key={label}
                  to={path}
                  style={{
                    fontSize: 13,
                    color: "#64748b",
                    textDecoration: "none",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#94a3b8")}
                  onMouseLeave={(e) => (e.target.style.color = "#64748b")}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <div style={{ gridColumn: "span 1" }}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#475569",
                margin: "0 0 16px",
              }}
            >
              Contact Support
            </p>
            {sent ? (
              <div
                style={{
                  padding: "16px",
                  borderRadius: 9,
                  background: "rgba(34,197,94,0.1)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <CheckCircle size={16} color="#22c55e" />
                <p style={{ margin: 0, fontSize: 13, color: "#86efac" }}>
                  Opening your email client…
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleContact}
                style={{ display: "flex", flexDirection: "column", gap: 9 }}
              >
                <input
                  required
                  placeholder="Your name"
                  value={contactForm.name}
                  onChange={(e) =>
                    setContactForm((f) => ({ ...f, name: e.target.value }))
                  }
                  style={inp}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(74,158,255,0.5)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                  }
                />
                <input
                  required
                  type="email"
                  placeholder="Your email"
                  value={contactForm.email}
                  onChange={(e) =>
                    setContactForm((f) => ({ ...f, email: e.target.value }))
                  }
                  style={inp}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(74,158,255,0.5)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                  }
                />
                <textarea
                  required
                  placeholder="How can we help?"
                  rows={3}
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm((f) => ({ ...f, message: e.target.value }))
                  }
                  style={{ ...inp, resize: "none", lineHeight: 1.5 }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(74,158,255,0.5)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                  }
                />
                <button
                  type="submit"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 7,
                    padding: "10px",
                    borderRadius: 8,
                    background: "#1a3c5e",
                    color: "white",
                    fontWeight: 600,
                    fontSize: 13,
                    border: "1px solid rgba(74,158,255,0.3)",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#0f2847")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#1a3c5e")
                  }
                >
                  <Send size={13} /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            paddingTop: 24,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <p style={{ margin: 0, fontSize: 12, color: "#475569" }}>
            © 2025 Credit Vault, N.A. All rights reserved. Member FDIC. Equal
            Housing Lender.
          </p>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (item) => (
                <span
                  key={item}
                  style={{
                    fontSize: 12,
                    color: "#475569",
                    cursor: "pointer",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#94a3b8")}
                  onMouseLeave={(e) => (e.target.style.color = "#475569")}
                >
                  {item}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;