import React, { useEffect, useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import API from "./api";
import LandingPage from "./pages/LandingPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import AboutUs from "./pages/AboutUs";
import FAQ from "./pages/FAQ";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import AdminUserView from "./pages/AdminUserView";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    // Don't scroll to top if there's a hash — let the browser handle it
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash.replace("#", ""));
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
};

const NO_CHROME = [
  "/dashboard",
  "/admin",
  "/signin",
  "/signup",
  "/forgot-password",
];
const hasNoChrome = (path) => NO_CHROME.some((r) => path.startsWith(r));

const LoadingScreen = () => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f8fafc",
    }}
  >
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: 36,
          height: 36,
          border: "3px solid #e2e8f0",
          borderTopColor: "#1a3c5e",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          margin: "0 auto 12px",
        }}
      />
      <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>Loading…</p>
    </div>
    <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
  </div>
);

const AppRoutes = ({ user, authLoading, onRefresh }) => {
  const location = useLocation();
  const noChrome = hasNoChrome(location.pathname);
  const token = localStorage.getItem("token");

  return (
    <>
      {!noChrome && <Navbar />}
      <Routes location={location} key={location.pathname}>
        {/* Public pages — always accessible */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Auth pages — redirect to dashboard if already logged in */}
        <Route
          path="/signin"
          element={
            token ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <SignIn onLogin={onRefresh} />
            )
          }
        />
        <Route
          path="/signup"
          element={token ? <Navigate to="/dashboard" replace /> : <SignUp />}
        />

        {/* Protected dashboard */}
        <Route
          path="/dashboard/*"
          element={
            !token ? (
              <Navigate to="/signin" replace />
            ) : (
              <Dashboard user={user} onRefresh={onRefresh} />
            )
          }
        />

        {/* Admin — wait for auth to load before deciding */}
        <Route
          path="/admin"
          element={
            !token ? (
              <Navigate to="/signin" replace />
            ) : authLoading ? (
              <LoadingScreen />
            ) : user?.role === "admin" ? (
              <AdminPanel />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        <Route
          path="/admin/user/:userId"
          element={
            !token ? (
              <Navigate to="/signin" replace />
            ) : authLoading ? (
              <LoadingScreen />
            ) : user?.role === "admin" ? (
              <AdminUserView />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!noChrome && <Footer />}
    </>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const refresh = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthLoading(false);
      return;
    }
    try {
      const res = await API.get("/api/auth/profile");
      setUser(res.data);
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <Router>
      <ScrollToTop />
      <AppRoutes user={user} authLoading={authLoading} onRefresh={refresh} />
    </Router>
  );
}
