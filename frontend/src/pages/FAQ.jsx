import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, MessageCircle } from 'lucide-react';

const categories = [
  {
    label: 'Getting Started',
    faqs: [
      { q: 'How do I open a Credit Vault account?', a: 'Click "Open Account" and fill in your name, email, and password. You\'ll receive a 6-digit verification code to your email. Once verified, your account is live instantly with your account and routing numbers available immediately.' },
      { q: 'Is there a minimum balance requirement?', a: 'No. Credit Vault has zero minimum balance requirements on all account types. Your account remains active regardless of your balance, and you\'ll never be charged an inactivity fee.' },
      { q: 'What documents do I need to open an account?', a: 'For our standard online account, you only need a valid email address. For higher transfer limits or business accounts, we may request a government-issued ID and proof of address through our secure verification portal.' },
      { q: 'Can I have both checking and savings accounts?', a: 'Yes. You can open multiple account types under one profile. Your accounts are linked for instant transfers between them, and you can set up automatic savings rules.' },
    ]
  },
  {
    label: 'Security',
    faqs: [
      { q: 'How does Credit Vault protect my account?', a: 'Every login requires a one-time password (OTP) sent to your registered email — not optional, not togglable. On top of that, all data is encrypted with AES-256 at rest and TLS 1.3 in transit. Our fraud detection monitors 100% of transactions in real time.' },
      { q: 'Is Credit Vault FDIC insured?', a: 'Yes. Credit Vault, N.A. is a member of the FDIC. Your deposits are insured up to $250,000 per depositor per account ownership category — the maximum allowed by federal law.' },
      { q: 'What happens if I suspect unauthorized access?', a: 'Contact support immediately at creditvault.support@gmail.com or through the in-app chat. We\'ll freeze the account within minutes, investigate all recent activity, and you are never liable for unauthorized transactions that are reported promptly.' },
      { q: 'Does Credit Vault sell my data?', a: 'Never. We do not sell, rent, or trade your personal or financial data to any third party for marketing purposes. The only time your data leaves our systems is for legal compliance (e.g. IRS reporting) or fraud prevention partnerships.' },
    ]
  },
  {
    label: 'Transfers',
    faqs: [
      { q: 'How long do domestic transfers take?', a: 'ACH transfers: 1–2 business days. Domestic wire transfers submitted before 3PM EST are typically same-day. Transfers between Credit Vault accounts are instant.' },
      { q: 'What is the minimum for international wire transfers?', a: 'International wire transfers require a minimum of $50,000 USD. This covers the compliance, correspondent banking, and SWIFT processing costs associated with cross-border transactions. Domestic transfers have no minimum.' },
      { q: 'Which countries can I send wire transfers to?', a: 'We support international wire transfers to 50+ countries including the UK, Canada, Australia, Nigeria, Ghana, Kenya, India, Germany, France, Japan, Singapore, UAE, and more. See the full list in your Transfer page when logged in.' },
      { q: 'Are there wire transfer fees?', a: 'Incoming wire transfers are always free. Outgoing domestic wires are $15 per transfer. Outgoing international wires are $35 per transfer. There are no hidden correspondent bank fees — the amount your recipient sees is what we quote you.' },
    ]
  },
  {
    label: 'Deposits & Withdrawals',
    faqs: [
      { q: 'How do I deposit money into my account?', a: 'You can deposit via wire transfer, ACH (linked external bank), mobile check deposit, or cash at any participating ATM. Submit a deposit request in the app and our team will process it within 1–3 business days.' },
      { q: 'How do I withdraw money?', a: 'Submit a withdrawal request in the app with your destination bank details. Wire transfers process in 1–3 business days. ACH withdrawals take 2–3 business days. Check by mail takes 5–7 business days.' },
      { q: 'Is there a limit on deposits or withdrawals?', a: 'Standard accounts have a $500,000 daily ACH limit and no limit on wire transfers. For large transactions, our compliance team may request supporting documentation, which is standard regulatory practice.' },
    ]
  },
  {
    label: 'Fees',
    faqs: [
      { q: 'What does Credit Vault charge?', a: 'Checking and savings accounts: $0/month. Incoming transfers: free. Outgoing domestic wire: $15. Outgoing international wire: $35. Returned ACH: $5. Expedited card delivery: $25. That\'s the complete fee schedule — no surprises.' },
      { q: 'Are there overdraft fees?', a: 'No. Credit Vault does not charge overdraft fees. If a transaction would overdraw your account, it will simply be declined rather than processed and charged a fee.' },
      { q: 'Are ATM fees reimbursed?', a: 'Yes. Credit Vault reimburses up to $50 in ATM fees per month on Essential Checking accounts. Simply use any ATM worldwide and the surcharge will be credited to your account within 2 business days.' },
    ]
  },
];

const Reveal = ({ children, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.45, delay }}>
    {children}
  </motion.div>
);

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openIndex, setOpenIndex] = useState(null);

  const handleCategory = (i) => { setActiveCategory(i); setOpenIndex(null); };

  return (
    <div style={{ background: 'white', paddingTop: 68 }}>

      {/* Header */}
      <section style={{ background: 'linear-gradient(160deg, #f8fafc, #eff6ff)', padding: '72px 32px 80px', textAlign: 'center' }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#1a3c5e', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: 14 }}>Support</span>
          <h1 style={{ margin: '0 0 16px', fontSize: 'clamp(34px, 5vw, 52px)', fontWeight: 900, color: '#0f172a', letterSpacing: '-1px', lineHeight: 1.1 }}>
            Frequently asked<br />questions.
          </h1>
          <p style={{ margin: '0 auto 28px', fontSize: 17, color: '#64748b', maxWidth: 480, lineHeight: 1.7 }}>
            Can't find what you're looking for? We're here 24/7.
          </p>
          <a href="mailto:creditvault.support@gmail.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 9, background: '#1a3c5e', color: 'white', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
            <MessageCircle size={15} /> Contact Support
          </a>
        </Reveal>
      </section>

      {/* Content */}
      <section style={{ padding: '64px 32px 96px' }}>
        <div style={{ maxWidth: 920, margin: '0 auto', display: 'grid', gridTemplateColumns: '220px 1fr', gap: 48, alignItems: 'start' }} className="faq-grid">

          {/* Category sidebar */}
          <div style={{ position: 'sticky', top: 88 }}>
            <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Categories</p>
            {categories.map((cat, i) => (
              <button key={cat.label} onClick={() => handleCategory(i)}
                style={{ width: '100%', textAlign: 'left', padding: '10px 14px', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, marginBottom: 4, transition: 'all 0.15s',
                  background: activeCategory === i ? '#eff6ff' : 'transparent',
                  color: activeCategory === i ? '#1a3c5e' : '#374151',
                  borderLeft: `3px solid ${activeCategory === i ? '#1a3c5e' : 'transparent'}`,
                }}>
                {cat.label}
                <span style={{ marginLeft: 6, fontSize: 11, color: activeCategory === i ? '#1a3c5e' : '#94a3b8', fontWeight: 500 }}>({cat.faqs.length})</span>
              </button>
            ))}
          </div>

          {/* Questions */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div key={activeCategory} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                <h2 style={{ margin: '0 0 24px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{categories[activeCategory].label}</h2>
                <div style={{ borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                  {categories[activeCategory].faqs.map(({ q, a }, i) => (
                    <div key={i} style={{ borderBottom: i < categories[activeCategory].faqs.length - 1 ? '1px solid #f1f5f9' : 'none', background: openIndex === i ? '#fafbff' : 'white', transition: 'background 0.15s' }}>
                      <button onClick={() => setOpenIndex(openIndex === i ? null : i)}
                        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16 }}>
                        <span style={{ fontSize: 15, fontWeight: 600, color: openIndex === i ? '#1a3c5e' : '#0f172a', lineHeight: 1.4 }}>{q}</span>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: openIndex === i ? '#1a3c5e' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                          <ChevronDown size={14} color={openIndex === i ? 'white' : '#64748b'} style={{ transform: openIndex === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                        </div>
                      </button>
                      <AnimatePresence>
                        {openIndex === i && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
                            <p style={{ margin: 0, padding: '0 24px 22px', fontSize: 14, color: '#64748b', lineHeight: 1.8 }}>{a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '48px 32px', textAlign: 'center' }}>
        <p style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 700, color: '#0f172a' }}>Still have questions?</p>
        <p style={{ margin: '0 0 20px', fontSize: 14, color: '#64748b' }}>Our team responds within minutes, around the clock.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="mailto:creditvault.support@gmail.com" style={{ padding: '11px 24px', borderRadius: 9, background: '#1a3c5e', color: 'white', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Email Support</a>
          <Link to="/signup" style={{ padding: '11px 24px', borderRadius: 9, border: '1.5px solid #e2e8f0', color: '#374151', fontWeight: 600, fontSize: 14, textDecoration: 'none', background: 'white' }}>Open an Account</Link>
        </div>
      </section>

      <style>{`@media(max-width:768px){.faq-grid{grid-template-columns:1fr!important} .faq-grid > div:first-child{position:static!important}}`}</style>
    </div>
  );
}