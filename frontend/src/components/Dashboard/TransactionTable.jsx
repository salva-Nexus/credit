import React from "react";

const typeConfig = {
  deposit: { label: "Deposit", color: "#16a34a", bg: "#f0fdf4", symbol: "+" },
  withdrawal: {
    label: "Withdrawal",
    color: "#dc2626",
    bg: "#fef2f2",
    symbol: "-",
  },
  transfer_out: {
    label: "Transfer Out",
    color: "#d97706",
    bg: "#fffbeb",
    symbol: "-",
  },
  transfer_in: {
    label: "Transfer In",
    color: "#2563eb",
    bg: "#eff6ff",
    symbol: "+",
  },
  fee: { label: "Fee", color: "#64748b", bg: "#f8fafc", symbol: "-" },
};

const statusConfig = {
  completed: { label: "Completed", color: "#16a34a", bg: "#f0fdf4" },
  pending: { label: "Pending", color: "#d97706", bg: "#fffbeb" },
  failed: { label: "Failed", color: "#dc2626", bg: "#fef2f2" },
  cancelled: { label: "Cancelled", color: "#64748b", bg: "#f8fafc" },
};

const TransactionTable = ({ transactions = [], limit }) => {
  const data = limit ? transactions.slice(0, limit) : transactions;

  if (!data.length)
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
        <p style={{ margin: 0, fontSize: 14 }}>No transactions yet</p>
      </div>
    );

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{ width: "100%", borderCollapse: "collapse", minWidth: 540 }}
      >
        <thead>
          <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
            {["Description", "Date", "Amount", "Status"].map((h) => (
              <th
                key={h}
                style={{
                  padding: "10px 16px",
                  textAlign:
                    h === "Amount" || h === "Status" ? "right" : "left",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  whiteSpace: "nowrap",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((tx, i) => {
            const cfg = typeConfig[tx.type] || typeConfig.deposit;
            const sCfg = statusConfig[tx.status] || statusConfig.pending;
            return (
              <tr
                key={tx._id || i}
                style={{
                  borderBottom: "1px solid #f1f5f9",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f8fafc")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <td style={{ padding: "14px 16px" }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 9,
                        background: cfg.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 16,
                          color: cfg.color,
                          fontWeight: 700,
                        }}
                      >
                        {cfg.symbol}
                      </span>
                    </div>
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#0f172a",
                        }}
                      >
                        {tx.recipientName
                          ? `To: ${tx.recipientName}`
                          : cfg.label}
                      </p>
                      <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>
                        {tx.memo || tx.method || tx.recipientBank || cfg.label}
                      </p>
                    </div>
                  </div>
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    fontSize: 12,
                    color: "#64748b",
                    whiteSpace: "nowrap",
                  }}
                >
                  {new Date(tx.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    textAlign: "right",
                    fontWeight: 700,
                    fontSize: 14,
                    color: cfg.color,
                    fontVariantNumeric: "tabular-nums",
                    whiteSpace: "nowrap",
                  }}
                >
                  {cfg.symbol}$
                  {tx.amount?.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td style={{ padding: "14px 16px", textAlign: "right" }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "3px 10px",
                      borderRadius: 20,
                      background: sCfg.bg,
                      color: sCfg.color,
                    }}
                  >
                    {sCfg.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
