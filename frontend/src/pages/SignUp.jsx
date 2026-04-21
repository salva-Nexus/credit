import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Shield, CheckCircle } from "lucide-react";
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

export default function SignUp() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    accountType: "checking",
  });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showPw, setShowPw] = useState(false);
  const [focused, setFocused] = useState({});
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const perks = [
    "Zero monthly fees on all accounts",
    "FDIC insured up to $250,000",
    "OTP security on every login",
    "International wire transfers to 50+ countries",
    "24/7 human customer support",
  ];

  const handleRegister = async (e) => {
    e.preventDefault();
    if (form.password.length < 8)
      return setStatus({
        type: "error",
        msg: "Password must be at least 8 characters.",
      });
    setLoading(true);
    setStatus({ type: "", msg: "" });
    try {
      await API.post("/api/auth/register", form);
      setStep(2);
    } catch (err) {
      setStatus({
        type: "error",
        msg: err.response?.data?.msg || "Registration failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  const otpValue = otp.join("");

  const handleOtpChange = (index, val) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      document.getElementById("otp-5")?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", msg: "" });
    try {
      await API.post("/api/auth/verify-otp", {
        email: form.email,
        otp: otpValue,
      });
      setStatus({
        type: "success",
        msg: "Account verified! Redirecting to sign in…",
      });
      setTimeout(() => navigate("/signin"), 1800);
    } catch (err) {
      setStatus({
        type: "error",
        msg: err.response?.data?.msg || "Invalid code.",
      });
    } finally {
      setLoading(false);
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
            width: 300,
            height: 300,
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
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "5px 12px",
              borderRadius: 20,
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              marginBottom: 24,
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#16a34a",
              }}
            />
            <span style={{ fontSize: 12, color: "#15803d", fontWeight: 600 }}>
              Accounts open instantly
            </span>
          </div>
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
            Banking that
            <br />
            works for you.
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "#64748b",
              lineHeight: 1.75,
              margin: "0 0 28px",
            }}
          >
            Open a Credit Vault account in under 5 minutes. No minimums, no
            hidden fees.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {perks.map((perk) => (
              <div
                key={perk}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <CheckCircle
                  size={16}
                  color="#16a34a"
                  style={{ flexShrink: 0 }}
                />
                <span
                  style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}
                >
                  {perk}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 28,
              padding: "13px 16px",
              borderRadius: 9,
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Shield size={14} color="#1a3c5e" style={{ flexShrink: 0 }} />
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: "#1e40af",
                fontWeight: 500,
              }}
            >
              FDIC Insured · AES-256 Encrypted · 24/7 Support
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
          style={{ width: "100%", maxWidth: 420 }}
        >
          {step === 1 ? (
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
                Open your account
              </h1>
              <p style={{ margin: "0 0 28px", fontSize: 14, color: "#64748b" }}>
                Already a member?{" "}
                <Link
                  to="/signin"
                  style={{
                    color: "#1a3c5e",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Sign in
                </Link>
              </p>
              <StatusBox />
              <form
                onSubmit={handleRegister}
                style={{ display: "flex", flexDirection: "column", gap: 15 }}
              >
                {[
                  {
                    name: "fullName",
                    label: "Full Legal Name",
                    placeholder: "John Smith",
                    type: "text",
                  },
                  {
                    name: "email",
                    label: "Email Address",
                    placeholder: "you@example.com",
                    type: "email",
                  },
                ].map(({ name, label, placeholder, type }) => (
                  <div key={name}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#374151",
                        marginBottom: 5,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {label}
                    </label>
                    <input
                      name={name}
                      type={type}
                      required
                      placeholder={placeholder}
                      value={form[name]}
                      onChange={(e) =>
                        setForm({ ...form, [e.target.name]: e.target.value })
                      }
                      style={inp(focused[name])}
                      onFocus={() =>
                        setFocused((f) => ({ ...f, [name]: true }))
                      }
                      onBlur={() =>
                        setFocused((f) => ({ ...f, [name]: false }))
                      }
                    />
                  </div>
                ))}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#374151",
                      marginBottom: 5,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPw ? "text" : "password"}
                      required
                      placeholder="At least 8 characters"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
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
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#374151",
                      marginBottom: 5,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Account Type
                  </label>
                  <select
                    name="accountType"
                    value={form.accountType}
                    onChange={(e) =>
                      setForm({ ...form, accountType: e.target.value })
                    }
                    style={{ ...inp(false), cursor: "pointer" }}
                  >
                    <option value="checking">Checking Account</option>
                    <option value="savings">Savings Account</option>
                  </select>
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
                  {loading ? "Creating account…" : "Open Account →"}
                </button>
              </form>
              <p
                style={{
                  marginTop: 14,
                  fontSize: 11,
                  color: "#94a3b8",
                  textAlign: "center",
                  lineHeight: 1.6,
                }}
              >
                By opening an account you agree to our Terms of Service. Credit
                Vault, N.A. Member FDIC.
              </p>
            </>
          ) : (
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  background: "#eff6ff",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <Shield size={28} color="#1a3c5e" />
              </div>
              <h1
                style={{
                  margin: "0 0 8px",
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#0f172a",
                }}
              >
                Verify your email
              </h1>
              <p
                style={{
                  margin: "0 0 28px",
                  fontSize: 14,
                  color: "#64748b",
                  lineHeight: 1.6,
                }}
              >
                We sent a 6-digit code to{" "}
                <strong style={{ color: "#0f172a" }}>{form.email}</strong>
              </p>
              <StatusBox />
              <form onSubmit={handleVerify}>
                {/* Individual digit boxes — no ø artifact */}
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    justifyContent: "center",
                    marginBottom: 20,
                  }}
                  onPaste={handleOtpPaste}
                >
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      autoFocus={i === 0}
                      style={{
                        width: 52,
                        height: 60,
                        borderRadius: 10,
                        textAlign: "center",
                        fontSize: 24,
                        fontWeight: 800,
                        fontFamily: "monospace",
                        border: `2px solid ${digit ? "#1a3c5e" : "#e2e8f0"}`,
                        background: digit ? "#eff6ff" : "white",
                        color: "#0f172a",
                        outline: "none",
                        transition: "all 0.15s",
                        boxShadow: digit
                          ? "0 0 0 3px rgba(26,60,94,0.1)"
                          : "none",
                      }}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading || otpValue.length !== 6}
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
                    opacity: loading || otpValue.length !== 6 ? 0.6 : 1,
                  }}
                >
                  {loading ? "Verifying…" : "Verify Account"}
                </button>
              </form>

              <button
                onClick={async () => {
                  try {
                    await API.post("/api/auth/resend-otp", {
                      email: form.email,
                    });
                    setStatus({ type: "success", msg: "New code sent." });
                  } catch {
                    setStatus({ type: "error", msg: "Failed to resend." });
                  }
                }}
                style={{
                  marginTop: 16,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 13,
                  color: "#64748b",
                }}
              >
                Didn't get it?{" "}
                <span style={{ color: "#1a3c5e", fontWeight: 600 }}>
                  Resend code
                </span>
              </button>

              <p style={{ marginTop: 12, fontSize: 12, color: "#94a3b8" }}>
                Check your spam folder if you don't see the email.
              </p>
            </div>
          )}
        </motion.div>
      </div>
      <style>{`@media(max-width:800px){.auth-left{display:none!important}}`}</style>
    </div>
  );
}
