import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import API from './api';
import LandingPage from './pages/LandingPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import AboutUs from './pages/AboutUs';
import FAQ from './pages/FAQ';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import AdminUserView from './pages/AdminUserView';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
};

const NO_CHROME = ['/dashboard', '/admin', '/signin', '/signup', '/forgot-password'];
const hasNoChrome = (path) => NO_CHROME.some(r => path.startsWith(r));

const Spinner = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: 36, height: 36, border: '3px solid #e2e8f0', borderTopColor: '#1a3c5e', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
      <p style={{ fontSize: 13, color: '#64748b' }}>Loading…</p>
    </div>
    <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
  </div>
);

const AnimatedRoutes = ({ user, loading, onRefresh }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const noChrome = hasNoChrome(location.pathname);

  // Admin guard — wait for user to load before deciding
  const AdminGuard = ({ children }) => {
    if (!token) return <Navigate to="/signin" />;
    if (loading) return <Spinner />;
    if (user?.role === 'admin') return children;
    return <Navigate to="/dashboard" />;
  };

  // Auth guard — wait for user before redirecting
  const AuthGuard = ({ children }) => {
    if (loading) return <Spinner />;
    if (token) return <Navigate to="/dashboard" />;
    return children;
  };

  return (
    <>
      {!noChrome && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={token && !loading ? <Navigate to="/dashboard" /> : <LandingPage />} />
          <Route path="/signin" element={<AuthGuard><SignIn onLogin={onRefresh} /></AuthGuard>} />
          <Route path="/signup" element={<AuthGuard><SignUp /></AuthGuard>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/dashboard/*" element={token ? <Dashboard user={user} onRefresh={onRefresh} /> : <Navigate to="/signin" />} />
          <Route path="/admin" element={<AdminGuard><AdminPanel /></AdminGuard>} />
          <Route path="/admin/user/:userId" element={<AdminGuard><AdminUserView /></AdminGuard>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AnimatePresence>
      {!noChrome && <Footer />}
    </>
  );
};

const AppContent = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); setUser(null); return; }
    try {
      const res = await API.get('/api/auth/profile');
      setUser(res.data);
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  if (loading) return <Spinner />;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AnimatedRoutes user={user} loading={loading} onRefresh={refresh} />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}