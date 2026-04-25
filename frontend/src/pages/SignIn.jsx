import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Shield } from 'lucide-react';
import API from '../api';

const inp = (focused) => ({
  width: '100%', padding: '12px 14px', borderRadius: 8, fontSize: 14,
  background: '#f8fafc', border: `1.5px solid ${focused ? '#1a3c5e' : '#e2e8f0'}`,
  color: '#0f172a', outline: 'none', transition: 'border-color 0.2s',
  fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
});

export default function SignIn({ onLogin }) {
  const [step, setStep] = useState(1); // 1 = credentials, 2 = OTP
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showPw, setShowPw] = useState(false);
  const [focused, setFocused] = useState({});
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);
  // For unverified accounts
  const [needsVerify, setNeedsVerify] = useState(false);
  const [verifyOtp, setVerifyOtp] = useState(['', '', '', '', '', '']);
  const navigate = useNavigate();

  const otpValue = otp.join('');
  const verifyOtpValue = verifyOtp.join('');

  const handleOtpChange = (arr, setArr, index, val, prefix = 'otp') => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next = [...arr];
    next[index] = digit;
    setArr(next);
    if (digit && index < 5) document.getElementById(`${prefix}-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (arr, setArr, index, e) => {
    if (e.key === 'Backspace' && !arr[index] && index > 0)
      document.getElementById(`otp-${index - 1}`)?.focus();
  };

  const handleOtpPaste = (setArr, e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setArr(pasted.split(''));
      document.getElementById('otp-5')?.focus();
    }
  };

  const StatusBox = () => status.msg ? (
    <div style={{ padding: '11px 14px', borderRadius: 8, marginBottom: 18, fontSize: 13, fontWeight: 500,
      background: status.type === 'success' ? '#f0fdf4' : '#fef2f2',
      border: `1px solid ${status.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
      color: status.type === 'success' ? '#15803d' : '#dc2626' }}>
      {status.msg}
    </div>
  ) : null;

  const renderOtpBoxes = (arr, setArr, prefix = 'otp') => (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20 }}
      onPaste={(e) => handleOtpPaste(setArr, e)}>
      {arr.map((digit, i) => (
        <input key={i} id={`${prefix}-${i}`} type="text" inputMode="numeric" maxLength={1}
          value={digit}
          onChange={e => handleOtpChange(arr, setArr, i, e.target.value, prefix)}
          onKeyDown={e => handleOtpKeyDown(arr, setArr, i, e)}
          autoFocus={i === 0}
          style={{
            width: 52, height: 60, borderRadius: 10, textAlign: 'center',
            fontSize: 24, fontWeight: 800, fontFamily: 'monospace',
            border: `2px solid ${digit ? '#1a3c5e' : '#e2e8f0'}`,
            background: digit ? '#eff6ff' : 'white',
            color: '#0f172a', outline: 'none', transition: 'all 0.15s',
            boxShadow: digit ? '0 0 0 3px rgba(26,60,94,0.1)' : 'none',
          }} />
      ))}
    </div>
  );

  // Step 1 — email + password
  const handleLogin = async e => {
    e.preventDefault();
    setLoading(true); setStatus({ type: '', msg: '' });
    try {
      const res = await API.post('/api/auth/login', { email, password });
      if (res.data.needsVerification) {
        setNeedsVerify(true);
        setStatus({ type: 'error', msg: res.data.msg });
      } else if (res.data.token) {
        // Admin — no OTP, straight to dashboard
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        await onLogin?.();
        navigate('/dashboard');
      } else if (res.data.requiresOtp) {
        setStatus({ type: 'success', msg: res.data.msg });
        setStep(2);
      }
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.msg || 'Invalid email or password.' });
    } finally { setLoading(false); }
  };

  // Step 2 — login OTP
  const handleOtpSubmit = async e => {
    e.preventDefault();
    setLoading(true); setStatus({ type: '', msg: '' });
    try {
      const res = await API.post('/api/auth/verify-login-otp', { email, otp: otpValue });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      await onLogin?.();
      navigate('/dashboard');
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.msg || 'Invalid code.' });
    } finally { setLoading(false); }
  };

  // Verify unverified account
  const handleVerifyAccount = async e => {
    e.preventDefault();
    setLoading(true); setStatus({ type: '', msg: '' });
    try {
      await API.post('/api/auth/verify-otp', { email, otp: verifyOtpValue });
      setStatus({ type: 'success', msg: 'Account verified! Signing you in…' });
      // Now trigger login OTP
      const res = await API.post('/api/auth/login', { email, password });
      if (res.data.requiresOtp) {
        setNeedsVerify(false);
        setStep(2);
        setStatus({ type: 'success', msg: 'Account verified! Check your email for a login code.' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.msg || 'Invalid code.' });
    } finally { setLoading(false); }
  };

  const stats = [
    { v: '$2.4T+', l: 'Assets Under Management' },
    { v: '99.99%', l: 'Platform Uptime' },
    { v: '4.8M+', l: 'Active Customers' },
    { v: '50+', l: 'Countries Supported' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f8fafc' }}>
      {/* Left panel */}
      <div style={{ width: '44%', background: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 52px', borderRight: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden' }} className="auth-left">
        <div style={{ position: 'absolute', top: '10%', right: '-10%', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,60,94,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: 'linear-gradient(135deg, #1a3c5e, #0f2847)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5"/>
                <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="1.5"/>
                <circle cx="12" cy="12" r="2" fill="white"/>
                <line x1="12" y1="3" x2="12" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="21" y1="12" x2="17" y2="12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="12" y1="21" x2="12" y2="17" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="3" y1="12" x2="7" y2="12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{ fontSize: 17, fontWeight: 900, color: '#0f172a' }}>Credit<span style={{ color: '#1a3c5e' }}>Vault</span></span>
          </Link>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#0f172a', lineHeight: 1.1, letterSpacing: '-0.8px', margin: '0 0 14px' }}>Welcome<br />back.</h2>
          <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.75, margin: '0 0 40px', maxWidth: 300 }}>
            Secure 2-step login protects your account on every sign in.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
            {stats.map(({ v, l }) => (
              <div key={l} style={{ padding: '16px', borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <p style={{ margin: '0 0 3px', fontSize: 20, fontWeight: 800, color: '#1a3c5e', letterSpacing: '-0.4px' }}>{v}</p>
                <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>{l}</p>
              </div>
            ))}
          </div>
          <div style={{ padding: '13px 16px', borderRadius: 9, background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={14} color="#16a34a" style={{ flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: 12, color: '#15803d', fontWeight: 500 }}>FDIC Insured · 256-bit AES · OTP on every login</p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 32px' }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} style={{ width: '100%', maxWidth: 400 }}>

          {/* STEP 1 — Credentials */}
          {step === 1 && !needsVerify && (
            <>
              <h1 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.4px' }}>Sign in to Credit Vault</h1>
              <p style={{ margin: '0 0 28px', fontSize: 14, color: '#64748b' }}>
                New customer? <Link to="/signup" style={{ color: '#1a3c5e', fontWeight: 600, textDecoration: 'none' }}>Open a free account</Link>
              </p>
              <StatusBox />
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email Address</label>
                  <input type="email" required placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}
                    style={inp(focused.email)}
                    onFocus={() => setFocused(f => ({ ...f, email: true }))}
                    onBlur={() => setFocused(f => ({ ...f, email: false }))} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Password</label>
                    <Link to="/forgot-password" style={{ fontSize: 12, color: '#1a3c5e', textDecoration: 'none', fontWeight: 500 }}>Forgot password?</Link>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input type={showPw ? 'text' : 'password'} required placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                      autoComplete="current-password"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      style={{ ...inp(focused.password), paddingRight: 44 }}
                      onFocus={() => setFocused(f => ({ ...f, password: true }))}
                      onBlur={() => setFocused(f => ({ ...f, password: false }))} />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  style={{ padding: '13px', borderRadius: 9, background: '#1a3c5e', color: 'white', fontWeight: 700, fontSize: 15, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: 4 }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#0f2847'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#1a3c5e'; }}>
                  {loading ? 'Checking…' : 'Continue →'}
                </button>
              </form>
            </>
          )}

          {/* STEP 2 — Login OTP */}
          {step === 2 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Shield size={28} color="#1a3c5e" />
              </div>
              <h1 style={{ margin: '0 0 8px', fontSize: 24, fontWeight: 800, color: '#0f172a' }}>Enter your login code</h1>
              <p style={{ margin: '0 0 28px', fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
                We sent a 6-digit code to <strong style={{ color: '#0f172a' }}>{email}</strong>
              </p>
              <StatusBox />
              <form onSubmit={handleOtpSubmit}>
                {renderOtpBoxes(otp, setOtp, "otp")}
                <button type="submit" disabled={loading || otpValue.length !== 6}
                  style={{ width: '100%', padding: '13px', borderRadius: 9, background: '#1a3c5e', color: 'white', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer', opacity: loading || otpValue.length !== 6 ? 0.6 : 1 }}>
                  {loading ? 'Verifying…' : 'Sign In →'}
                </button>
              </form>
              <button onClick={() => { setStep(1); setOtp(['','','','','','']); setStatus({ type: '', msg: '' }); }}
                style={{ marginTop: 14, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#64748b' }}>
                ← Use a different account
              </button>
            </div>
          )}

          {/* Unverified account OTP */}
          {needsVerify && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, background: '#fffbeb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Shield size={28} color="#d97706" />
              </div>
              <h1 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Verify your email first</h1>
              <p style={{ margin: '0 0 24px', fontSize: 14, color: '#64748b' }}>
                A verification code was sent to <strong style={{ color: '#0f172a' }}>{email}</strong>
              </p>
              <StatusBox />
              <form onSubmit={handleVerifyAccount}>
                {renderOtpBoxes(verifyOtp, setVerifyOtp, "verify")}
                <button type="submit" disabled={loading || verifyOtpValue.length !== 6}
                  style={{ width: '100%', padding: '13px', borderRadius: 9, background: '#1a3c5e', color: 'white', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer', opacity: loading || verifyOtpValue.length !== 6 ? 0.6 : 1 }}>
                  {loading ? 'Verifying…' : 'Verify & Sign In'}
                </button>
              </form>
              <button onClick={() => { setNeedsVerify(false); setStatus({ type: '', msg: '' }); }}
                style={{ marginTop: 14, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#64748b' }}>
                ← Back
              </button>
            </div>
          )}

          <p style={{ marginTop: 24, fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>🔒 Protected by 256-bit AES encryption</p>
        </motion.div>
      </div>
      <style>{`@media(max-width:800px){.auth-left{display:none!important}}`}</style>
    </div>
  );
}