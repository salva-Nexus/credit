import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Globe,
  MapPin,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import API from "../api";
import {
  COUNTRIES,
  getCountryFields,
} from "../components/Dashboard/countryFields";

const inp = (focused) => ({
  width: "100%",
  padding: "10px 13px",
  borderRadius: 7,
  fontSize: 14,
  background: "white",
  border: `1.5px solid ${focused ? "#1a3c5e" : "#e2e8f0"}`,
  color: "#0f172a",
  outline: "none",
  transition: "border-color 0.2s",
  fontFamily: "Inter, sans-serif",
  boxSizing: "border-box",
});

export default function TransferPage({ userData, onSuccess }) {
  const navigate = useNavigate();
  const [transferType, setTransferType] = useState("local");
  const [country, setCountry] = useState("US");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [fields, setFields] = useState({});
  const [focused, setFocused] = useState({});
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [submittedData, setSubmittedData] = useState({});

  const selectedCountry =
    COUNTRIES.find((c) => c.code === country) || COUNTRIES[0];
  const countryFields = getCountryFields(country);
  const isIntl = transferType === "international";
  const minAmount = isIntl ? 50000 : 1;

  const handleCountryChange = (code) => {
    setCountry(code);
    const c = COUNTRIES.find((x) => x.code === code);
    setTransferType(c?.type === "local" ? "local" : "international");
    setFields({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (num < minAmount) {
      return setStatus({
        type: "error",
        msg: isIntl
          ? "International transfers require a minimum of $50,000."
          : "Enter a valid amount.",
      });
    }
    if (num > (userData?.balance || 0)) {
      return setStatus({
        type: "error",
        msg: "Insufficient funds in your account.",
      });
    }
    setLoading(true);
    setStatus({ type: "", msg: "" });
    try {
      await API.post("/api/banking/transfer", {
        amount: num,
        transferType,
        recipientCountry: country,
        memo,
        ...fields,
      });
      setSubmittedData({
        amount: num,
        recipientName: fields.recipientName,
        country: selectedCountry.name,
      });
      setDone(true);
      onSuccess?.();
    } catch (err) {
      setStatus({
        type: "error",
        msg:
          err.response?.data?.msg ||
          "Transfer request failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (done)
    return (
      <div style={{ maxWidth: 560 }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            color: "#64748b",
            fontWeight: 500,
            marginBottom: 32,
            padding: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#1a3c5e")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
        >
          <ArrowLeft size={15} /> Back to Dashboard
        </button>
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            textAlign: "center",
            padding: "48px 32px",
            background: "white",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          }}
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
              margin: "0 0 12px",
              fontSize: 22,
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            Transfer Request Submitted
          </h2>
          <p
            style={{
              margin: "0 0 8px",
              fontSize: 15,
              color: "#374151",
              lineHeight: 1.6,
            }}
          >
            Your transfer of{" "}
            <strong>${submittedData.amount?.toLocaleString()}</strong>
            {submittedData.recipientName && (
              <>
                {" "}
                to <strong>{submittedData.recipientName}</strong>
              </>
            )}{" "}
            has been submitted successfully.
          </p>
          <p
            style={{
              margin: "0 0 32px",
              fontSize: 14,
              color: "#94a3b8",
              lineHeight: 1.6,
            }}
          >
            Our compliance team will review and process it within 1–2 business
            days. You will receive an email confirmation once it is approved and
            processed.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button
              onClick={() => {
                setDone(false);
                setAmount("");
                setFields({});
                setMemo("");
              }}
              style={{
                padding: "11px 24px",
                borderRadius: 9,
                background: "#1a3c5e",
                color: "white",
                fontWeight: 600,
                fontSize: 14,
                border: "none",
                cursor: "pointer",
              }}
            >
              Make Another Transfer
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                padding: "11px 24px",
                borderRadius: 9,
                border: "1.5px solid #e2e8f0",
                color: "#374151",
                fontWeight: 600,
                fontSize: 14,
                background: "white",
                cursor: "pointer",
              }}
            >
              Back to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );

  return (
    <div style={{ maxWidth: 700 }}>
      {/* Back */}
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: 13,
          color: "#64748b",
          fontWeight: 500,
          marginBottom: 24,
          padding: 0,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#1a3c5e")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
      >
        <ArrowLeft size={15} /> Back to Dashboard
      </button>

      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            margin: "0 0 6px",
            fontSize: 22,
            fontWeight: 800,
            color: "#0f172a",
          }}
        >
          Send Money
        </h1>
        <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>
          Available balance:{" "}
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
            marginBottom: 20,
            fontSize: 13,
            fontWeight: 500,
            background: status.type === "error" ? "#fef2f2" : "#f0fdf4",
            border: `1px solid ${status.type === "error" ? "#fecaca" : "#bbf7d0"}`,
            color: status.type === "error" ? "#dc2626" : "#15803d",
          }}
        >
          {status.msg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Transfer type */}
        <div style={{ marginBottom: 22 }}>
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 600,
              color: "#374151",
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Transfer Type
          </label>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            {[
              {
                type: "local",
                icon: MapPin,
                label: "Domestic Transfer",
                sub: "Within the United States",
              },
              {
                type: "international",
                icon: Globe,
                label: "International Wire",
                sub: "Minimum $50,000 USD",
              },
            ].map(({ type, icon: Icon, label, sub }) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setTransferType(type);
                  if (type === "local") setCountry("US");
                  else if (country === "US") setCountry("GB");
                  setFields({});
                }}
                style={{
                  padding: "16px",
                  borderRadius: 10,
                  border: `2px solid ${transferType === type ? "#1a3c5e" : "#e2e8f0"}`,
                  background: transferType === type ? "#eff6ff" : "white",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <Icon
                    size={15}
                    color={transferType === type ? "#1a3c5e" : "#94a3b8"}
                  />
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: transferType === type ? "#1a3c5e" : "#374151",
                    }}
                  >
                    {label}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>
                  {sub}
                </p>
              </button>
            ))}
          </div>
        </div>

        {isIntl && (
          <div
            style={{
              padding: "12px 14px",
              borderRadius: 9,
              background: "#fffbeb",
              border: "1px solid #fde68a",
              display: "flex",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <AlertTriangle
              size={15}
              color="#d97706"
              style={{ marginTop: 1, flexShrink: 0 }}
            />
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: "#92400e",
                lineHeight: 1.5,
              }}
            >
              <strong>International Wire:</strong> Minimum $50,000 USD.
              Processing takes 1–2 business days. Compliance review applies.
            </p>
          </div>
        )}

        {/* Country — international only */}
        {isIntl && (
          <div style={{ marginBottom: 18 }}>
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
              Recipient's Country
            </label>
            <select
              value={country}
              onChange={(e) => handleCountryChange(e.target.value)}
              style={inp(false)}
            >
              {COUNTRIES.filter((c) => c.type === "international").map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Amount */}
        <div style={{ marginBottom: 18 }}>
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
            Amount (USD)
          </label>
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: 13,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 18,
                fontWeight: 700,
                color: "#94a3b8",
              }}
            >
              $
            </span>
            <input
              type="number"
              required
              min={minAmount}
              step="0.01"
              placeholder={isIntl ? "50,000.00" : "100.00"}
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
          {isIntl && Number(amount) > 0 && Number(amount) < 50000 && (
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#dc2626" }}>
              Minimum $50,000 for international transfers
            </p>
          )}
          {Number(amount) > (userData?.balance || 0) && Number(amount) > 0 && (
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#dc2626" }}>
              Amount exceeds your available balance
            </p>
          )}
        </div>

        {/* Country-specific fields */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 14,
            marginBottom: 18,
          }}
        >
          {countryFields.map((field) => (
            <div key={field.name}>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: field.hint ? 3 : 5,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {field.label}{" "}
                {field.required && <span style={{ color: "#dc2626" }}>*</span>}
              </label>
              {field.hint && (
                <p
                  style={{ margin: "0 0 5px", fontSize: 11, color: "#94a3b8" }}
                >
                  {field.hint}
                </p>
              )}
              {field.type === "select" ? (
                <select
                  value={fields[field.name] || ""}
                  onChange={(e) =>
                    setFields((f) => ({ ...f, [field.name]: e.target.value }))
                  }
                  required={field.required}
                  style={inp(false)}
                >
                  <option value="">Select…</option>
                  {field.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder={field.placeholder}
                  value={fields[field.name] || ""}
                  onChange={(e) =>
                    setFields((f) => ({ ...f, [field.name]: e.target.value }))
                  }
                  required={field.required}
                  style={inp(focused[field.name])}
                  onFocus={() =>
                    setFocused((f) => ({ ...f, [field.name]: true }))
                  }
                  onBlur={() =>
                    setFocused((f) => ({ ...f, [field.name]: false }))
                  }
                />
              )}
            </div>
          ))}
        </div>

        {/* Memo */}
        <div style={{ marginBottom: 28 }}>
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
            Memo / Reference{" "}
            <span
              style={{
                color: "#94a3b8",
                textTransform: "none",
                letterSpacing: 0,
                fontWeight: 400,
              }}
            >
              (optional)
            </span>
          </label>
          <input
            type="text"
            placeholder="e.g. Invoice #1234, Rent payment, Family support"
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
            padding: "14px 36px",
            borderRadius: 9,
            background: "#1a3c5e",
            color: "white",
            fontWeight: 700,
            fontSize: 15,
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.background = "#0f2847";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#1a3c5e";
          }}
        >
          {loading ? "Submitting…" : "Request Transfer →"}
        </button>
      </form>
    </div>
  );
}
