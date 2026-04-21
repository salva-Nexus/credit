// frontend/src/components/PageTransition.jsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/': 'Bulls Market — Institutional Digital Asset Management',
  '/about': 'About Us — Bulls Market',
  '/faq': 'FAQ — Bulls Market',
  '/signin': 'Sign In — Bulls Market',
  '/signup': 'Create Account — Bulls Market',
  '/dashboard': 'Dashboard — Bulls Market',
  '/admin-panel': 'Admin Panel — Bulls Market',
  '/terms': 'Terms of Service — Bulls Market',
  '/privacy': 'Privacy Policy — Bulls Market',
  '/forgot-password': 'Reset Password — Bulls Market',
  '/reset-password': 'New Password — Bulls Market',
};

const PageTransition = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    const title = pageTitles[location.pathname] || 'Bulls Market';
    document.title = title;
  }, [location.pathname]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;