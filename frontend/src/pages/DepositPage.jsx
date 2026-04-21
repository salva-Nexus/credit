import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import API from "../api";

const inp = (focused) => ({
  width: "100%",
  padding: "10px 13px",
  borderRadius: 7,
  fontSize: 14,
  background: "white",
  border: `1.5px solid ${focused ? "#1a3c5e" : "#e2e8f0"}`,
  color: "#0f172a",
  outline: "none",
  fontFamily: "Inter, sans-serif",
  boxSizing: "border-box",
});

const methods = [
  { id: "wire", label: "Wire Transfer", desc: "1–2 business days", icon: "🏦" },
  { id: "ach", label: "ACH Transfer", desc: "2–3 business days", icon: "📱" },
  {
    id: "check",
    label: "Check Deposit",
    desc: "2–5 business days",
    icon: "📄",
  },
  { id: "cash", label: "Cash Deposit", desc: "Same day", icon: "💵" },
];

export default function DepositPage({ userData, onSuccess }) {
  const [method, setMethod] = useState("wire");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [focused, setFocused] = useState({});
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(amount) <= 0)
      return setStatus({ type: "error", msg: "Enter a valid amount." });
    setLoading(true);
    setStatus({ type: "", msg: "" });
    try {
      await API.post("/api/banking/deposit", {
        amount: Number(amount),
        method: methods.find((m) => m.id === method)?.label,
        memo,
      });
      setDone(true);
      onSuccess?.();
    } catch (err) {
      setStatus({
        type: "error",
        msg: err.response?.data?.msg || "Request failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (done)
    return (
      <div
        style={{
          maxWidth: 520,
          margin: "40px auto",
          textAlign: "center",
          padding: 24,
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "#f0fdf4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <CheckCircle size={36} color="#16a34a" />
          </div>
          <h2
            style={{
              margin: "0 0 10px",
              fontSize: 24,
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            Deposit Request Submitted
          </h2>
          <p
            style={{
              margin: "0 0 24px",
              fontSize: 14,
              color: "#64748b",
              lineHeight: 1.6,
            }}
          >
            Your deposit of <strong>${Number(amount).toLocaleString()}</strong>{" "}
            has been submitted. Funds will be credited to your account after
            verification.
          </p>
          <button
            onClick={() => {
              setDone(false);
              setAmount("");
              setMemo("");
            }}
            style={{
              padding: "12px 28px",
              borderRadius: 9,
              background: "#1a3c5e",
              color: "white",
              fontWeight: 600,
              fontSize: 14,
              border: "none",
              cursor: "pointer",
            }}
          >
            Make Another Deposit
          </button>
        </motion.div>
      </div>
    );

  return (
    <div style={{ maxWidth: 580 }}>
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            margin: "0 0 6px",
            fontSize: 22,
            fontWeight: 800,
            color: "#0f172a",
          }}
        >
          Deposit Funds
        </h1>
        <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>
          Current balance:{" "}
          <strong style={{ color: "#0f172a" }}>
            $
            {(userData?.balance || 0).toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </strong>
        </p>
      </div>

      {status.msg && (
        <div
          style={{
            padding: "11px 14px",
            borderRadius: 8,
            marginBottom: 18,
            fontSize: 13,
            fontWeight: 500,
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#dc2626",
          }}
        >
          {status.msg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Method select */}
        <div style={{ marginBottom: 22 }}>
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 600,
              color: "#374151",
              marginBottom: 10,
            }}
          >
            Deposit Method
          </label>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            {methods.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                style={{
                  padding: "14px",
                  borderRadius: 9,
                  border: `2px solid ${method === m.id ? "#1a3c5e" : "#e2e8f0"}`,
                  background: method === m.id ? "#eff6ff" : "white",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: 20 }}>{m.icon}</span>
                <p
                  style={{
                    margin: "6px 0 2px",
                    fontSize: 13,
                    fontWeight: 700,
                    color: method === m.id ? "#1a3c5e" : "#0f172a",
                  }}
                >
                  {m.label}
                </p>
                <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>
                  {m.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div style={{ marginBottom: 18 }}>
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 600,
              color: "#374151",
              marginBottom: 6,
            }}
          >
            Amount (USD)
          </label>
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: 13,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 16,
                fontWeight: 700,
                color: "#94a3b8",
              }}
            >
              $
            </span>
            <input
              type="number"
              required
              min="1"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                ...inp(focused.amount),
                paddingLeft: 28,
                fontSize: 20,
                fontWeight: 700,
              }}
              onFocus={() => setFocused((f) => ({ ...f, amount: true }))}
              onBlur={() => setFocused((f) => ({ ...f, amount: false }))}
            />
          </div>
          {/* Quick amounts */}
          <div
            style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}
          >
            {[500, 1000, 5000, 10000, 25000].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setAmount(String(v))}
                style={{
                  padding: "5px 12px",
                  borderRadius: 6,
                  border: `1px solid ${amount === String(v) ? "#1a3c5e" : "#e2e8f0"}`,
                  background: amount === String(v) ? "#eff6ff" : "white",
                  fontSize: 12,
                  fontWeight: 500,
                  color: amount === String(v) ? "#1a3c5e" : "#374151",
                  cursor: "pointer",
                }}
              >
                ${v.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Memo */}
        <div style={{ marginBottom: 24 }}>
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 600,
              color: "#374151",
              marginBottom: 6,
            }}
          >
            Reference / Note (optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Payroll, Business income"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            style={inp(focused.memo)}
            onFocus={() => setFocused((f) => ({ ...f, memo: true }))}
            onBlur={() => setFocused((f) => ({ ...f, memo: false }))}
          />
        </div>

        {/* Account info for wire */}
        {method === "wire" && (
          <div
            style={{
              padding: "16px",
              borderRadius: 10,
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              marginBottom: 20,
            }}
          >
            <p
              style={{
                margin: "0 0 12px",
                fontSize: 12,
                fontWeight: 700,
                color: "#374151",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Wire Transfer Details
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              {[
                ["Bank Name", "Credit Vault, N.A."],
                ["Routing Number", userData?.routingNumber || "021000021"],
                ["Account Number", userData?.accountNumber || "—"],
                ["Account Name", userData?.fullName || "—"],
              ].map(([k, v]) => (
                <div key={k}>
                  <p
                    style={{
                      margin: "0 0 2px",
                      fontSize: 11,
                      color: "#64748b",
                    }}
                  >
                    {k}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#0f172a",
                      fontFamily: k.includes("Number")
                        ? "monospace"
                        : "inherit",
                    }}
                  >
                    {v}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "13px 32px",
            borderRadius: 9,
            background: "#1a3c5e",
            color: "white",
            fontWeight: 700,
            fontSize: 15,
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Submitting…" : "Submit Deposit Request"}
        </button>
      </form>
    </div>
  );
}
