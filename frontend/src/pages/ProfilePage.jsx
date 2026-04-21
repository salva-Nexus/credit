import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  Save,
  Lock,
  User,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle,
  Shield,
} from "lucide-react";
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
  transition: "border-color 0.2s",
});

const Section = ({ icon: Icon, title, children }) => (
  <div
    style={{
      background: "white",
      borderRadius: 12,
      border: "1px solid #e2e8f0",
      overflow: "hidden",
      marginBottom: 20,
    }}
  >
    <div
      style={{
        padding: "16px 22px",
        borderBottom: "1px solid #f1f5f9",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <Icon size={16} color="#1a3c5e" />
      <h2
        style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}
      >
        {title}
      </h2>
    </div>
    <div style={{ padding: "22px" }}>{children}</div>
  </div>
);

export default function ProfilePage({ userData, onUpdate, notify }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: userData?.fullName || "",
    phone: userData?.phone || "",
    address: userData?.address || "",
    city: userData?.city || "",
    state: userData?.state || "",
    zipCode: userData?.zipCode || "",
  });
  const [pw, setPw] = useState({ current: "", newPw: "", confirm: "" });
  const [showPw, setShowPw] = useState({
    current: false,
    newPw: false,
    confirm: false,
  });
  const [focused, setFocused] = useState({});
  const [photoLoading, setPhotoLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwStatus, setPwStatus] = useState({ type: "", msg: "" });
  const [pwDone, setPwDone] = useState(false);
  const fileRef = useRef();

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return notify("Photo must be under 5MB");
    setPhotoLoading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target.result;
      try {
        await API.put("/api/auth/profile", { profilePhoto: base64 });
        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem(
          "user",
          JSON.stringify({ ...stored, profilePhoto: base64 }),
        );
        onUpdate?.();
        notify("Profile photo updated");
      } catch {
        notify("Photo upload failed");
      } finally {
        setPhotoLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      await API.put("/api/auth/profile", form);
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...stored, ...form }));
      onUpdate?.();
      notify("Profile updated successfully");
    } catch {
      notify("Update failed");
    } finally {
      setSaveLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!pw.current)
      return setPwStatus({
        type: "error",
        msg: "Enter your current password.",
      });
    if (pw.newPw !== pw.confirm)
      return setPwStatus({ type: "error", msg: "Passwords do not match." });
    if (pw.newPw.length < 8)
      return setPwStatus({
        type: "error",
        msg: "New password must be at least 8 characters.",
      });
    setPwLoading(true);
    setPwStatus({ type: "", msg: "" });
    try {
      await API.post("/api/auth/change-password", {
        currentPassword: pw.current,
        newPassword: pw.newPw,
      });
      setPwDone(true);
      setPw({ current: "", newPw: "", confirm: "" });
      notify("Password updated successfully");
      setTimeout(() => setPwDone(false), 5000);
    } catch (err) {
      setPwStatus({
        type: "error",
        msg: err.response?.data?.msg || "Incorrect current password.",
      });
    } finally {
      setPwLoading(false);
    }
  };

  const photo = userData?.profilePhoto;
  const initials = (userData?.fullName || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div style={{ maxWidth: 700 }}>
      {/* Back button */}
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
          Account Settings
        </h1>
        <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>
          Manage your profile, security, and preferences
        </p>
      </div>

      {/* Photo + account info */}
      <div
        style={{
          background: "white",
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          padding: "24px",
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <div style={{ position: "relative" }}>
          {photo ? (
            <img
              src={photo}
              alt=""
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #e2e8f0",
              }}
            />
          ) : (
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "#1a3c5e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 800,
                color: "white",
                border: "3px solid #e2e8f0",
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
          )}
          <button
            onClick={() => fileRef.current?.click()}
            disabled={photoLoading}
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "#1a3c5e",
              border: "2px solid white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {photoLoading ? (
              <div
                style={{
                  width: 12,
                  height: 12,
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "white",
                  borderRadius: "50%",
                  animation: "spin 0.7s linear infinite",
                }}
              />
            ) : (
              <Camera size={13} color="white" />
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ display: "none" }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <p
            style={{
              margin: "0 0 2px",
              fontSize: 17,
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            {userData?.fullName}
          </p>
          <p style={{ margin: "0 0 10px", fontSize: 13, color: "#64748b" }}>
            {userData?.email}
          </p>
          <button
            onClick={() => fileRef.current?.click()}
            style={{
              padding: "7px 14px",
              borderRadius: 7,
              border: "1.5px solid #e2e8f0",
              background: "white",
              fontSize: 12,
              fontWeight: 600,
              color: "#374151",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Camera size={13} /> Change Photo
          </button>
        </div>

        <div
          style={{
            padding: "14px 18px",
            borderRadius: 10,
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            flexShrink: 0,
          }}
        >
          <div style={{ marginBottom: 10 }}>
            <p
              style={{
                margin: "0 0 2px",
                fontSize: 10,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Account Number
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                fontFamily: "monospace",
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              {userData?.accountNumber || "—"}
            </p>
          </div>
          <div>
            <p
              style={{
                margin: "0 0 2px",
                fontSize: 10,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Routing Number
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                fontFamily: "monospace",
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              {userData?.routingNumber || "021000021"}
            </p>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <Section icon={User} title="Personal Information">
        <form onSubmit={handleSave}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
              marginBottom: 14,
            }}
          >
            {[
              {
                key: "fullName",
                label: "Full Legal Name",
                placeholder: "John Smith",
              },
              {
                key: "phone",
                label: "Phone Number",
                placeholder: "+1 (555) 000-0000",
              },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: 5,
                  }}
                >
                  {label}
                </label>
                <input
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                  style={inp(focused[key])}
                  onFocus={() => setFocused((f) => ({ ...f, [key]: true }))}
                  onBlur={() => setFocused((f) => ({ ...f, [key]: false }))}
                />
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 14 }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "#374151",
                marginBottom: 5,
              }}
            >
              Street Address
            </label>
            <input
              placeholder="123 Main Street"
              value={form.address}
              onChange={(e) =>
                setForm((f) => ({ ...f, address: e.target.value }))
              }
              style={inp(focused.address)}
              onFocus={() => setFocused((f) => ({ ...f, address: true }))}
              onBlur={() => setFocused((f) => ({ ...f, address: false }))}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 14,
              marginBottom: 20,
            }}
          >
            {[
              { key: "city", label: "City", placeholder: "New York" },
              { key: "state", label: "State", placeholder: "NY" },
              { key: "zipCode", label: "ZIP Code", placeholder: "10001" },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: 5,
                  }}
                >
                  {label}
                </label>
                <input
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                  style={inp(focused[key])}
                  onFocus={() => setFocused((f) => ({ ...f, [key]: true }))}
                  onBlur={() => setFocused((f) => ({ ...f, [key]: false }))}
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            disabled={saveLoading}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 22px",
              borderRadius: 8,
              background: "#1a3c5e",
              color: "white",
              fontWeight: 600,
              fontSize: 14,
              border: "none",
              cursor: "pointer",
              opacity: saveLoading ? 0.7 : 1,
            }}
          >
            <Save size={15} /> {saveLoading ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </Section>

      {/* Change Password */}
      <Section icon={Lock} title="Change Password">
        {pwDone ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 16px",
              borderRadius: 9,
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
            }}
          >
            <CheckCircle size={18} color="#16a34a" style={{ flexShrink: 0 }} />
            <p
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 600,
                color: "#15803d",
              }}
            >
              Password updated successfully!
            </p>
          </div>
        ) : (
          <>
            {pwStatus.msg && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  marginBottom: 16,
                  fontSize: 13,
                  background: pwStatus.type === "error" ? "#fef2f2" : "#f0fdf4",
                  border: `1px solid ${pwStatus.type === "error" ? "#fecaca" : "#bbf7d0"}`,
                  color: pwStatus.type === "error" ? "#dc2626" : "#15803d",
                }}
              >
                {pwStatus.msg}
              </div>
            )}
            <form
              onSubmit={handlePasswordChange}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                maxWidth: 420,
              }}
            >
              {[
                {
                  key: "current",
                  label: "Current Password",
                  placeholder: "Enter your current password",
                },
                {
                  key: "newPw",
                  label: "New Password",
                  placeholder: "At least 8 characters",
                },
                {
                  key: "confirm",
                  label: "Confirm New Password",
                  placeholder: "Repeat new password",
                },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#374151",
                      marginBottom: 5,
                    }}
                  >
                    {label}
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPw[key] ? "text" : "password"}
                      required
                      placeholder={placeholder}
                      value={pw[key]}
                      onChange={(e) =>
                        setPw((p) => ({ ...p, [key]: e.target.value }))
                      }
                      style={{ ...inp(focused[`pw_${key}`]), paddingRight: 44 }}
                      onFocus={() =>
                        setFocused((f) => ({ ...f, [`pw_${key}`]: true }))
                      }
                      onBlur={() =>
                        setFocused((f) => ({ ...f, [`pw_${key}`]: false }))
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPw((s) => ({ ...s, [key]: !s[key] }))
                      }
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#94a3b8",
                      }}
                    >
                      {showPw[key] ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="submit"
                disabled={pwLoading}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 22px",
                  borderRadius: 8,
                  background: "#1a3c5e",
                  color: "white",
                  fontWeight: 600,
                  fontSize: 14,
                  border: "none",
                  cursor: "pointer",
                  opacity: pwLoading ? 0.7 : 1,
                  width: "fit-content",
                }}
              >
                <Lock size={15} /> {pwLoading ? "Updating…" : "Update Password"}
              </button>
            </form>
          </>
        )}

        {/* Security info */}
        <div
          style={{
            marginTop: 20,
            padding: "14px 16px",
            borderRadius: 9,
            background: "#f0f7ff",
            border: "1px solid #bfdbfe",
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
          }}
        >
          <Shield
            size={15}
            color="#1a3c5e"
            style={{ marginTop: 1, flexShrink: 0 }}
          />
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: "#1e40af",
              lineHeight: 1.6,
            }}
          >
            <strong>Two-Factor Authentication is active.</strong> Every login
            sends a verification code to <strong>{userData?.email}</strong>.
            This cannot be disabled for your security.
          </p>
        </div>
      </Section>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
