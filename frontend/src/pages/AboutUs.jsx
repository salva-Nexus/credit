import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Users, Globe, Award, CheckCircle, TrendingUp } from 'lucide-react';

const team = [
  { name: 'Marcus Reid', role: 'Chief Executive Officer', bio: 'Former Goldman Sachs Managing Director with 20 years in institutional banking. Led the digital transformation of two top-10 US banks before founding Credit Vault.' },
  { name: 'Aisha Okonkwo', role: 'Chief Technology Officer', bio: 'Ex-Stripe infrastructure engineer. Architected payment systems processing over $200B annually. Holds 12 patents in financial cryptography.' },
  { name: 'Daniel Whitmore', role: 'Chief Risk Officer', bio: 'PhD in Financial Mathematics from MIT. Former Federal Reserve examiner with deep expertise in AML compliance and systemic risk modeling.' },
  { name: 'Priya Nair', role: 'Head of Product', bio: 'Previously VP of Product at Chime. Built the mobile banking experience used by 14 million customers. Obsessed with making finance feel human.' },
  { name: 'James Castellano', role: 'Head of Security', bio: '18 years in cybersecurity. Former NSA analyst and CISO at two Fortune 500 financial institutions. Zero successful breaches on his watch.' },
  { name: 'Sofia Mendes', role: 'Head of Operations', bio: 'Scaled banking operations from 50K to 4M customers at two digital banks. Expert in regulatory compliance across 30+ jurisdictions.' },
];

const values = [
  { icon: Shield, title: 'Security above everything', desc: 'We invest more in security than any digital-first bank. Your money and data are protected by the same infrastructure used by national defense agencies.' },
  { icon: Users, title: 'Built for real people', desc: 'No fine print. No hidden fees. No minimum balances. We designed Credit Vault for people who deserve a bank that works for them, not against them.' },
  { icon: Globe, title: 'Banking without borders', desc: 'Whether you\'re sending money to Lagos, London, or Los Angeles — we handle the complexity so you don\'t have to. 50+ countries, zero headaches.' },
  { icon: TrendingUp, title: 'Your growth is our growth', desc: 'We make money when you use your card, not when we charge you fees. That alignment means we\'re always incentivized to serve you better.' },
];

const Reveal = ({ children, delay = 0, style }) => (
  <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }} style={style}>
    {children}
  </motion.div>
);

export default function AboutUs() {
  return (
    <div style={{ background: 'white', paddingTop: 68 }}>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(160deg, #f8fafc, #eff6ff)', padding: '80px 32px 96px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#1a3c5e', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: 14 }}>Our Story</span>
            <h1 style={{ margin: '0 0 20px', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 900, color: '#0f172a', letterSpacing: '-1.2px', lineHeight: 1.1 }}>
              Banking that puts<br />people first.
            </h1>
            <p style={{ margin: '0 0 32px', fontSize: 18, color: '#475569', lineHeight: 1.75, maxWidth: 620, marginLeft: 'auto', marginRight: 'auto' }}>
              Credit Vault was founded in 2019 on a single belief: that modern banking should be fast, transparent, and genuinely on your side. We've since grown to serve 4.8 million customers in 50+ countries.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/signup" style={{ padding: '13px 28px', borderRadius: 9, background: '#1a3c5e', color: 'white', fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: '0 4px 16px rgba(26,60,94,0.25)' }}>
                Open Account
              </Link>
              <Link to="/faq" style={{ padding: '13px 28px', borderRadius: 9, border: '2px solid #e2e8f0', color: '#374151', fontWeight: 600, fontSize: 15, textDecoration: 'none', background: 'white' }}>
                Read FAQ
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: '#0f172a', padding: '56px 32px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
            {[
              ['2019', 'Founded'],
              ['4.8M+', 'Customers'],
              ['50+', 'Countries'],
              ['$0', 'Monthly Fees'],
              ['99.99%', 'Uptime'],
            ].map(([v, l]) => (
              <Reveal key={l} style={{ background: '#0f172a', padding: '32px 20px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 6px', fontSize: 34, fontWeight: 900, color: 'white', letterSpacing: '-0.8px' }}>{v}</p>
                <p style={{ margin: 0, fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{l}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: '96px 32px', background: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="about-grid">
            <Reveal>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#1a3c5e', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: 12 }}>Our Mission</span>
              <h2 style={{ margin: '0 0 20px', fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.6px', lineHeight: 1.15 }}>
                We built the bank<br />we always wanted.
              </h2>
              <p style={{ margin: '0 0 20px', fontSize: 15, color: '#64748b', lineHeight: 1.8 }}>
                Traditional banks charge you to hold your own money, hide fees in 40-page documents, and treat you like a liability. We built Credit Vault to be the opposite.
              </p>
              <p style={{ margin: '0 0 32px', fontSize: 15, color: '#64748b', lineHeight: 1.8 }}>
                Our infrastructure is built on the same technology used by Stripe and Plaid — but we made it accessible to everyone, not just developers and enterprises.
              </p>
              {['Zero monthly fees on all accounts', 'OTP security on every single login', 'FDIC insured up to $250,000', '24/7 human support — no bots'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <CheckCircle size={17} color="#16a34a" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>{item}</span>
                </div>
              ))}
            </Reveal>
            <Reveal delay={0.2}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {values.map(({ icon: Icon, title, desc }) => (
                  <div key={title} style={{ padding: '22px', borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 9, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                      <Icon size={18} color="#1a3c5e" />
                    </div>
                    <p style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{title}</p>
                    <p style={{ margin: 0, fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>{desc}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: '96px 32px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#1a3c5e', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: 12 }}>Leadership</span>
            <h2 style={{ margin: 0, fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.6px' }}>
              The Credit Vault team.
            </h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {team.map(({ name, role, bio }, i) => (
              <Reveal key={name} delay={i * 0.07}>
                <div style={{ padding: '28px', borderRadius: 14, background: 'white', border: '1px solid #e2e8f0', transition: 'all 0.2s', height: '100%' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(26,60,94,0.1)'; e.currentTarget.style.borderColor = '#bfdbfe'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
                  <div style={{ width: 44, height: 44, borderRadius: 11, background: '#1a3c5e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: 'white', marginBottom: 16 }}>
                    {name.charAt(0)}
                  </div>
                  <p style={{ margin: '0 0 3px', fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{name}</p>
                  <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 700, color: '#1a3c5e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{role}</p>
                  <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>{bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 32px', background: '#0f172a', textAlign: 'center' }}>
        <Reveal>
          <h2 style={{ margin: '0 0 16px', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, color: 'white', letterSpacing: '-0.6px' }}>
            Ready to join us?
          </h2>
          <p style={{ margin: '0 0 32px', fontSize: 16, color: '#94a3b8' }}>Open a free account in under 5 minutes.</p>
          <Link to="/signup" style={{ padding: '14px 32px', borderRadius: 10, background: 'white', color: '#0f172a', fontWeight: 800, fontSize: 15, textDecoration: 'none' }}>
            Open Free Account →
          </Link>
        </Reveal>
      </section>

      <style>{`@media(max-width:768px){.about-grid{grid-template-columns:1fr!important;gap:40px!important}}`}</style>
    </div>
  );
}