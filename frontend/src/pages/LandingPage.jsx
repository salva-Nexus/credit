import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  Shield,
  Zap,
  Globe,
  Phone,
  CheckCircle,
  Star,
  Lock,
  Clock,
  HeadphonesIcon,
  ChevronDown,
  PiggyBank,
} from "lucide-react";

const Counter = ({ end, prefix = "", suffix = "", decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef();
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const steps = 60,
      dur = 1800;
    let i = 0;
    const t = setInterval(() => {
      i++;
      setCount(Math.min((end / steps) * i, end));
      if (i >= steps) clearInterval(t);
    }, dur / steps);
    return () => clearInterval(t);
  }, [inView, end]);
  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
};

const Reveal = ({ children, delay = 0, style }) => {
  const ref = useRef();
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={style}
    >
      {children}
    </motion.div>
  );
};

export default function LandingPage() {
  const [faqOpen, setFaqOpen] = useState(null);
  const [heroTextIndex, setHeroTextIndex] = useState(0);
  const heroTexts = [
    "smarter banking.",
    "zero monthly fees.",
    "instant transfers.",
    "your financial future.",
  ];

  useEffect(() => {
    const t = setInterval(
      () => setHeroTextIndex((i) => (i + 1) % heroTexts.length),
      3000,
    );
    return () => clearInterval(t);
  }, []);

  const features = [
    {
      icon: Shield,
      title: "Bank-Grade Security",
      desc: "Your account is protected by 256-bit AES encryption, multi-factor authentication on every login, and real-time fraud monitoring that never sleeps.",
    },
    {
      icon: Zap,
      title: "Instant Transfers",
      desc: "Send money to any US bank account with same-day ACH processing. No waiting, no hassle — your money moves when you need it to.",
    },
    {
      icon: Globe,
      title: "International Wires",
      desc: "Send money to 50+ countries worldwide. We handle the complexity of SWIFT codes, IBAN numbers, and local banking requirements for you.",
    },
    {
      icon: PiggyBank,
      title: "Savings Account",
      desc: "Open a savings account with no minimum balance, no monthly fees, and full FDIC insurance up to $250,000. Your money is always safe and accessible.",
    },
    {
      icon: Phone,
      title: "Mobile Banking",
      desc: "Manage every aspect of your finances from your smartphone. Pay bills, transfer funds, view statements — all from a beautifully designed app.",
    },
    {
      icon: HeadphonesIcon,
      title: "24/7 Support",
      desc: "Real humans, available around the clock. Whether it's a quick question or a complex issue, our team is always here to help.",
    },
  ];

  const plans = [
    {
      name: "Essential Checking",
      price: "$0",
      period: "/month",
      highlight: false,
      features: [
        "No monthly fees, ever",
        "Free debit card",
        "Up to $50 ATM fee rebates",
        "Mobile check deposit",
        "Bill pay included",
        "FDIC insured",
      ],
    },
    {
      name: "Savings Account",
      price: "$0",
      period: "/month",
      highlight: true,
      badge: "Most Popular",
      features: [
        "No minimum balance",
        "No monthly fees",
        "Linked to checking",
        "Automatic savings rules",
        "FDIC insured to $250K",
        "Instant transfers",
      ],
    },
    {
      name: "Business Banking",
      price: "$15",
      period: "/month",
      highlight: false,
      features: [
        "Dedicated business account",
        "Up to 5 user accounts",
        "Unlimited transactions",
        "Priority wire processing",
        "Monthly reporting",
        "Relationship manager",
      ],
    },
  ];

  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Small Business Owner, Austin TX",
      rating: 5,
      text: "Switched from Chase after 12 years. Credit Vault's business account has saved me hundreds in monthly fees and the international wire process is incredibly smooth.",
    },
    {
      name: "James Okoye",
      role: "Software Engineer, San Francisco",
      rating: 5,
      text: "The savings account is great — no fees, no minimums. The app is cleaner than any other bank I've used.",
    },
    {
      name: "Maria Santos",
      role: "Freelance Designer, New York",
      rating: 5,
      text: "Sending money to my family in the Philippines used to be a nightmare. Credit Vault made it straightforward with clear fee disclosure and fast settlement.",
    },
    {
      name: "Robert Chen",
      role: "Retired Teacher, Chicago",
      rating: 5,
      text: "I was skeptical about online banking at my age. The support team walked me through everything. Best decision I've made financially in years.",
    },
    {
      name: "Amara Williams",
      role: "Nurse Practitioner, Atlanta",
      rating: 5,
      text: "The two-factor authentication on every login gives me peace of mind. My previous bank got compromised — that's never happening again with this level of security.",
    },
    {
      name: "David Park",
      role: "Startup Founder, Seattle",
      rating: 5,
      text: "Managing payroll and vendor payments through one account is exactly what my company needed. The admin panel is genuinely powerful.",
    },
  ];

  const faqs = [
    {
      q: "Is Credit Vault FDIC insured?",
      a: "Yes. Credit Vault, N.A. is a member of the Federal Deposit Insurance Corporation (FDIC). Your deposits are insured up to $250,000 per depositor, per account ownership category — the maximum allowed by law.",
    },
    {
      q: "How do I open an account?",
      a: "Click \"Open Account\" and complete our online form in under 5 minutes. You'll need your Social Security Number, a valid government-issued ID, and a funding source. We'll verify your identity instantly and your account will be active the same day.",
    },
    {
      q: "Are there any hidden fees?",
      a: "No. Our Essential Checking account has zero monthly fees, zero minimum balance requirements, and zero overdraft fees. We make money through interchange fees when you use your debit card — not from charging you.",
    },
    {
      q: "How secure is my money?",
      a: "Extremely. We use 256-bit AES encryption for all data at rest and TLS 1.3 for data in transit. Every login requires a one-time security code sent to your registered email. Our fraud detection system monitors 100% of transactions in real time.",
    },
    {
      q: "What's the minimum for international wire transfers?",
      a: "International wire transfers have a minimum of $50,000 USD. This threshold exists to cover compliance costs and ensure we can provide the level of verification required for international transactions. Domestic transfers have no minimum.",
    },
    {
      q: "How long do transfers take?",
      a: "Domestic ACH transfers: 1–2 business days. Domestic wire transfers: same day if submitted before 3PM EST. International wire transfers: 1–5 business days depending on the destination country and receiving bank.",
    },
    {
      q: "Can I have both checking and savings accounts?",
      a: "Yes. You can open multiple account types under one profile. Your checking and savings accounts are linked for easy transfers, and you can set up automatic savings rules to move money between them.",
    },
    {
      q: "What happens if I suspect fraud?",
      a: "Contact us immediately at our 24/7 support line. We'll freeze the account, investigate the activity, and issue a replacement card within 2 business days. You are never liable for unauthorized transactions reported promptly.",
    },
  ];

  const btnPrimary = {
    padding: "14px 32px",
    borderRadius: 10,
    background: "#1a3c5e",
    color: "white",
    fontWeight: 700,
    fontSize: 16,
    textDecoration: "none",
    display: "inline-block",
    transition: "all 0.2s",
    border: "none",
    cursor: "pointer",
  };

  return (
    <div style={{ background: "white", overflowX: "hidden" }}>
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          background:
            "linear-gradient(160deg, #f8fafc 0%, #eff6ff 50%, #f0fdf4 100%)",
          position: "relative",
          overflow: "hidden",
          paddingTop: 80,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "15%",
            right: "8%",
            width: 420,
            height: 420,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "5%",
            width: 320,
            height: 320,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(22,163,74,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "60px 32px",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 60,
              alignItems: "center",
            }}
            className="hero-grid"
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 14px",
                  borderRadius: 20,
                  background: "rgba(22,163,74,0.1)",
                  border: "1px solid rgba(22,163,74,0.2)",
                  marginBottom: 28,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#16a34a",
                    boxShadow: "0 0 8px rgba(22,163,74,0.6)",
                  }}
                />
                <span
                  style={{ fontSize: 13, fontWeight: 600, color: "#15803d" }}
                >
                  FDIC Insured · Member Since 1998
                </span>
              </div>
              <h1
                style={{
                  margin: "0 0 8px",
                  fontSize: "clamp(38px, 5vw, 60px)",
                  fontWeight: 900,
                  color: "#0f172a",
                  lineHeight: 1.08,
                  letterSpacing: "-1.5px",
                }}
              >
                Banking built for
              </h1>
              <div style={{ overflow: "hidden", marginBottom: 24 }}>
                <motion.h1
                  key={heroTextIndex}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -40, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    margin: 0,
                    fontSize: "clamp(38px, 5vw, 60px)",
                    fontWeight: 900,
                    color: "#1a3c5e",
                    lineHeight: 1.08,
                    letterSpacing: "-1.5px",
                  }}
                >
                  {heroTexts[heroTextIndex]}
                </motion.h1>
              </div>
              <p
                style={{
                  margin: "0 0 36px",
                  fontSize: 18,
                  color: "#475569",
                  lineHeight: 1.75,
                  maxWidth: 480,
                }}
              >
                Credit Vault combines the security and trust of a traditional
                bank with the speed and simplicity of modern technology. Open an
                account in under 5 minutes.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  marginBottom: 44,
                }}
              >
                <Link
                  to="/signup"
                  style={{
                    ...btnPrimary,
                    boxShadow: "0 4px 20px rgba(26,60,94,0.25)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#0f2847";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#1a3c5e";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  Open Account — It's Free
                </Link>
                <Link
                  to="/signin"
                  style={{
                    ...btnPrimary,
                    background: "white",
                    color: "#1a3c5e",
                    border: "2px solid #e2e8f0",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#1a3c5e";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  Sign In
                </Link>
              </div>
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                {[
                  { icon: Shield, text: "FDIC Insured" },
                  { icon: Lock, text: "256-bit Encryption" },
                  { icon: Clock, text: "Open 24/7" },
                ].map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    style={{ display: "flex", alignItems: "center", gap: 7 }}
                  >
                    <Icon size={15} color="#16a34a" />
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#374151",
                      }}
                    >
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div style={{ width: "100%", maxWidth: 400 }}>
                <motion.div
                  initial={{ opacity: 0, y: 20, rotate: -2 }}
                  animate={{ opacity: 1, y: 0, rotate: -2 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  style={{
                    padding: "28px",
                    borderRadius: 18,
                    background: "linear-gradient(135deg, #1a3c5e, #0f2847)",
                    color: "white",
                    boxShadow: "0 24px 60px rgba(26,60,94,0.3)",
                    marginBottom: -40,
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 32,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 7,
                          background: "rgba(255,255,255,0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M3 10L10 3L17 10V17H13V13H7V17H3V10Z"
                            fill="white"
                          />
                        </svg>
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "rgba(255,255,255,0.9)",
                        }}
                      >
                        Credit Vault
                      </span>
                    </div>
                    <div style={{ display: "flex" }}>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: "rgba(255,193,7,0.8)",
                          border: "2px solid rgba(255,255,255,0.2)",
                        }}
                      />
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: "rgba(255,193,7,0.5)",
                          marginLeft: -12,
                          border: "2px solid rgba(255,255,255,0.2)",
                        }}
                      />
                    </div>
                  </div>
                  <p
                    style={{
                      margin: "0 0 18px",
                      fontSize: 18,
                      letterSpacing: "0.2em",
                      fontFamily: "monospace",
                      color: "rgba(255,255,255,0.85)",
                    }}
                  >
                    ···· ···· ···· 4291
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          margin: "0 0 2px",
                          fontSize: 10,
                          color: "rgba(255,255,255,0.5)",
                          textTransform: "uppercase",
                        }}
                      >
                        Card Holder
                      </p>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
                        JOHN SMITH
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p
                        style={{
                          margin: "0 0 2px",
                          fontSize: 10,
                          color: "rgba(255,255,255,0.5)",
                          textTransform: "uppercase",
                        }}
                      >
                        Expires
                      </p>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
                        12/28
                      </p>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                  style={{
                    padding: "24px 28px",
                    borderRadius: 16,
                    background: "white",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                    border: "1px solid #f1f5f9",
                    position: "relative",
                    zIndex: 3,
                    marginTop: 8,
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 4px",
                      fontSize: 11,
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      fontWeight: 600,
                    }}
                  >
                    Available Balance
                  </p>
                  <p
                    style={{
                      margin: "0 0 18px",
                      fontSize: 34,
                      fontWeight: 900,
                      color: "#0f172a",
                      letterSpacing: "-1px",
                    }}
                  >
                    $24,850.00
                  </p>
                  <div style={{ display: "flex", gap: 10 }}>
                    {[
                      { label: "Transfer", color: "#1a3c5e" },
                      { label: "Pay", color: "#7c3aed" },
                      { label: "History", color: "#0891b2" },
                    ].map(({ label, color }) => (
                      <div
                        key={label}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: 9,
                          background: `${color}10`,
                          textAlign: "center",
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = `${color}20`)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = `${color}10`)
                        }
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: 12,
                            fontWeight: 700,
                            color,
                          }}
                        >
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
          <div
            style={{
              textAlign: "center",
              marginTop: 60,
              animation: "float 2s ease-in-out infinite",
            }}
          >
            <ChevronDown size={24} color="#94a3b8" />
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section
        style={{ background: "#0f172a", padding: "64px 32px" }}
        id="about"
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 1,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {[
              {
                value: 2.4,
                prefix: "$",
                suffix: "T+",
                label: "Assets Under Management",
                decimals: 1,
              },
              {
                value: 4.8,
                prefix: "",
                suffix: "M+",
                label: "Active Account Holders",
                decimals: 1,
              },
              {
                value: 50,
                prefix: "",
                suffix: "+",
                label: "Wire Transfer Countries",
                decimals: 0,
              },
              {
                value: 99.9,
                prefix: "",
                suffix: "%",
                label: "Platform Uptime",
                decimals: 1,
              },
              {
                value: 26,
                prefix: "$",
                suffix: "B+",
                label: "Transactions Processed",
                decimals: 0,
              },
            ].map(({ value, prefix, suffix, label, decimals }) => (
              <Reveal
                key={label}
                style={{
                  background: "#0f172a",
                  padding: "32px 16px",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    margin: "0 0 8px",
                    fontSize: "clamp(16px, 1.8vw, 28px)",
                    fontWeight: 900,
                    color: "white",
                    letterSpacing: "-0.5px",
                  }}
                >
                  <Counter
                    end={value}
                    prefix={prefix}
                    suffix={suffix}
                    decimals={decimals}
                  />
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 11,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    lineHeight: 1.5,
                  }}
                >
                  {label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BANDS ───────────────────────────────────────────────────── */}
      <section
        style={{
          background: "#f8fafc",
          padding: "28px 32px",
          borderBottom: "1px solid #e2e8f0",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 48,
            flexWrap: "wrap",
          }}
        >
          {[
            "FDIC Member",
            "Equal Housing Lender",
            "Nasdaq Listed",
            "SOC 2 Type II",
            "PCI-DSS Compliant",
            "ISO 27001 Certified",
          ].map((b) => (
            <span
              key={b}
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#94a3b8",
                letterSpacing: "0.05em",
              }}
            >
              {b}
            </span>
          ))}
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      <section
        style={{ padding: "96px 32px", background: "white" }}
        id="products"
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 64 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#1a3c5e",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                display: "block",
                marginBottom: 12,
              }}
            >
              Why Credit Vault
            </span>
            <h2
              style={{
                margin: "0 0 16px",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 900,
                color: "#0f172a",
                letterSpacing: "-0.8px",
                lineHeight: 1.15,
              }}
            >
              Everything you expect.
              <br />
              More than you imagined.
            </h2>
            <p
              style={{
                margin: "0 auto",
                fontSize: 17,
                color: "#64748b",
                maxWidth: 520,
                lineHeight: 1.7,
              }}
            >
              We built the bank we always wished existed — one that treats you
              like an adult, not a revenue source.
            </p>
          </Reveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 20,
            }}
          >
            {features.map(({ icon: Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 0.07}>
                <div
                  style={{
                    padding: "28px",
                    borderRadius: 14,
                    border: "1px solid #e2e8f0",
                    background: "white",
                    transition: "all 0.2s",
                    height: "100%",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 8px 30px rgba(26,60,94,0.1)";
                    e.currentTarget.style.borderColor = "#bfdbfe";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 11,
                      background: "#eff6ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 18,
                    }}
                  >
                    <Icon size={20} color="#1a3c5e" />
                  </div>
                  <h3
                    style={{
                      margin: "0 0 10px",
                      fontSize: 17,
                      fontWeight: 700,
                      color: "#0f172a",
                    }}
                  >
                    {title}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      color: "#64748b",
                      lineHeight: 1.7,
                    }}
                  >
                    {desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECURITY ──────────────────────────────────────────────────────── */}
      <section
        style={{ padding: "96px 32px", background: "#f8fafc" }}
        id="security"
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 80,
              alignItems: "center",
            }}
            className="split-grid"
          >
            <Reveal>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#1a3c5e",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  display: "block",
                  marginBottom: 12,
                }}
              >
                Security First
              </span>
              <h2
                style={{
                  margin: "0 0 20px",
                  fontSize: "clamp(26px, 4vw, 40px)",
                  fontWeight: 900,
                  color: "#0f172a",
                  letterSpacing: "-0.8px",
                  lineHeight: 1.15,
                }}
              >
                Your money is safe.
                <br />
                We guarantee it.
              </h2>
              <p
                style={{
                  margin: "0 0 32px",
                  fontSize: 16,
                  color: "#64748b",
                  lineHeight: 1.75,
                }}
              >
                We've invested more in security infrastructure than any other
                digital bank. Not because we have to — because it's the right
                thing to do.
              </p>
              {[
                {
                  title: "256-bit AES Encryption",
                  desc: "All data encrypted at rest and in transit using military-grade standards",
                },
                {
                  title: "OTP on Every Login",
                  desc: "One-time passwords sent to your registered email for every sign-in attempt",
                },
                {
                  title: "Real-Time Fraud Detection",
                  desc: "AI-powered monitoring analyzes 100% of transactions as they occur",
                },
                {
                  title: "FDIC Insurance",
                  desc: "Deposits insured up to $250,000 by the Federal Deposit Insurance Corporation",
                },
                {
                  title: "Zero Liability Protection",
                  desc: "You're never responsible for unauthorized transactions reported promptly",
                },
              ].map(({ title, desc }) => (
                <div
                  key={title}
                  style={{ display: "flex", gap: 14, marginBottom: 18 }}
                >
                  <CheckCircle
                    size={20}
                    color="#16a34a"
                    style={{ flexShrink: 0, marginTop: 1 }}
                  />
                  <div>
                    <p
                      style={{
                        margin: "0 0 3px",
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#0f172a",
                      }}
                    >
                      {title}
                    </p>
                    <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </Reveal>
            <Reveal delay={0.2}>
              <div
                style={{
                  padding: "40px",
                  borderRadius: 20,
                  background: "linear-gradient(135deg, #1a3c5e, #0f2847)",
                  boxShadow: "0 24px 60px rgba(26,60,94,0.25)",
                }}
              >
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                    }}
                  >
                    <Shield size={28} color="white" />
                  </div>
                  <h3
                    style={{
                      margin: "0 0 6px",
                      fontSize: 20,
                      fontWeight: 800,
                      color: "white",
                    }}
                  >
                    Security Status
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    All systems operational
                  </p>
                </div>
                {[
                  { label: "Encryption", status: "AES-256 Active" },
                  { label: "Fraud Detection", status: "Real-time Active" },
                  { label: "DDoS Protection", status: "Cloudflare Active" },
                  { label: "Backup Systems", status: "99.99% Uptime" },
                  { label: "Data Centers", status: "3 Geographic Regions" },
                  { label: "Penetration Tests", status: "Last: 7 days ago" },
                ].map(({ label, status }) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <span
                      style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}
                    >
                      {label}
                    </span>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <div
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: "#22c55e",
                          boxShadow: "0 0 8px rgba(34,197,94,0.6)",
                        }}
                      />
                      <span
                        style={{
                          fontSize: 12,
                          color: "rgba(255,255,255,0.6)",
                          fontFamily: "monospace",
                        }}
                      >
                        {status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── PLANS ─────────────────────────────────────────────────────────── */}
      <section style={{ padding: "96px 32px", background: "white" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 56 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#1a3c5e",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                display: "block",
                marginBottom: 12,
              }}
            >
              Account Types
            </span>
            <h2
              style={{
                margin: "0 0 12px",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 900,
                color: "#0f172a",
                letterSpacing: "-0.8px",
              }}
            >
              Simple, transparent pricing.
            </h2>
            <p style={{ margin: 0, fontSize: 17, color: "#64748b" }}>
              No surprise fees. No fine print. What you see is what you get.
            </p>
          </Reveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            {plans.map(
              (
                {
                  name,
                  price,
                  period,
                  highlight,
                  badge: planBadge,
                  features: planFeatures,
                },
                i,
              ) => (
                <Reveal key={name} delay={i * 0.1}>
                  <div
                    style={{
                      padding: "32px",
                      borderRadius: 16,
                      border: `2px solid ${highlight ? "#1a3c5e" : "#e2e8f0"}`,
                      background: highlight ? "#f0f7ff" : "white",
                      position: "relative",
                      transition: "all 0.2s",
                      height: "100%",
                    }}
                    onMouseEnter={(e) => {
                      if (!highlight) {
                        e.currentTarget.style.borderColor = "#bfdbfe";
                        e.currentTarget.style.boxShadow =
                          "0 8px 30px rgba(0,0,0,0.08)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!highlight) {
                        e.currentTarget.style.borderColor = "#e2e8f0";
                        e.currentTarget.style.boxShadow = "none";
                      }
                    }}
                  >
                    {planBadge && (
                      <div
                        style={{
                          position: "absolute",
                          top: -14,
                          left: "50%",
                          transform: "translateX(-50%)",
                          padding: "5px 16px",
                          borderRadius: 20,
                          background: "#1a3c5e",
                          color: "white",
                          fontSize: 12,
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {planBadge}
                      </div>
                    )}
                    <h3
                      style={{
                        margin: "0 0 8px",
                        fontSize: 18,
                        fontWeight: 700,
                        color: "#0f172a",
                      }}
                    >
                      {name}
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 4,
                        marginBottom: 24,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 44,
                          fontWeight: 900,
                          color: highlight ? "#1a3c5e" : "#0f172a",
                          letterSpacing: "-1px",
                        }}
                      >
                        {price}
                      </span>
                      <span style={{ fontSize: 16, color: "#64748b" }}>
                        {period}
                      </span>
                    </div>
                    <div style={{ marginBottom: 28 }}>
                      {planFeatures.map((f) => (
                        <div
                          key={f}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            marginBottom: 12,
                          }}
                        >
                          <CheckCircle
                            size={16}
                            color="#16a34a"
                            style={{ flexShrink: 0 }}
                          />
                          <span style={{ fontSize: 14, color: "#374151" }}>
                            {f}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Link
                      to="/signup"
                      style={{
                        display: "block",
                        textAlign: "center",
                        padding: "12px",
                        borderRadius: 9,
                        background: highlight ? "#1a3c5e" : "white",
                        color: highlight ? "white" : "#1a3c5e",
                        fontWeight: 700,
                        fontSize: 14,
                        textDecoration: "none",
                        border: "2px solid #1a3c5e",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = highlight
                          ? "#0f2847"
                          : "#eff6ff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = highlight
                          ? "#1a3c5e"
                          : "white";
                      }}
                    >
                      Get Started →
                    </Link>
                  </div>
                </Reveal>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section style={{ padding: "96px 32px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 56 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#1a3c5e",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                display: "block",
                marginBottom: 12,
              }}
            >
              Customer Reviews
            </span>
            <h2
              style={{
                margin: "0 0 12px",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 900,
                color: "#0f172a",
                letterSpacing: "-0.8px",
              }}
            >
              4.9 stars from 180,000+ reviews
            </h2>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 4,
                marginBottom: 8,
              }}
            >
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill="#f59e0b" color="#f59e0b" />
              ))}
            </div>
          </Reveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 18,
            }}
          >
            {testimonials.map(({ name, role, rating, text }, i) => (
              <Reveal key={name} delay={i * 0.07}>
                <div
                  style={{
                    padding: "24px",
                    borderRadius: 14,
                    background: "white",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    height: "100%",
                  }}
                >
                  <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                    {[...Array(rating)].map((_, j) => (
                      <Star key={j} size={14} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                  <p
                    style={{
                      margin: "0 0 20px",
                      fontSize: 14,
                      color: "#374151",
                      lineHeight: 1.75,
                      fontStyle: "italic",
                    }}
                  >
                    "{text}"
                  </p>
                  <div>
                    <p
                      style={{
                        margin: "0 0 2px",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#0f172a",
                      }}
                    >
                      {name}
                    </p>
                    <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>
                      {role}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section style={{ padding: "96px 32px", background: "white" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 48 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#1a3c5e",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                display: "block",
                marginBottom: 12,
              }}
            >
              FAQs
            </span>
            <h2
              style={{
                margin: 0,
                fontSize: "clamp(28px, 4vw, 40px)",
                fontWeight: 900,
                color: "#0f172a",
                letterSpacing: "-0.8px",
              }}
            >
              Common questions.
            </h2>
          </Reveal>
          <div>
            {faqs.map(({ q, a }, i) => (
              <div key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "20px 0",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#0f172a",
                      paddingRight: 16,
                    }}
                  >
                    {q}
                  </span>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: faqOpen === i ? "#1a3c5e" : "#f1f5f9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "all 0.2s",
                    }}
                  >
                    <ChevronDown
                      size={14}
                      color={faqOpen === i ? "white" : "#64748b"}
                      style={{
                        transform: faqOpen === i ? "rotate(180deg)" : "none",
                        transition: "transform 0.2s",
                      }}
                    />
                  </div>
                </button>
                {faqOpen === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <p
                      style={{
                        margin: "0 0 20px",
                        fontSize: 15,
                        color: "#64748b",
                        lineHeight: 1.75,
                        paddingRight: 44,
                      }}
                    >
                      {a}
                    </p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section style={{ padding: "96px 32px", background: "#0f172a" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                borderRadius: 20,
                background: "rgba(34,197,94,0.12)",
                border: "1px solid rgba(34,197,94,0.2)",
                marginBottom: 28,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#22c55e",
                }}
              />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#86efac" }}>
                Open accounts in under 5 minutes
              </span>
            </div>
            <h2
              style={{
                margin: "0 0 18px",
                fontSize: "clamp(30px, 5vw, 52px)",
                fontWeight: 900,
                color: "white",
                letterSpacing: "-1px",
                lineHeight: 1.1,
              }}
            >
              Ready to experience
              <br />
              better banking?
            </h2>
            <p
              style={{
                margin: "0 0 40px",
                fontSize: 17,
                color: "#94a3b8",
                lineHeight: 1.7,
              }}
            >
              Join over 4.8 million people who've made the switch. No fees. No
              minimums. No nonsense.
            </p>
            <div
              style={{
                display: "flex",
                gap: 14,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link
                to="/signup"
                style={{
                  padding: "16px 36px",
                  borderRadius: 10,
                  background: "white",
                  color: "#0f172a",
                  fontWeight: 800,
                  fontSize: 16,
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f1f5f9";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.transform = "none";
                }}
              >
                Open Free Account →
              </Link>
              <Link
                to="/signin"
                style={{
                  padding: "16px 36px",
                  borderRadius: 10,
                  background: "transparent",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 16,
                  textDecoration: "none",
                  border: "2px solid rgba(255,255,255,0.2)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                }}
              >
                Existing Customer
              </Link>
            </div>
            <p style={{ marginTop: 24, fontSize: 12, color: "#475569" }}>
              FDIC Insured · No credit check · Zero monthly fees · Cancel
              anytime
            </p>
          </Reveal>
        </div>
      </section>

      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @media(max-width:768px){
          .hero-grid{grid-template-columns:1fr!important;gap:40px!important}
          .split-grid{grid-template-columns:1fr!important;gap:40px!important}
        }
        @media(max-width:900px){
          section > div > div[style*="repeat(5, 1fr)"]{grid-template-columns:repeat(3,1fr)!important}
        }
        @media(max-width:560px){
          section > div > div[style*="repeat(5, 1fr)"]{grid-template-columns:repeat(2,1fr)!important}
        }
      `}</style>
    </div>
  );
}
