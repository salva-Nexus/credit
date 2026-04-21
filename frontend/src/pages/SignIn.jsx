import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Shield } from "lucide-react";
import API from "../api";

const inp = (focused) => ({
  width: "100%",
  padding: "12px 14px",
  borderRadius: 8,
  fontSize: 14,
  background: "#f8fafc",
  border: `1.5px solid ${focused ? "#1a3c5e" : "#e2e8f0"}`,
  color: "#0f172a",
  outline: "none",
  transition: "border-color 0.2s",
  fontFamily: "Inter, sans-serif",
  boxSizing: "border-box",
});

export default function SignIn({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [focused, setFocused] = useState({});
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);
  // Verification flow for unverified accounts
  const [needsVerify, setNeedsVerify] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", msg: "" });
    try {
      const res = await API.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      await onLogin?.();
      navigate("/dashboard");
    } catch (err) {
      const d = err.response?.data;
      if (d?.needsVerification) {
        setNeedsVerify(true);
        setVerifyEmail(d.email || email);
        setStatus({ type: "error", msg: d.msg });
      } else {
        setStatus({
          type: "error",
          msg: d?.msg || "Invalid email or password.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpLoading(true);
    setStatus({ type: "", msg: "" });
    try {
      await API.post("/api/auth/verify-otp", { email: verifyEmail, otp });
      setStatus({ type: "success", msg: "Account verified! Signing you in…" });
      // Now log them in
      const res = await API.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      await onLogin?.();
      navigate("/dashboard");
    } catch (err) {
      setStatus({
        type: "error",
        msg: err.response?.data?.msg || "Invalid code.",
      });
    } finally {
      setOtpLoading(false);
    }
  };

  const StatusBox = () =>
    status.msg ? (
      <div
        style={{
          padding: "11px 14px",
          borderRadius: 8,
          marginBottom: 18,
          fontSize: 13,
          fontWeight: 500,
          background: status.type === "success" ? "#f0fdf4" : "#fef2f2",
          border: `1px solid ${status.type === "success" ? "#bbf7d0" : "#fecaca"}`,
          color: status.type === "success" ? "#15803d" : "#dc2626",
        }}
      >
        {status.msg}
      </div>
    ) : null;

  const stats = [
    { v: "$2.4T+", l: "Assets Under Management" },
    { v: "99.99%", l: "Platform Uptime" },
    { v: "4.8M+", l: "Active Customers" },
    { v: "50+", l: "Countries Supported" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#f8fafc" }}>
      {/* Left panel */}
      <div
        style={{
          width: "44%",
          background: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 52px",
          borderRight: "1px solid #e2e8f0",
          position: "relative",
          overflow: "hidden",
        }}
        className="auth-left"
      >
        <div
          style={{
            position: "absolute",
            top: "10%",
            right: "-10%",
            width: 320,
            height: 320,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(26,60,94,0.05) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 48,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                background: "linear-gradient(135deg, #1a3c5e, #0f2847)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
            <span style={{ fontSize: 17, fontWeight: 900, color: "#0f172a" }}>
              Credit<span style={{ color: "#1a3c5e" }}>Vault</span>
            </span>
          </Link>
          <h2
            style={{
              fontSize: 36,
              fontWeight: 900,
              color: "#0f172a",
              lineHeight: 1.1,
              letterSpacing: "-0.8px",
              margin: "0 0 14px",
            }}
          >
            Welcome
            <br />
            back.
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "#64748b",
              lineHeight: 1.75,
              margin: "0 0 40px",
              maxWidth: 300,
            }}
          >
            Access your accounts, transfer funds, and manage your finances —
            securely, from anywhere.
          </p>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            {stats.map(({ v, l }) => (
              <div
                key={l}
                style={{
                  padding: "16px",
                  borderRadius: 10,
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                }}
              >
                <p
                  style={{
                    margin: "0 0 3px",
                    fontSize: 20,
                    fontWeight: 800,
                    color: "#1a3c5e",
                    letterSpacing: "-0.4px",
                  }}
                >
                  {v}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 11,
                    color: "#94a3b8",
                    lineHeight: 1.4,
                  }}
                >
                  {l}
                </p>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 28,
              padding: "13px 16px",
              borderRadius: 9,
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Shield size={14} color="#16a34a" style={{ flexShrink: 0 }} />
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: "#15803d",
                fontWeight: 500,
              }}
            >
              FDIC Insured · 256-bit AES Encryption
            </p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 32px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{ width: "100%", maxWidth: 400 }}
        >
          {!needsVerify ? (
            <>
              <h1
                style={{
                  margin: "0 0 6px",
                  fontSize: 26,
                  fontWeight: 800,
                  color: "#0f172a",
                  letterSpacing: "-0.4px",
                }}
              >
                Sign in to Credit Vault
              </h1>
              <p style={{ margin: "0 0 28px", fontSize: 14, color: "#64748b" }}>
                New customer?{" "}
                <Link
                  to="/signup"
                  style={{
                    color: "#1a3c5e",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Open a free account
                </Link>
              </p>
              <StatusBox />
              <form
                onSubmit={handleLogin}
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#374151",
                      marginBottom: 6,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inp(focused.email)}
                    onFocus={() => setFocused((f) => ({ ...f, email: true }))}
                    onBlur={() => setFocused((f) => ({ ...f, email: false }))}
                  />
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 6,
                    }}
                  >
                    <label
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#374151",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      style={{
                        fontSize: 12,
                        color: "#1a3c5e",
                        textDecoration: "none",
                        fontWeight: 500,
                      }}
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPw ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ ...inp(focused.password), paddingRight: 44 }}
                      onFocus={() =>
                        setFocused((f) => ({ ...f, password: true }))
                      }
                      onBlur={() =>
                        setFocused((f) => ({ ...f, password: false }))
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#94a3b8",
                      }}
                    >
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: "13px",
                    borderRadius: 9,
                    background: "#1a3c5e",
                    color: "white",
                    fontWeight: 700,
                    fontSize: 15,
                    border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.7 : 1,
                    marginTop: 4,
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.currentTarget.style.background = "#0f2847";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#1a3c5e";
                  }}
                >
                  {loading ? "Signing in…" : "Sign In →"}
                </button>
              </form>
              <p
                style={{
                  marginTop: 20,
                  fontSize: 12,
                  color: "#94a3b8",
                  textAlign: "center",
                }}
              >
                🔒 Your connection is encrypted with TLS 1.3
              </p>
            </>
          ) : (
            // Unverified account — show OTP entry
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 60,
                  height: 60,
                  background: "#eff6ff",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 18px",
                }}
              >
                <Shield size={26} color="#1a3c5e" />
              </div>
              <h1
                style={{
                  margin: "0 0 8px",
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#0f172a",
                }}
              >
                Verify your email first
              </h1>
              <p style={{ margin: "0 0 24px", fontSize: 14, color: "#64748b" }}>
                A 6-digit code was sent to{" "}
                <strong style={{ color: "#0f172a" }}>{verifyEmail}</strong>
              </p>
              <StatusBox />
              <form onSubmit={handleVerifyOtp}>
                <input
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  maxLength={6}
                  placeholder="000000"
                  autoFocus
                  style={{
                    ...inp(true),
                    fontSize: 30,
                    fontWeight: 800,
                    textAlign: "center",
                    letterSpacing: "0.5em",
                    fontFamily: "monospace",
                    border: "2px solid #1a3c5e",
                    marginBottom: 14,
                  }}
                />
                <button
                  type="submit"
                  disabled={otpLoading || otp.length !== 6}
                  style={{
                    width: "100%",
                    padding: "13px",
                    borderRadius: 9,
                    background: "#1a3c5e",
                    color: "white",
                    fontWeight: 700,
                    fontSize: 15,
                    border: "none",
                    cursor: "pointer",
                    opacity: otpLoading || otp.length !== 6 ? 0.6 : 1,
                  }}
                >
                  {otpLoading ? "Verifying…" : "Verify & Sign In"}
                </button>
              </form>
              <button
                onClick={() => {
                  setNeedsVerify(false);
                  setStatus({ type: "", msg: "" });
                }}
                style={{
                  marginTop: 14,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 13,
                  color: "#64748b",
                }}
              >
                ← Back to sign in
              </button>
            </div>
          )}
        </motion.div>
      </div>
      <style>{`@media(max-width:800px){.auth-left{display:none!important}}`}</style>
    </div>
  );
}
