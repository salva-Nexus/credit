import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Shield } from "lucide-react";
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

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [focused, setFocused] = useState({});
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const btn = {
    width: "100%",
    padding: "13px",
    borderRadius: 9,
    background: "#1a3c5e",
    color: "white",
    fontWeight: 700,
    fontSize: 15,
    border: "none",
    cursor: "pointer",
    transition: "background 0.2s",
  };

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
            top: "20%",
            right: "-10%",
            width: 280,
            height: 280,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(26,60,94,0.05) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Logo */}
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
            <span
              style={{
                fontSize: 17,
                fontWeight: 900,
                color: "#0f172a",
                letterSpacing: "-0.4px",
              }}
            >
              Credit<span style={{ color: "#1a3c5e" }}>Vault</span>
            </span>
          </Link>

          <h2
            style={{
              fontSize: 34,
              fontWeight: 900,
              color: "#0f172a",
              lineHeight: 1.1,
              letterSpacing: "-0.8px",
              margin: "0 0 14px",
            }}
          >
            Account
            <br />
            recovery.
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "#64748b",
              lineHeight: 1.75,
              margin: "0 0 36px",
            }}
          >
            We'll send a one-time code to your registered email address. Codes
            expire after 10 minutes.
          </p>

          {/* Steps indicator */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { n: 1, label: "Enter your email", done: step > 1 },
              { n: 2, label: "Verify the code", done: step > 2 },
              { n: 3, label: "Set new password", done: false },
            ].map(({ n, label, done }) => (
              <div
                key={n}
                style={{ display: "flex", alignItems: "center", gap: 12 }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    flexShrink: 0,
                    background: done
                      ? "#16a34a"
                      : step === n
                        ? "#1a3c5e"
                        : "#f1f5f9",
                    color: done || step === n ? "white" : "#94a3b8",
                  }}
                >
                  {done ? "✓" : n}
                </div>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: step === n ? 600 : 400,
                    color: step === n ? "#0f172a" : "#94a3b8",
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 36,
              padding: "14px 16px",
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
              All password resets are logged for your security.
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
          <Link
            to="/signin"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              color: "#64748b",
              textDecoration: "none",
              marginBottom: 32,
              fontWeight: 500,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#1a3c5e")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
          >
            ← Back to sign in
          </Link>

          {/* STEP 1 — Email */}
          {step === 1 && (
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
                Reset your password
              </h1>
              <p style={{ margin: "0 0 28px", fontSize: 14, color: "#64748b" }}>
                Enter your registered email and we'll send a reset code.
              </p>
              <StatusBox />
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  setStatus({ type: "", msg: "" });
                  try {
                    await API.post("/api/auth/forgot-password", {
                      email: email.trim().toLowerCase(),
                    });
                    setStatus({
                      type: "success",
                      msg: "Reset code sent. Check your inbox.",
                    });
                    setStep(2);
                  } catch (err) {
                    setStatus({
                      type: "error",
                      msg: err.response?.data?.msg || "No account found.",
                    });
                  } finally {
                    setLoading(false);
                  }
                }}
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
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
                <button
                  type="submit"
                  disabled={loading}
                  style={{ ...btn, opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? "Sending…" : "Send Reset Code"}
                </button>
              </form>
            </>
          )}

          {/* STEP 2 — OTP */}
          {step === 2 && (
            <>
              <h1
                style={{
                  margin: "0 0 8px",
                  fontSize: 26,
                  fontWeight: 800,
                  color: "#0f172a",
                  letterSpacing: "-0.4px",
                }}
              >
                Enter your code
              </h1>
              <p style={{ margin: "0 0 28px", fontSize: 14, color: "#64748b" }}>
                Check your inbox for the 6-digit code sent to{" "}
                <strong style={{ color: "#0f172a" }}>{email}</strong>
              </p>
              <StatusBox />
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  setStatus({ type: "", msg: "" });
                  try {
                    await API.post("/api/auth/verify-reset-otp", {
                      email: email.trim().toLowerCase(),
                      otp,
                    });
                    setStep(3);
                  } catch (err) {
                    setStatus({
                      type: "error",
                      msg: err.response?.data?.msg || "Invalid code.",
                    });
                  } finally {
                    setLoading(false);
                  }
                }}
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
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
                  }}
                />
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  style={{
                    ...btn,
                    opacity: loading || otp.length !== 6 ? 0.6 : 1,
                  }}
                >
                  {loading ? "Verifying…" : "Verify Code"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtp("");
                    setStatus({ type: "", msg: "" });
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 13,
                    color: "#64748b",
                    textAlign: "center",
                  }}
                >
                  Wrong email?{" "}
                  <span style={{ color: "#1a3c5e", fontWeight: 600 }}>
                    Go back
                  </span>
                </button>
              </form>
            </>
          )}

          {/* STEP 3 — New password */}
          {step === 3 && (
            <>
              <div
                style={{
                  width: 60,
                  height: 60,
                  background: "#eff6ff",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 18,
                }}
              >
                <Lock size={26} color="#1a3c5e" />
              </div>
              <h1
                style={{
                  margin: "0 0 6px",
                  fontSize: 26,
                  fontWeight: 800,
                  color: "#0f172a",
                  letterSpacing: "-0.4px",
                }}
              >
                Set new password
              </h1>
              <p style={{ margin: "0 0 28px", fontSize: 14, color: "#64748b" }}>
                Create a strong password for your Credit Vault account.
              </p>
              <StatusBox />
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (password !== confirm)
                    return setStatus({
                      type: "error",
                      msg: "Passwords do not match.",
                    });
                  if (password.length < 8)
                    return setStatus({
                      type: "error",
                      msg: "Password must be at least 8 characters.",
                    });
                  setLoading(true);
                  setStatus({ type: "", msg: "" });
                  try {
                    await API.post("/api/auth/reset-password", {
                      email: email.trim().toLowerCase(),
                      otp,
                      password,
                    });
                    setStatus({
                      type: "success",
                      msg: "Password updated! Redirecting to sign in…",
                    });
                    setTimeout(() => navigate("/signin"), 1800);
                  } catch (err) {
                    setStatus({
                      type: "error",
                      msg: err.response?.data?.msg || "Reset failed.",
                    });
                  } finally {
                    setLoading(false);
                  }
                }}
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
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
                    New Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPw ? "text" : "password"}
                      required
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ ...inp(focused.pw), paddingRight: 44 }}
                      onFocus={() => setFocused((f) => ({ ...f, pw: true }))}
                      onBlur={() => setFocused((f) => ({ ...f, pw: false }))}
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
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Repeat password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    style={inp(focused.confirm)}
                    onFocus={() => setFocused((f) => ({ ...f, confirm: true }))}
                    onBlur={() => setFocused((f) => ({ ...f, confirm: false }))}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{ ...btn, opacity: loading ? 0.7 : 1, marginTop: 4 }}
                >
                  {loading ? "Updating…" : "Update Password"}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>

      <style>{`@media(max-width:800px){.auth-left{display:none!important}}`}</style>
    </div>
  );
}
