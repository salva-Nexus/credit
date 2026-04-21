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

// Routes that should have NO navbar/footer (full-page layouts)
const NO_CHROME_ROUTES = ['/dashboard', '/admin', '/signin', '/signup', '/forgot-password'];
const hasNoChrome = (path) => NO_CHROME_ROUTES.some(r => path.startsWith(r));

const LoadingScreen = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: 36, height: 36, border: '3px solid #e2e8f0', borderTopColor: '#1a3c5e', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
      <p style={{ fontSize: 13, color: '#64748b' }}>Loading…</p>
    </div>
    <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
  </div>
);

const AnimatedRoutes = ({ user, onRefresh }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const noChrome = hasNoChrome(location.pathname);

  return (
    <>
      {!noChrome && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={token ? <Navigate to="/dashboard" /> : <LandingPage />} />
          <Route path="/signin" element={token ? <Navigate to="/dashboard" /> : <SignIn onLogin={onRefresh} />} />
          <Route path="/signup" element={token ? <Navigate to="/dashboard" /> : <SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/dashboard/*" element={token ? <Dashboard user={user} onRefresh={onRefresh} /> : <Navigate to="/signin" />} />
          <Route path="/admin" element={!token ? <Navigate to="/signin" /> : user === null ? <LoadingScreen /> : user.role === 'admin' ? <AdminPanel /> : <Navigate to="/dashboard" />} />
          <Route path="/admin/user/:userId" element={!token ? <Navigate to="/signin" /> : user === null ? <LoadingScreen /> : user.role === 'admin' ? <AdminUserView /> : <Navigate to="/dashboard" />} />
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
  const token = localStorage.getItem('token');

  const refresh = useCallback(async () => {
    if (!token) { setLoading(false); return; }
    try {
      const res = await API.get('/api/auth/profile');
      setUser(res.data);
    } catch {
      localStorage.removeItem('token');
      setUser(null);
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { refresh(); }, [refresh]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #e2e8f0', borderTopColor: '#1a3c5e', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Loading Credit Vault…</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AnimatedRoutes user={user} onRefresh={refresh} />
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