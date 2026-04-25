import React, { useState, useEffect, useCallback, useRef } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Menu, LogOut, Settings, ChevronDown } from "lucide-react";
import API from "../api";
import Sidebar from "../components/Dashboard/Sidebar";
import StatsGrid from "../components/Dashboard/StatsGrid";
import TransactionTable from "../components/Dashboard/TransactionTable";
import TransferPage from "./TransferPage";
import TransactionHistory from "./TransactionHistory";
import ProfilePage from "./ProfilePage";
import SupportWidget from "../components/SupportWidget";

const IDLE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

const Overview = ({ userData, onRefresh }) => {
  const navigate = useNavigate();
  const firstName = userData?.fullName?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            margin: "0 0 4px",
            fontSize: 22,
            fontWeight: 800,
            color: "#0f172a",
          }}
        >
          {greeting}, {firstName} 👋
        </h1>
        <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      <StatsGrid userData={userData} />

      <div
        style={{
          marginTop: 24,
          padding: "28px 32px",
          borderRadius: 16,
          background: "linear-gradient(135deg, #1a3c5e 0%, #0f2847 100%)",
          color: "white",
          boxShadow: "0 8px 30px rgba(26,60,94,0.25)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            right: 80,
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.03)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: 24 }}>
            <p
              style={{
                margin: "0 0 2px",
                fontSize: 11,
                color: "rgba(255,255,255,0.5)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Credit Vault
            </p>
            <p
              style={{
                margin: "0 0 16px",
                fontSize: 14,
                color: "rgba(255,255,255,0.65)",
              }}
            >
              {userData?.accountType === "savings"
                ? "Savings Account"
                : "Checking Account"}
            </p>
            <p
              style={{
                margin: "0 0 4px",
                fontSize: 12,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Available Balance
            </p>
            <p
              style={{
                margin: "0 0 20px",
                fontSize: 34,
                fontWeight: 900,
                letterSpacing: "-1px",
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1,
              }}
            >
              $
              {(userData?.balance || 0).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.07)",
                  borderRadius: 10,
                  padding: "10px 14px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 5px",
                    fontSize: 10,
                    color: "rgba(255,255,255,0.4)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Account No.
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    fontFamily: "monospace",
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.9)",
                    letterSpacing: "0.06em",
                  }}
                >
                  {userData?.accountNumber
                    ? `${userData.accountNumber.slice(0, 4)} ${userData.accountNumber.slice(4, 7)}X XXXX`
                    : "—"}
                </p>
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.07)",
                  borderRadius: 10,
                  padding: "10px 14px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 5px",
                    fontSize: 10,
                    color: "rgba(255,255,255,0.4)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Routing No.
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    fontFamily: "monospace",
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.9)",
                    letterSpacing: "0.06em",
                  }}
                >
                  {userData?.routingNumber || "021000021"}
                </p>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/dashboard/transfer")}
              style={{
                padding: "9px 20px",
                borderRadius: 8,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.22)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
              }
            >
              ↔ Transfer
            </button>
            <button
              onClick={() => navigate("/dashboard/history")}
              style={{
                padding: "9px 20px",
                borderRadius: 8,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.22)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
              }
            >
              ☰ History
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 24,
          padding: "24px",
          borderRadius: 14,
          background: "white",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 18,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            Recent Transactions
          </h2>
          <button
            onClick={() => navigate("/dashboard/history")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              color: "#1a3c5e",
              fontWeight: 600,
            }}
          >
            View all →
          </button>
        </div>
        <TransactionTable
          transactions={userData?.transactions || []}
          limit={5}
        />
      </div>

      <div
        style={{
          marginTop: 18,
          padding: "13px 18px",
          borderRadius: 10,
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span>🔒</span>
        <p
          style={{ margin: 0, fontSize: 12, color: "#15803d", lineHeight: 1.5 }}
        >
          <strong>Your account is secure.</strong> All activity is monitored and
          protected with 256-bit AES encryption.
        </p>
      </div>
    </div>
  );
};

export default function Dashboard({ user: propUser, onRefresh }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(propUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notification, setNotification] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const idleTimer = useRef(null);

  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  const handleLogout = useCallback(() => {
    localStorage.clear();
    window.location.href = "/signin";
  }, []);

  // ── Auto-logout on inactivity ─────────────────────────────────────────────
  const resetIdleTimer = useCallback(() => {
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(handleLogout, IDLE_TIMEOUT);
  }, [handleLogout]);

  useEffect(() => {
    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];
    events.forEach((e) =>
      window.addEventListener(e, resetIdleTimer, { passive: true }),
    );
    resetIdleTimer(); // start on mount
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetIdleTimer));
      clearTimeout(idleTimer.current);
    };
  }, [resetIdleTimer]);

  const fetchData = useCallback(async () => {
    try {
      const res = await API.get("/api/auth/profile");
      setUserData(res.data);
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...stored, ...res.data }));
    } catch {}
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  useEffect(() => {
    if (propUser) setUserData(propUser);
  }, [propUser]);
  useEffect(() => {
    const fn = (e) => {
      if (!e.target.closest(".user-menu-wrap")) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const photo = userData?.profilePhoto;
  const initials = (userData?.fullName || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      {notification && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            padding: "12px 24px",
            borderRadius: 10,
            background: "#0f172a",
            color: "white",
            fontSize: 13,
            fontWeight: 600,
            boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
            whiteSpace: "nowrap",
          }}
        >
          ✓ {notification}
        </div>
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Topbar */}
        <div
          style={{
            padding: "0 24px",
            background: "white",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 50,
            height: 64,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setSidebarOpen(true)}
              className="mobile-menu-trigger"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 6,
                color: "#374151",
                display: "none",
              }}
            >
              <Menu size={22} />
            </button>
            <span
              className="mobile-logo"
              style={{
                display: "none",
                fontSize: 15,
                fontWeight: 900,
                color: "#0f172a",
              }}
            >
              Credit<span style={{ color: "#1a3c5e" }}>Vault</span>
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginLeft: "auto",
            }}
          >
            <div
              className="acct-chip"
              style={{
                padding: "5px 12px",
                borderRadius: 20,
                background: "#f1f5f9",
                border: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: "#64748b",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Acct
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  color: "#0f172a",
                  letterSpacing: "0.08em",
                }}
              >
                ···· {(userData?.accountNumber || "0000").slice(-4)}
              </span>
            </div>

            <div style={{ position: "relative" }} className="user-menu-wrap">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 10px 6px 6px",
                  borderRadius: 10,
                  background: "white",
                  border: `1.5px solid ${userMenuOpen ? "#1a3c5e" : "#e2e8f0"}`,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!userMenuOpen)
                    e.currentTarget.style.borderColor = "#94a3b8";
                }}
                onMouseLeave={(e) => {
                  if (!userMenuOpen)
                    e.currentTarget.style.borderColor = "#e2e8f0";
                }}
              >
                {photo ? (
                  <img
                    src={photo}
                    alt=""
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: "#1a3c5e",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 800,
                      color: "white",
                      flexShrink: 0,
                    }}
                  >
                    {initials}
                  </div>
                )}
                <div
                  className="user-name-block"
                  style={{ textAlign: "left", lineHeight: 1.3 }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#0f172a",
                      maxWidth: 120,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {userData?.fullName || "Account Holder"}
                  </p>
                  <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>
                    {userData?.accountType === "savings"
                      ? "Savings"
                      : "Checking"}
                  </p>
                </div>
                <ChevronDown
                  size={14}
                  color="#94a3b8"
                  style={{
                    transform: userMenuOpen ? "rotate(180deg)" : "none",
                    transition: "transform 0.2s",
                    flexShrink: 0,
                  }}
                />
              </button>

              {userMenuOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "calc(100% + 8px)",
                    width: 240,
                    background: "white",
                    borderRadius: 14,
                    boxShadow: "0 16px 50px rgba(0,0,0,0.12)",
                    border: "1px solid #e2e8f0",
                    overflow: "hidden",
                    zIndex: 200,
                  }}
                >
                  <div
                    style={{
                      padding: "14px 16px",
                      background: "#f8fafc",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 2px",
                        fontSize: 11,
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      Available Balance
                    </p>
                    <p
                      style={{
                        margin: "0 0 2px",
                        fontSize: 22,
                        fontWeight: 900,
                        color: "#1a3c5e",
                        letterSpacing: "-0.4px",
                      }}
                    >
                      $
                      {(userData?.balance || 0).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 11,
                        color: "#94a3b8",
                        fontFamily: "monospace",
                      }}
                    >
                      Acct ···· {(userData?.accountNumber || "0000").slice(-4)}
                    </p>
                  </div>
                  <div style={{ padding: "6px" }}>
                    {userData?.role === "admin" && (
                      <button
                        onClick={() => {
                          navigate("/admin");
                          setUserMenuOpen(false);
                        }}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "9px 12px",
                          borderRadius: 8,
                          background: "rgba(239,68,68,0.06)",
                          border: "none",
                          cursor: "pointer",
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#dc2626",
                          marginBottom: 4,
                          textAlign: "left",
                        }}
                      >
                        ⚡ Admin Panel
                      </button>
                    )}
                    <button
                      onClick={() => {
                        navigate("/dashboard/profile");
                        setUserMenuOpen(false);
                      }}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "9px 12px",
                        borderRadius: 8,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#374151",
                        transition: "background 0.15s",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#f1f5f9")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "none")
                      }
                    >
                      <Settings size={15} color="#64748b" /> Account Settings
                    </button>
                    <div
                      style={{
                        height: 1,
                        background: "#f1f5f9",
                        margin: "4px 0",
                      }}
                    />
                    <button
                      onClick={handleLogout}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "9px 12px",
                        borderRadius: 8,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#dc2626",
                        transition: "background 0.15s",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#fef2f2")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "none")
                      }
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <main
          style={{
            flex: 1,
            padding: "28px 24px",
            maxWidth: 1200,
            width: "100%",
            margin: "0 auto",
            boxSizing: "border-box",
          }}
        >
          <Routes>
            <Route
              index
              element={<Overview userData={userData} onRefresh={fetchData} />}
            />
            <Route
              path="transfer"
              element={
                <TransferPage
                  userData={userData}
                  onSuccess={() => {
                    fetchData();
                    notify("Transfer submitted successfully");
                  }}
                />
              }
            />
            <Route path="history" element={<TransactionHistory />} />
            <Route
              path="profile"
              element={
                <ProfilePage
                  userData={userData}
                  onUpdate={fetchData}
                  notify={notify}
                />
              }
            />
          </Routes>
        </main>
      </div>

      <SupportWidget />

      <style>{`
        @media(max-width:900px){
          .mobile-menu-trigger{display:flex!important}
          .mobile-logo{display:block!important}
          .acct-chip{display:none!important}
          .user-name-block{display:none!important}
          .desktop-sidebar{display:none!important}
        }
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>
    </div>
  );
}
