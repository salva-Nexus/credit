import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, CheckCircle } from 'lucide-react';

const SupportWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState({});

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleSend = e => {
    e.preventDefault();
    const subject = encodeURIComponent(`Credit Vault Support — ${form.subject}`);
    const body = encodeURIComponent(
      `From: ${user.fullName || 'Customer'}\nEmail: ${user.email || 'N/A'}\nAccount: ${user.accountNumber || 'N/A'}\n\n${form.message}`
    );
    window.location.href = `mailto:creditvault.support@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({ subject: '', message: '' });
      setIsOpen(false);
    }, 3000);
  };

  const inp = (name) => ({
    width: '100%', padding: '10px 12px', borderRadius: 8, fontSize: 13,
    background: '#f8fafc', border: `1.5px solid ${focused[name] ? '#1a3c5e' : '#e2e8f0'}`,
    color: '#0f172a', outline: 'none', fontFamily: 'Inter, sans-serif',
    boxSizing: 'border-box', transition: 'border-color 0.15s',
  });

  return (
    <>
      {/* FAB */}
      {!isOpen && (
        <button onClick={() => setIsOpen(true)}
          style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 9998, width: 54, height: 54, borderRadius: '50%', background: 'linear-gradient(135deg, #1a3c5e, #0f2847)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 24px rgba(26,60,94,0.4)', transition: 'transform 0.2s, box-shadow 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(26,60,94,0.5)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(26,60,94,0.4)'; }}>
          <MessageCircle size={22} color="white" />
        </button>
      )}

      {/* Support panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.22 }}
            style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 9999, width: 360, maxWidth: 'calc(100vw - 2rem)', background: 'white', borderRadius: 18, boxShadow: '0 24px 64px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>

            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #1a3c5e, #0f2847)', padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageCircle size={18} color="white" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'white' }}>Contact Support</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.8)' }} />
                    <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Credit Vault · We reply within minutes</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)}
                style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}>
                <X size={15} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '20px 18px' }}>
              {sent ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                    <CheckCircle size={28} color="#16a34a" />
                  </div>
                  <p style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Opening your email…</p>
                  <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>Your message is pre-filled and ready to send.</p>
                </div>
              ) : (
                <>
                  {/* Pre-fill info */}
                  <div style={{ padding: '10px 12px', borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: 14 }}>
                    <p style={{ margin: 0, fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
                      Sending as <strong style={{ color: '#0f172a' }}>{user.fullName || 'Customer'}</strong>
                      {user.email && <> · {user.email}</>}
                    </p>
                  </div>

                  <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Subject</label>
                      <input required placeholder="e.g. Issue with my transfer" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                        style={inp('subject')}
                        onFocus={() => setFocused(f => ({ ...f, subject: true }))}
                        onBlur={() => setFocused(f => ({ ...f, subject: false }))} />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Message</label>
                      <textarea required placeholder="Describe your issue or question…" rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        style={{ ...inp('message'), resize: 'none', lineHeight: 1.6 }}
                        onFocus={() => setFocused(f => ({ ...f, message: true }))}
                        onBlur={() => setFocused(f => ({ ...f, message: false }))} />
                    </div>

                    <button type="submit"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', borderRadius: 9, background: '#1a3c5e', color: 'white', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', transition: 'background 0.15s', marginTop: 2 }}
                      onMouseEnter={e => e.currentTarget.style.background = '#0f2847'}
                      onMouseLeave={e => e.currentTarget.style.background = '#1a3c5e'}>
                      <Send size={15} /> Send Message
                    </button>
                  </form>

                  <p style={{ margin: '10px 0 0', fontSize: 11, color: '#94a3b8', textAlign: 'center' }}>
                    Sends to creditvault.support@gmail.com via your email client
                  </p>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SupportWidget;