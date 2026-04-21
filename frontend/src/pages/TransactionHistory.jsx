import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import API from "../api";
import TransactionTable from "../components/Dashboard/TransactionTable";

export default function TransactionHistory() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 20;

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params = { page, limit: LIMIT };
        if (filter !== "all") params.type = filter;
        const res = await API.get("/api/banking/transactions", { params });
        setTransactions(res.data.transactions);
        setTotal(res.data.total);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [page, filter]);

  const filtered = search
    ? transactions.filter(
        (tx) =>
          tx.recipientName?.toLowerCase().includes(search.toLowerCase()) ||
          tx.memo?.toLowerCase().includes(search.toLowerCase()) ||
          tx.type?.includes(search.toLowerCase()) ||
          tx.amount?.toString().includes(search),
      )
    : transactions;

  const filters = [
    { value: "all", label: "All" },
    { value: "deposit", label: "Deposits" },
    { value: "withdrawal", label: "Withdrawals" },
    { value: "transfer_out", label: "Transfers Out" },
    { value: "transfer_in", label: "Transfers In" },
  ];

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div style={{ maxWidth: 900 }}>
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
          transition: "color 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#1a3c5e")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
      >
        <ArrowLeft size={15} /> Back to Dashboard
      </button>

      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            margin: "0 0 4px",
            fontSize: 22,
            fontWeight: 800,
            color: "#0f172a",
          }}
        >
          Transaction History
        </h1>
        <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>
          {total} total transactions
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 20,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                setFilter(f.value);
                setPage(1);
              }}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                border: `1.5px solid ${filter === f.value ? "#1a3c5e" : "#e2e8f0"}`,
                background: filter === f.value ? "#1a3c5e" : "white",
                color: filter === f.value ? "white" : "#374151",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div style={{ position: "relative", marginLeft: "auto" }}>
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
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "8px 12px 8px 30px",
              borderRadius: 8,
              border: "1.5px solid #e2e8f0",
              fontSize: 13,
              outline: "none",
              width: 200,
              color: "#0f172a",
              background: "white",
            }}
          />
        </div>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div
            style={{
              padding: "60px",
              textAlign: "center",
              color: "#94a3b8",
              fontSize: 14,
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                border: "3px solid #e2e8f0",
                borderTopColor: "#1a3c5e",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 12px",
              }}
            />
            Loading…
          </div>
        ) : (
          <TransactionTable transactions={filtered} />
        )}
      </div>

      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            marginTop: 20,
          }}
        >
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: "7px 14px",
              borderRadius: 7,
              border: "1px solid #e2e8f0",
              background: "white",
              fontSize: 13,
              cursor: page === 1 ? "not-allowed" : "pointer",
              opacity: page === 1 ? 0.4 : 1,
              fontWeight: 500,
            }}
          >
            ← Prev
          </button>
          <span style={{ fontSize: 13, color: "#64748b" }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              padding: "7px 14px",
              borderRadius: 7,
              border: "1px solid #e2e8f0",
              background: "white",
              fontSize: 13,
              cursor: page === totalPages ? "not-allowed" : "pointer",
              opacity: page === totalPages ? 0.4 : 1,
              fontWeight: 500,
            }}
          >
            Next →
          </button>
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
