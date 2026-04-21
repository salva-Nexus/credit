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

export default function WithdrawPage({ userData, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("wire");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [memo, setMemo] = useState("");
  const [focused, setFocused] = useState({});
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const methods = [
    { id: "wire", label: "Wire Transfer", desc: "1–3 business days" },
    { id: "ach", label: "ACH Transfer", desc: "2–3 business days" },
    { id: "check", label: "Check by Mail", desc: "5–7 business days" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (num <= 0)
      return setStatus({ type: "error", msg: "Enter a valid amount." });
    if (num > (userData?.balance || 0))
      return setStatus({ type: "error", msg: "Insufficient funds." });
    setLoading(true);
    setStatus({ type: "", msg: "" });
    try {
      await API.post("/api/banking/withdraw", {
        amount: num,
        method: methods.find((m) => m.id === method)?.label,
        bankName,
        accountNumber,
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
            Withdrawal Request Submitted
          </h2>
          <p
            style={{
              margin: "0 0 24px",
              fontSize: 14,
              color: "#64748b",
              lineHeight: 1.6,
            }}
          >
            Your withdrawal of{" "}
            <strong>${Number(amount).toLocaleString()}</strong> is being
            processed. Funds will be sent within 1–3 business days.
          </p>
          <button
            onClick={() => {
              setDone(false);
              setAmount("");
              setBankName("");
              setAccountNumber("");
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
            Make Another Withdrawal
          </button>
        </motion.div>
      </div>
    );

  return (
    <div style={{ maxWidth: 540 }}>
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            margin: "0 0 6px",
            fontSize: 22,
            fontWeight: 800,
            color: "#0f172a",
          }}
        >
          Withdraw Funds
        </h1>
        <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>
          Available:{" "}
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

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 18 }}
      >
        {/* Method */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 600,
              color: "#374151",
              marginBottom: 8,
            }}
          >
            Withdrawal Method
          </label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {methods.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                style={{
                  flex: 1,
                  minWidth: 130,
                  padding: "12px",
                  borderRadius: 9,
                  border: `2px solid ${method === m.id ? "#1a3c5e" : "#e2e8f0"}`,
                  background: method === m.id ? "#eff6ff" : "white",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                <p
                  style={{
                    margin: "0 0 2px",
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
        <div>
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
          {Number(amount) > (userData?.balance || 0) && (
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#dc2626" }}>
              Amount exceeds available balance.
            </p>
          )}
        </div>

        {/* Bank details */}
        {method !== "check" && (
          <>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 6,
                }}
              >
                Destination Bank Name
              </label>
              <input
                required
                placeholder="Bank of America"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                style={inp(focused.bankName)}
                onFocus={() => setFocused((f) => ({ ...f, bankName: true }))}
                onBlur={() => setFocused((f) => ({ ...f, bankName: false }))}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 6,
                }}
              >
                Account Number
              </label>
              <input
                required
                placeholder="Your account number at destination bank"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                style={inp(focused.accountNumber)}
                onFocus={() =>
                  setFocused((f) => ({ ...f, accountNumber: true }))
                }
                onBlur={() =>
                  setFocused((f) => ({ ...f, accountNumber: false }))
                }
              />
            </div>
          </>
        )}

        {method === "check" && (
          <div
            style={{
              padding: "14px",
              borderRadius: 9,
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
            }}
          >
            <p
              style={{
                margin: "0 0 4px",
                fontSize: 13,
                fontWeight: 600,
                color: "#0f172a",
              }}
            >
              Check Mailing Address
            </p>
            <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
              {userData?.address
                ? `${userData.address}, ${userData.city}, ${userData.state} ${userData.zipCode}`
                : "No address on file. Please update your profile first."}
            </p>
          </div>
        )}

        <div>
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 600,
              color: "#374151",
              marginBottom: 6,
            }}
          >
            Note (optional)
          </label>
          <input
            placeholder="e.g. Personal withdrawal"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            style={inp(focused.memo)}
            onFocus={() => setFocused((f) => ({ ...f, memo: true }))}
            onBlur={() => setFocused((f) => ({ ...f, memo: false }))}
          />
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
          }}
        >
          {loading ? "Submitting…" : "Request Withdrawal"}
        </button>
      </form>
    </div>
  );
}
