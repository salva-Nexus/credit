import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Shield, ArrowLeft } from "lucide-react";
import API from "../api";

// ─── tiny helpers ────────────────────────────────────────────────────────────
const field = (active) => ({
  width: "100%",
  padding: "12px 14px",
  borderRadius: 8,
  fontSize: 14,
  background: active ? "#fff" : "#f8fafc",
  border: `1.5px solid ${active ? "#1a3c5e" : "#e2e8f0"}`,
  color: "#0f172a",
  outline: "none",
  transition: "border-color 0.2s, background 0.2s",
  fontFamily: "'DM Sans', sans-serif",
  boxSizing: "border-box",
});

const STEPS = { CREDS: "creds", OTP_LOGIN: "otp_login", VERIFY: "verify" };

// ─── OTP row ─────────────────────────────────────────────────────────────────
function OtpRow({ value, onChange, prefix }) {
  const refs = useRef([]);

  const handleChange = (i, raw) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const next = [...value];
    next[i] = digit;
    onChange(next);
    if (digit && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !value[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (digits.length === 6) {
      onChange(digits.split(""));
      refs.current[5]?.focus();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        justifyContent: "center",
        marginBottom: 24,
      }}
      onPaste={handlePaste}
    >
      {value.map((digit, i) => (
        <input
          key={`${prefix}-${i}`}
          ref={(el) => (refs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          autoFocus={i === 0}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          style={{
            width: 50,
            height: 58,
            borderRadius: 10,
            textAlign: "center",
            fontSize: 22,
            fontWeight: 800,
            fontFamily: "monospace",
            border: `2px solid ${digit ? "#1a3c5e" : "#e2e8f0"}`,
            background: digit ? "#eff6ff" : "#fff",
            color: "#0f172a",
            outline: "none",
            transition: "all 0.15s",
            boxShadow: digit ? "0 0 0 3px rgba(26,60,94,0.08)" : "none",
            cursor: "text",
          }}
        />
      ))}
    </div>
  );
}

// ─── Alert box ───────────────────────────────────────────────────────────────
function Alert({ type, msg }) {
  if (!msg) return null;
  const ok = type === "success";
  return (
    <div
      style={{
        padding: "11px 14px",
        borderRadius: 8,
        marginBottom: 18,
        fontSize: 13,
        fontWeight: 500,
        background: ok ? "#f0fdf4" : "#fef2f2",
        border: `1px solid ${ok ? "#bbf7d0" : "#fecaca"}`,
        color: ok ? "#15803d" : "#dc2626",
      }}
    >
      {msg}
    </div>
  );
}

// ─── Left panel stats ─────────────────────────────────────────────────────────
const STATS = [
  { v: "$2.4T+", l: "Assets Under Management" },
  { v: "99.99%", l: "Platform Uptime" },
  { v: "4.8M+", l: "Active Customers" },
  { v: "50+", l: "Countries Supported" },
];

function LeftPanel() {
  return (
    <div
      className="auth-left"
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
    >
      {/* decorative blob */}
      <div
        style={{
          position: "absolute",
          top: "8%",
          right: "-12%",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(26,60,94,0.06) 0%, transparent 70%)",
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
              <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="2" fill="white" />
              {["3,12 7,12", "12,3 12,7", "21,12 17,12", "12,21 12,17"].map(
                (pts, i) => (
                  <line
                    key={i}
                    x1={pts.split(" ")[0].split(",")[0]}
                    y1={pts.split(" ")[0].split(",")[1]}
                    x2={pts.split(" ")[1].split(",")[0]}
                    y2={pts.split(" ")[1].split(",")[1]}
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                ),
              )}
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
          Secure 2-step login protects your account on every sign in.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 24,
          }}
        >
          {STATS.map(({ v, l }) => (
            <div
              key={l}
              style={{
                padding: 16,
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
            FDIC Insured · 256-bit AES · OTP on every login
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
const EMPTY_OTP = () => ["", "", "", "", "", ""];

export default function SignIn({ onLogin }) {
  const navigate = useNavigate();

  const [step, setStep] = useState(STEPS.CREDS);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [focused, setFocused] = useState({});
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  const [loginOtp, setLoginOtp] = useState(EMPTY_OTP());
  const [verifyOtp, setVerifyOtp] = useState(EMPTY_OTP());

  const focus = (key, val) => setFocused((f) => ({ ...f, [key]: val }));
  const setErr = (msg) => setStatus({ type: "error", msg });
  const setOk = (msg) => setStatus({ type: "success", msg });
  const clearStatus = () => setStatus({ type: "", msg: "" });

  // ── Step 1: submit credentials ─────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearStatus();
    try {
      const { data } = await API.post("/api/auth/login", { email, password });

      if (data.needsVerification) {
        setErr(data.msg || "Please verify your email before signing in.");
        setStep(STEPS.VERIFY);
        return;
      }
      if (data.requiresOtp) {
        setOk(data.msg || "A 6-digit code has been sent to your email.");
        setStep(STEPS.OTP_LOGIN);
        return;
      }
      // Edge-case: server returned a token directly (no OTP required)
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        await onLogin?.();
        navigate("/dashboard");
      }
    } catch (err) {
      setErr(err.response?.data?.msg || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: verify login OTP ───────────────────────────────────────────────
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const code = loginOtp.join("");
    if (code.length !== 6) return setErr("Please enter all 6 digits.");
    setLoading(true);
    clearStatus();
    try {
      const { data } = await API.post("/api/auth/verify-login-otp", {
        email,
        otp: code,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      await onLogin?.();
      navigate("/dashboard");
    } catch (err) {
      setErr(
        err.response?.data?.msg || "Invalid or expired code. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Verify unverified account ──────────────────────────────────────────────
  const handleVerifyAccount = async (e) => {
    e.preventDefault();
    const code = verifyOtp.join("");
    if (code.length !== 6) return setErr("Please enter all 6 digits.");
    setLoading(true);
    clearStatus();
    try {
      await API.post("/api/auth/verify-otp", { email, otp: code });
      setOk("Email verified! Sending your login code…");
      // Re-trigger login to get login OTP
      const { data } = await API.post("/api/auth/login", { email, password });
      if (data.requiresOtp) {
        setLoginOtp(EMPTY_OTP());
        setStep(STEPS.OTP_LOGIN);
        setOk("Account verified! Check your email for a login code.");
      } else if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        await onLogin?.();
        navigate("/dashboard");
      }
    } catch (err) {
      setErr(err.response?.data?.msg || "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setStep(STEPS.CREDS);
    setLoginOtp(EMPTY_OTP());
    setVerifyOtp(EMPTY_OTP());
    clearStatus();
  };

  // ── Shared button style ────────────────────────────────────────────────────
  const primaryBtn = (disabled) => ({
    width: "100%",
    padding: "13px",
    borderRadius: 9,
    background: "#1a3c5e",
    color: "white",
    fontWeight: 700,
    fontSize: 15,
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    fontFamily: "'DM Sans', sans-serif",
    transition: "background 0.2s",
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#f8fafc" }}>
      <LeftPanel />

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
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            style={{ width: "100%", maxWidth: 400, pointerEvents: "auto" }}
          >
            {/* ── STEP: Credentials ── */}
            {step === STEPS.CREDS && (
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
                  Sign in to CreditVault
                </h1>
                <p
                  style={{ margin: "0 0 28px", fontSize: 14, color: "#64748b" }}
                >
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

                <Alert {...status} />

                <form
                  onSubmit={handleLogin}
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  {/* Email */}
                  <div>
                    <label style={labelStyle}>Email Address</label>
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={field(focused.email)}
                      onFocus={() => focus("email", true)}
                      onBlur={() => focus("email", false)}
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 6,
                      }}
                    >
                      <label style={labelStyle}>Password</label>
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
                        autoComplete="current-password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ ...field(focused.password), paddingRight: 44 }}
                        onFocus={() => focus("password", true)}
                        onBlur={() => focus("password", false)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw((v) => !v)}
                        style={{
                          position: "absolute",
                          right: 12,
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#94a3b8",
                          padding: 0,
                        }}
                      >
                        {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={primaryBtn(loading)}
                    onMouseEnter={(e) => {
                      if (!loading)
                        e.currentTarget.style.background = "#0f2847";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#1a3c5e";
                    }}
                  >
                    {loading ? "Checking…" : "Continue →"}
                  </button>
                </form>
              </>
            )}

            {/* ── STEP: Login OTP ── */}
            {step === STEPS.OTP_LOGIN && (
              <div style={{ textAlign: "center" }}>
                <div style={iconCircle("#eff6ff")}>
                  <Shield size={28} color="#1a3c5e" />
                </div>
                <h1 style={headingStyle}>Enter your login code</h1>
                <p style={subStyle}>
                  We sent a 6-digit code to{" "}
                  <strong style={{ color: "#0f172a" }}>{email}</strong>
                </p>

                <Alert {...status} />

                <form onSubmit={handleOtpSubmit}>
                  <OtpRow
                    value={loginOtp}
                    onChange={setLoginOtp}
                    prefix="login-otp"
                  />
                  <button
                    type="submit"
                    disabled={loading || loginOtp.join("").length !== 6}
                    style={primaryBtn(
                      loading || loginOtp.join("").length !== 6,
                    )}
                  >
                    {loading ? "Verifying…" : "Sign In →"}
                  </button>
                </form>
                <BackButton onClick={goBack} />
              </div>
            )}

            {/* ── STEP: Verify unverified account ── */}
            {step === STEPS.VERIFY && (
              <div style={{ textAlign: "center" }}>
                <div style={iconCircle("#fffbeb")}>
                  <Shield size={28} color="#d97706" />
                </div>
                <h1 style={headingStyle}>Verify your email first</h1>
                <p style={subStyle}>
                  A verification code was sent to{" "}
                  <strong style={{ color: "#0f172a" }}>{email}</strong>
                </p>

                <Alert {...status} />

                <form onSubmit={handleVerifyAccount}>
                  <OtpRow
                    value={verifyOtp}
                    onChange={setVerifyOtp}
                    prefix="verify-otp"
                  />
                  <button
                    type="submit"
                    disabled={loading || verifyOtp.join("").length !== 6}
                    style={primaryBtn(
                      loading || verifyOtp.join("").length !== 6,
                    )}
                  >
                    {loading ? "Verifying…" : "Verify & Sign In"}
                  </button>
                </form>
                <BackButton onClick={goBack} />
              </div>
            )}

            <p
              style={{
                marginTop: 24,
                fontSize: 12,
                color: "#94a3b8",
                textAlign: "center",
              }}
            >
              🔒 Protected by 256-bit AES encryption
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        @media (max-width: 800px) { .auth-left { display: none !important; } }
      `}</style>
    </div>
  );
}

// ─── micro-components ─────────────────────────────────────────────────────────
const labelStyle = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "#374151",
  marginBottom: 6,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const headingStyle = {
  margin: "0 0 8px",
  fontSize: 24,
  fontWeight: 800,
  color: "#0f172a",
  letterSpacing: "-0.3px",
};

const subStyle = {
  margin: "0 0 24px",
  fontSize: 14,
  color: "#64748b",
  lineHeight: 1.6,
};

const iconCircle = (bg) => ({
  width: 64,
  height: 64,
  background: bg,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 20px",
});

function BackButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      onTouchEnd={(e) => {
        e.preventDefault();
        onClick();
      }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        margin: "14px auto 0",
        padding: "10px 16px" /* bigger touch target */,
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: 13,
        color: "#64748b",
        fontFamily: "'DM Sans', sans-serif",
        WebkitTapHighlightColor: "transparent",
        minHeight: 44 /* iOS recommended minimum */,
      }}
    >
      <ArrowLeft size={13} /> Use a different account
    </button>
  );
}
