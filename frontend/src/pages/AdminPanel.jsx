import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  ArrowLeftRight,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  RefreshCw,
  ArrowLeft,
  Search,
} from "lucide-react";
import API from "../api";

const badge = (status) => {
  const map = {
    pending: { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
    completed: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
    failed: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
    approved: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
    rejected: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  };
  const s = map[status] || map.pending;
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        padding: "3px 9px",
        borderRadius: 20,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        textTransform: "capitalize",
      }}
    >
      {status}
    </span>
  );
};

export default function AdminPanel() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [txFilter, setTxFilter] = useState("pending");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [txLoading, setTxLoading] = useState({});

  const Spinner = () => (
    <div
      style={{
        width: 13,
        height: 13,
        border: "2px solid rgba(26,60,94,0.25)",
        borderTopColor: "#1a3c5e",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
        flexShrink: 0,
      }}
    />
  );

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [uRes, tRes] = await Promise.all([
        API.get("/api/admin/users"),
        API.get(
          `/api/admin/transactions${txFilter !== "all" ? `?status=${txFilter}` : ""}`,
        ),
      ]);
      setUsers(uRes.data);
      setTransactions(tRes.data);
    } catch (err) {
      console.error("Admin fetch error:", err.response?.data || err.message);
      showToast("Failed to load data. Check your admin role.");
    } finally {
      setLoading(false);
    }
  }, [txFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApprove = async (txId) => {
    setTxLoading((p) => ({ ...p, [txId]: "approve" }));
    try {
      await API.put(`/api/admin/transaction/${txId}/approve`);
      showToast("Transaction approved");
      fetchData();
    } catch {
      showToast("Failed to approve");
    } finally {
      setTxLoading((p) => {
        const n = { ...p };
        delete n[txId];
        return n;
      });
    }
  };

  const handleReject = async (txId) => {
    setTxLoading((p) => ({ ...p, [txId]: "reject" }));
    try {
      await API.put(`/api/admin/transaction/${txId}/reject`);
      showToast("Transaction rejected");
      fetchData();
    } catch {
      showToast("Failed to reject");
    } finally {
      setTxLoading((p) => {
        const n = { ...p };
        delete n[txId];
        return n;
      });
    }
  };

  const handleDelete = async (userId) => {
    try {
      await API.delete(`/api/admin/user/${userId}`);
      showToast("User deleted");
      setConfirmDelete(null);
      fetchData();
    } catch {
      showToast("Failed to delete user");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.accountNumber?.includes(search),
  );

  const cell = {
    padding: "14px 16px",
    fontSize: 13,
    color: "#374151",
    borderBottom: "1px solid #f1f5f9",
    verticalAlign: "middle",
  };
  const th = {
    padding: "10px 16px",
    fontSize: 11,
    fontWeight: 700,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    background: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            padding: "11px 24px",
            borderRadius: 10,
            background: "#0f172a",
            color: "white",
            fontSize: 13,
            fontWeight: 600,
            boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
          }}
        >
          {toast}
        </div>
      )}

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: 14,
              padding: 32,
              maxWidth: 380,
              width: "90%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            }}
          >
            <h3
              style={{
                margin: "0 0 10px",
                fontSize: 18,
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              Delete User?
            </h3>
            <p style={{ margin: "0 0 24px", fontSize: 14, color: "#64748b" }}>
              This will permanently delete the account and all associated data.
              This cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => handleDelete(confirmDelete)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 8,
                  background: "#dc2626",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 14,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 8,
                  border: "1.5px solid #e2e8f0",
                  background: "white",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div
        style={{
          background: "white",
          borderBottom: "1px solid #e2e8f0",
          padding: "0 28px",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
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
                padding: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#1a3c5e")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
            >
              <ArrowLeft size={15} /> Dashboard
            </button>
            <div style={{ width: 1, height: 18, background: "#e2e8f0" }} />
            <div>
              <span style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>
                Credit<span style={{ color: "#1a3c5e" }}>Vault</span>
              </span>
              <span
                style={{
                  marginLeft: 8,
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#dc2626",
                  background: "#fef2f2",
                  padding: "2px 8px",
                  borderRadius: 4,
                  textTransform: "uppercase",
                }}
              >
                Admin
              </span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: "#64748b" }}>
              {users.length} users · {transactions.length} transactions
            </span>
            <button
              onClick={fetchData}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 14px",
                borderRadius: 8,
                border: "1.5px solid #e2e8f0",
                background: "white",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                color: "#374151",
              }}
            >
              <RefreshCw size={13} /> Refresh
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 28px" }}>
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 4,
            marginBottom: 24,
            background: "white",
            borderRadius: 10,
            padding: 4,
            border: "1px solid #e2e8f0",
            width: "fit-content",
          }}
        >
          {[
            { id: "users", icon: Users, label: `Users (${users.length})` },
            {
              id: "transactions",
              icon: ArrowLeftRight,
              label: `Transfers (${transactions.length})`,
            },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "8px 18px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                transition: "all 0.15s",
                background: tab === id ? "#1a3c5e" : "transparent",
                color: tab === id ? "white" : "#64748b",
              }}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: 60,
              color: "#64748b",
              fontSize: 14,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                border: "3px solid #e2e8f0",
                borderTopColor: "#1a3c5e",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 12px",
              }}
            />
            Loading…
          </div>
        ) : tab === "users" ? (
          <div
            style={{
              background: "white",
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
                <Search
                  size={14}
                  style={{
                    position: "absolute",
                    left: 11,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                  }}
                />
                <input
                  placeholder="Search by name, email, account number…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px 8px 30px",
                    borderRadius: 8,
                    border: "1.5px solid #e2e8f0",
                    fontSize: 13,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {[
                      "Customer",
                      "Account",
                      "Balance",
                      "Type",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th key={h} style={th}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          ...cell,
                          textAlign: "center",
                          color: "#94a3b8",
                          padding: 40,
                        }}
                      >
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr
                        key={u._id}
                        style={{ transition: "background 0.1s" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#fafbff")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "white")
                        }
                      >
                        <td style={cell}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            {u.profilePhoto ? (
                              <img
                                src={u.profilePhoto}
                                alt=""
                                style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: "50%",
                                  background: "#1a3c5e",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 12,
                                  fontWeight: 700,
                                  color: "white",
                                  flexShrink: 0,
                                }}
                              >
                                {(u.fullName || "U")
                                  .split(" ")
                                  .map((w) => w[0])
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </div>
                            )}
                            <div>
                              <p
                                style={{
                                  margin: 0,
                                  fontWeight: 600,
                                  color: "#0f172a",
                                  fontSize: 13,
                                }}
                              >
                                {u.fullName}
                              </p>
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: 11,
                                  color: "#94a3b8",
                                }}
                              >
                                {u.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td style={cell}>
                          <p
                            style={{
                              margin: 0,
                              fontFamily: "monospace",
                              fontSize: 12,
                              color: "#374151",
                            }}
                          >
                            {u.accountNumber || "—"}
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 11,
                              color: "#94a3b8",
                            }}
                          >
                            Routing: {u.routingNumber || "021000021"}
                          </p>
                        </td>
                        <td style={cell}>
                          <p
                            style={{
                              margin: 0,
                              fontWeight: 700,
                              color: "#0f172a",
                            }}
                          >
                            $
                            {(u.balance || 0).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </p>
                          {u.savingsBalance > 0 && (
                            <p
                              style={{
                                margin: 0,
                                fontSize: 11,
                                color: "#16a34a",
                              }}
                            >
                              Savings: ${u.savingsBalance?.toLocaleString()}
                            </p>
                          )}
                        </td>
                        <td style={cell}>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              textTransform: "capitalize",
                            }}
                          >
                            {u.accountType || "checking"}
                          </span>
                        </td>
                        <td style={cell}>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 4,
                            }}
                          >
                            {badge(u.isVerified ? "completed" : "pending")}
                            {u.role === "admin" && (
                              <span
                                style={{
                                  fontSize: 10,
                                  fontWeight: 700,
                                  color: "#dc2626",
                                  background: "#fef2f2",
                                  padding: "2px 6px",
                                  borderRadius: 4,
                                  width: "fit-content",
                                }}
                              >
                                ADMIN
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={cell}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button
                              onClick={() => navigate(`/admin/user/${u._id}`)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 5,
                                padding: "6px 12px",
                                borderRadius: 7,
                                border: "1px solid #e2e8f0",
                                background: "white",
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: "pointer",
                                color: "#374151",
                              }}
                            >
                              <Eye size={12} /> View
                            </button>
                            <button
                              onClick={() => setConfirmDelete(u._id)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 5,
                                padding: "6px 10px",
                                borderRadius: 7,
                                border: "1px solid #fecaca",
                                background: "#fef2f2",
                                fontSize: 12,
                                cursor: "pointer",
                                color: "#dc2626",
                              }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Transactions tab */
          <div
            style={{
              background: "white",
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              {["pending", "completed", "failed", "all"].map((f) => (
                <button
                  key={f}
                  onClick={() => setTxFilter(f)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 20,
                    border: `1.5px solid ${txFilter === f ? "#1a3c5e" : "#e2e8f0"}`,
                    background: txFilter === f ? "#1a3c5e" : "white",
                    color: txFilter === f ? "white" : "#374151",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    textTransform: "capitalize",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {[
                      "User",
                      "Type",
                      "Amount",
                      "Recipient",
                      "Date",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th key={h} style={th}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        style={{
                          ...cell,
                          textAlign: "center",
                          color: "#94a3b8",
                          padding: 40,
                        }}
                      >
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => (
                      <tr
                        key={tx._id}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#fafbff")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "white")
                        }
                      >
                        <td style={cell}>
                          <p
                            style={{
                              margin: 0,
                              fontWeight: 600,
                              fontSize: 13,
                              color: "#0f172a",
                            }}
                          >
                            {tx.userId?.fullName || tx.userId?.email || "—"}
                          </p>
                        </td>
                        <td style={cell}>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              textTransform: "capitalize",
                              color: "#374151",
                            }}
                          >
                            {tx.type?.replace("_", " ")}
                          </span>
                        </td>
                        <td style={cell}>
                          <span
                            style={{
                              fontWeight: 700,
                              color:
                                tx.type === "deposit" ||
                                tx.type === "transfer_in"
                                  ? "#16a34a"
                                  : "#dc2626",
                              fontSize: 14,
                            }}
                          >
                            {tx.type === "deposit" || tx.type === "transfer_in"
                              ? "+"
                              : "-"}
                            $
                            {(tx.amount || 0).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </td>
                        <td style={cell}>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 12,
                              color: "#374151",
                            }}
                          >
                            {tx.recipientName || "—"}
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 11,
                              color: "#94a3b8",
                            }}
                          >
                            {tx.recipientBank || tx.recipientCountry || ""}
                          </p>
                        </td>
                        <td style={cell}>
                          <span style={{ fontSize: 12, color: "#64748b" }}>
                            {tx.date
                              ? new Date(tx.date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "—"}
                          </span>
                        </td>
                        <td style={cell}>{badge(tx.status || "pending")}</td>
                        <td style={cell}>
                          {tx.status === "pending" && (
                            <div style={{ display: "flex", gap: 6 }}>
                              <button
                                onClick={() => handleApprove(tx._id)}
                                disabled={!!txLoading[tx._id]}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                  padding: "5px 10px",
                                  borderRadius: 7,
                                  border: "1px solid #bbf7d0",
                                  background: "#f0fdf4",
                                  fontSize: 12,
                                  fontWeight: 600,
                                  cursor: txLoading[tx._id]
                                    ? "not-allowed"
                                    : "pointer",
                                  color: "#16a34a",
                                  minWidth: 82,
                                  justifyContent: "center",
                                  opacity:
                                    txLoading[tx._id] &&
                                    txLoading[tx._id] !== "approve"
                                      ? 0.5
                                      : 1,
                                }}
                              >
                                {txLoading[tx._id] === "approve" ? (
                                  <Spinner />
                                ) : (
                                  <CheckCircle size={12} />
                                )}
                                {txLoading[tx._id] === "approve"
                                  ? "Working…"
                                  : "Approve"}
                              </button>
                              <button
                                onClick={() => handleReject(tx._id)}
                                disabled={!!txLoading[tx._id]}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                  padding: "5px 10px",
                                  borderRadius: 7,
                                  border: "1px solid #fecaca",
                                  background: "#fef2f2",
                                  fontSize: 12,
                                  fontWeight: 600,
                                  cursor: txLoading[tx._id]
                                    ? "not-allowed"
                                    : "pointer",
                                  color: "#dc2626",
                                  minWidth: 72,
                                  justifyContent: "center",
                                  opacity:
                                    txLoading[tx._id] &&
                                    txLoading[tx._id] !== "reject"
                                      ? 0.5
                                      : 1,
                                }}
                              >
                                {txLoading[tx._id] === "reject" ? (
                                  <Spinner />
                                ) : (
                                  <XCircle size={12} />
                                )}
                                {txLoading[tx._id] === "reject"
                                  ? "Working…"
                                  : "Reject"}
                              </button>
                            </div>
                          )}
                          {tx.status !== "pending" && (
                            <span style={{ fontSize: 12, color: "#94a3b8" }}>
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
