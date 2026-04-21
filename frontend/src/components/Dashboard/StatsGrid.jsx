import React, { useState, useEffect } from "react";
import { DollarSign, PiggyBank, Eye, EyeOff, Copy, Check } from "lucide-react";

const AnimatedNumber = ({ value }) => {
  const [disp, setDisp] = useState(0);

  useEffect(() => {
    const steps = 40;
    const dur = 900;
    let i = 0;
    const inc = value / steps;
    const t = setInterval(() => {
      i++;
      setDisp((v) => Math.min(v + inc, value));
      if (i >= steps) clearInterval(t);
    }, dur / steps);
    return () => clearInterval(t);
  }, [value]);

  return (
    <>
      $
      {disp.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </>
  );
};

const StatsGrid = ({ userData }) => {
  const fullAcct = userData?.accountNumber || "";
  const acctSuffix = fullAcct.slice(-4) || "0000";
  const isSavings = userData?.accountType === "savings";

  const [acctVisible, setAcctVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!fullAcct) return;
    navigator.clipboard.writeText(fullAcct).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // When visible: show full number formatted; when hidden: masked
  const displayAcct = acctVisible
    ? fullAcct.replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3")
    : `···· ${acctSuffix}`;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 14,
      }}
    >
      <div
        style={{
          padding: "24px",
          borderRadius: 12,
          background: "white",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 14,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 11,
              fontWeight: 700,
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {isSavings ? "Savings Balance" : "Checking Balance"}
          </p>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: isSavings ? "#dcfce7" : "#eff6ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isSavings ? (
              <PiggyBank size={16} color="#16a34a" />
            ) : (
              <DollarSign size={16} color="#1a3c5e" />
            )}
          </div>
        </div>

        {/* Balance */}
        <p
          style={{
            margin: "0 0 10px",
            fontSize: 30,
            fontWeight: 900,
            color: "#0f172a",
            letterSpacing: "-0.6px",
          }}
        >
          <AnimatedNumber value={userData?.balance || 0} />
        </p>

        {/* Account number row */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: "#94a3b8",
              fontFamily: "monospace",
              letterSpacing: "0.05em",
              userSelect: acctVisible ? "text" : "none",
            }}
          >
            Account {displayAcct}
          </p>

          {/* Eye toggle */}
          <button
            onClick={() => setAcctVisible((v) => !v)}
            title={
              acctVisible ? "Hide account number" : "Reveal account number"
            }
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "2px 4px",
              color: "#94a3b8",
              display: "flex",
              alignItems: "center",
              borderRadius: 4,
              transition: "color 0.15s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#1a3c5e")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
          >
            {acctVisible ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            title={copied ? "Copied!" : "Copy account number"}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "2px 4px",
              color: copied ? "#16a34a" : "#94a3b8",
              display: "flex",
              alignItems: "center",
              borderRadius: 4,
              transition: "color 0.15s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = copied ? "#16a34a" : "#1a3c5e")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = copied ? "#16a34a" : "#94a3b8")
            }
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatsGrid;
