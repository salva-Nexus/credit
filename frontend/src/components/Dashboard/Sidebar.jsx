import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowRightLeft,
  History,
  User,
  LogOut,
  Shield,
  X,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
  { icon: ArrowRightLeft, label: "Transfer", path: "/dashboard/transfer" },
  { icon: History, label: "History", path: "/dashboard/history" },
  { icon: User, label: "Profile & Settings", path: "/dashboard/profile" },
];

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/signin";
  };

  const NavItem = ({ icon: Icon, label, path }) => {
    const active = location.pathname === path;
    return (
      <button
        onClick={() => {
          navigate(path);
          onClose?.();
        }}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 14px",
          borderRadius: 9,
          border: "none",
          cursor: "pointer",
          background: active ? "#1a3c5e" : "transparent",
          color: active ? "white" : "#475569",
          transition: "all 0.15s",
          textAlign: "left",
          marginBottom: 2,
        }}
        onMouseEnter={(e) => {
          if (!active) {
            e.currentTarget.style.background = "#f1f5f9";
            e.currentTarget.style.color = "#0f172a";
          }
        }}
        onMouseLeave={(e) => {
          if (!active) {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#475569";
          }
        }}
      >
        <Icon size={17} />
        <span style={{ fontSize: 14, fontWeight: active ? 600 : 500 }}>
          {label}
        </span>
      </button>
    );
  };

  const SidebarContent = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "24px 16px",
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 32,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              background: "linear-gradient(135deg, #1a3c5e, #0f2847)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="2" fill="white" />
              <line
                x1="12"
                y1="3"
                x2="12"
                y2="7"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="21"
                y1="12"
                x2="17"
                y2="12"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="12"
                y1="21"
                x2="12"
                y2="17"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="3"
                y1="12"
                x2="7"
                y2="12"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>
            Credit<span style={{ color: "#1a3c5e" }}>Vault</span>
          </span>
        </div>
        <button
          onClick={onClose}
          className="sidebar-close-btn"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            color: "#94a3b8",
            display: "none",
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* User summary */}
      <div
        style={{
          padding: "14px",
          borderRadius: 10,
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {user.profilePhoto ? (
            <img
              src={user.profilePhoto}
              alt=""
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "#1a3c5e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 800,
                color: "white",
                flexShrink: 0,
              }}
            >
              {(user.fullName || "U")
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
          )}
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 700,
                color: "#0f172a",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user.fullName || "Account Holder"}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>
              {user.accountType === "savings" ? "Savings" : "Checking"} ····{" "}
              {(user.accountNumber || "0000").slice(-4)}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1 }}>
        {navItems.map((item) => (
          <NavItem key={item.path} {...item} />
        ))}
        {user.role === "admin" && (
          <button
            onClick={() => {
              navigate("/admin");
              onClose?.();
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 14px",
              borderRadius: 9,
              border: "none",
              cursor: "pointer",
              background: "rgba(239,68,68,0.07)",
              color: "#dc2626",
              marginTop: 8,
              transition: "all 0.15s",
            }}
          >
            <Shield size={17} />
            <span style={{ fontSize: 14, fontWeight: 700 }}>Admin Panel</span>
          </button>
        )}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 14px",
          borderRadius: 9,
          border: "none",
          cursor: "pointer",
          background: "transparent",
          color: "#94a3b8",
          width: "100%",
          marginTop: 8,
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#fef2f2";
          e.currentTarget.style.color = "#dc2626";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#94a3b8";
        }}
      >
        <LogOut size={16} />
        <span style={{ fontSize: 14, fontWeight: 500 }}>Sign Out</span>
      </button>

      {/* FDIC badge */}
      <div
        style={{
          marginTop: 12,
          padding: "10px",
          borderRadius: 8,
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          textAlign: "center",
        }}
      >
        <p
          style={{ margin: 0, fontSize: 10, color: "#94a3b8", lineHeight: 1.5 }}
        >
          🔒 FDIC insured up to <strong>$250,000</strong>
        </p>
      </div>
    </div>
  );

  return (
    <>
      <div
        style={{
          width: 240,
          flexShrink: 0,
          borderRight: "1px solid #e2e8f0",
          minHeight: "100vh",
          background: "white",
        }}
        className="desktop-sidebar"
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflowY: "auto",
          }}
        >
          <SidebarContent />
        </div>
      </div>
      {isOpen && (
        <>
          <div
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.3)",
              zIndex: 150,
              backdropFilter: "blur(2px)",
            }}
          />
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: 260,
              height: "100vh",
              background: "white",
              zIndex: 160,
              boxShadow: "4px 0 30px rgba(0,0,0,0.15)",
              overflowY: "auto",
            }}
          >
            <SidebarContent />
          </div>
        </>
      )}
      <style>{`@media(max-width:900px){.desktop-sidebar{display:none!important}.sidebar-close-btn{display:flex!important}}`}</style>
    </>
  );
};

export default Sidebar;
