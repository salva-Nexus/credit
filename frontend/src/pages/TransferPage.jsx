import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';
import API from '../api';
import { COUNTRIES, getCountryFields } from '../components/Dashboard/countryFields';

const inp = (focused) => ({
  width: '100%', padding: '10px 13px', borderRadius: 7, fontSize: 14,
  background: 'white', border: `1.5px solid ${focused ? '#1a3c5e' : '#e2e8f0'}`,
  color: '#0f172a', outline: 'none', transition: 'border-color 0.2s',
  fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
});

const Label = ({ children, hint }) => (
  <div style={{ marginBottom: 5 }}>
    <label style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{children}</label>
    {hint && <p style={{ margin: '2px 0 0', fontSize: 11, color: '#94a3b8' }}>{hint}</p>}
  </div>
);

export default function TransferPage({ userData, onSuccess }) {
  const [transferType, setTransferType] = useState('local');
  const [country, setCountry] = useState('US');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [fields, setFields] = useState({});
  const [focused, setFocused] = useState({});
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1=form, 2=review, 3=done

  const selectedCountry = COUNTRIES.find(c => c.code === country) || COUNTRIES[0];
  const countryFields = getCountryFields(country);
  const isIntl = transferType === 'international';
  const minAmount = isIntl ? 50000 : 1;

  const handleCountryChange = (code) => {
    setCountry(code);
    const c = COUNTRIES.find(x => x.code === code);
    setTransferType(c?.type === 'local' ? 'local' : 'international');
    setFields({});
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (Number(amount) < minAmount) {
      return setStatus({ type: 'error', msg: isIntl ? 'International transfers require a minimum of $50,000.' : 'Enter a valid amount.' });
    }
    if (Number(amount) > (userData?.balance || 0)) {
      return setStatus({ type: 'error', msg: 'Insufficient funds in your account.' });
    }
    setStep(2);
  };

  const handleConfirm = async () => {
    setLoading(true); setStatus({ type: '', msg: '' });
    try {
      await API.post('/api/banking/transfer', {
        amount: Number(amount),
        transferType,
        recipientCountry: country,
        memo,
        ...fields,
      });
      setStep(3);
      onSuccess?.();
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.msg || 'Transfer failed.' });
      setStep(1);
    } finally { setLoading(false); }
  };

  const StatusBox = () => status.msg ? (
    <div style={{ padding: '11px 14px', borderRadius: 8, marginBottom: 18, fontSize: 13, fontWeight: 500,
      background: status.type === 'success' ? '#f0fdf4' : '#fef2f2',
      border: `1px solid ${status.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
      color: status.type === 'success' ? '#15803d' : '#dc2626' }}>
      {status.msg}
    </div>
  ) : null;

  if (step === 3) return (
    <div style={{ maxWidth: 520, margin: '40px auto', textAlign: 'center', padding: 24 }}>
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <CheckCircle size={36} color="#16a34a" />
        </div>
        <h2 style={{ margin: '0 0 10px', fontSize: 24, fontWeight: 800, color: '#0f172a' }}>Transfer Submitted</h2>
        <p style={{ margin: '0 0 24px', fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
          Your transfer of <strong>${Number(amount).toLocaleString()}</strong> to <strong>{fields.recipientName}</strong> has been submitted and is pending review. Processing typically takes 1–3 business days.
        </p>
        <button onClick={() => { setStep(1); setAmount(''); setFields({}); setMemo(''); }}
          style={{ padding: '12px 28px', borderRadius: 9, background: '#1a3c5e', color: 'white', fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer' }}>
          Make Another Transfer
        </button>
      </motion.div>
    </div>
  );

  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Send Money</h1>
        <p style={{ margin: 0, fontSize: 14, color: '#64748b' }}>
          Available balance: <strong style={{ color: '#0f172a' }}>${(userData?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
        </p>
      </div>

      {step === 1 && (
        <form onSubmit={handleSubmit}>
          <StatusBox />

          {/* Transfer type selector */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
            {[
              { type: 'local', icon: MapPin, label: 'Domestic Transfer', sub: 'Within the United States' },
              { type: 'international', icon: Globe, label: 'International Wire', sub: 'Min. $50,000 required' },
            ].map(({ type, icon: Icon, label, sub }) => (
              <button key={type} type="button" onClick={() => {
                setTransferType(type);
                if (type === 'local') setCountry('US');
                else if (country === 'US') setCountry('GB');
              }}
                style={{ padding: '16px', borderRadius: 10, border: `2px solid ${transferType === type ? '#1a3c5e' : '#e2e8f0'}`, background: transferType === type ? '#eff6ff' : 'white', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Icon size={16} color={transferType === type ? '#1a3c5e' : '#94a3b8'} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: transferType === type ? '#1a3c5e' : '#374151' }}>{label}</span>
                </div>
                <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>{sub}</p>
              </button>
            ))}
          </div>

          {/* International warning */}
          {isIntl && (
            <div style={{ padding: '12px 14px', borderRadius: 9, background: '#fffbeb', border: '1px solid #fde68a', display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20 }}>
              <AlertTriangle size={16} color="#d97706" style={{ marginTop: 1, flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: 12, color: '#92400e', lineHeight: 1.5 }}>
                <strong>International Wire Transfers</strong> require a minimum of <strong>$50,000 USD</strong> and typically take 1–5 business days. Additional compliance review may apply.
              </p>
            </div>
          )}

          {/* Country select */}
          <div style={{ marginBottom: 20 }}>
            <Label>Recipient's Country</Label>
            <select value={country} onChange={e => handleCountryChange(e.target.value)} style={inp(false)}>
              {COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.name} {c.type === 'local' ? '(Domestic)' : '(International)'}</option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div style={{ marginBottom: 20 }}>
            <Label hint={isIntl ? 'Minimum $50,000 for international transfers' : undefined}>Transfer Amount (USD)</Label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 16, fontWeight: 700, color: '#94a3b8' }}>$</span>
              <input type="number" required min={minAmount} step="0.01" placeholder={isIntl ? '50,000.00' : '0.00'}
                value={amount} onChange={e => setAmount(e.target.value)}
                style={{ ...inp(focused.amount), paddingLeft: 28, fontSize: 18, fontWeight: 700 }}
                onFocus={() => setFocused(f => ({ ...f, amount: true }))}
                onBlur={() => setFocused(f => ({ ...f, amount: false }))} />
            </div>
            {isIntl && Number(amount) > 0 && Number(amount) < 50000 && (
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#dc2626' }}>International transfers require a minimum of $50,000</p>
            )}
          </div>

          {/* Country-specific fields */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 20 }}>
            {countryFields.map(field => (
              <div key={field.name}>
                <Label hint={field.hint}>{field.label} {field.required && <span style={{ color: '#dc2626' }}>*</span>}</Label>
                {field.type === 'select' ? (
                  <select value={fields[field.name] || ''} onChange={e => setFields(f => ({ ...f, [field.name]: e.target.value }))}
                    required={field.required} style={inp(false)}>
                    <option value="">Select…</option>
                    {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type="text" placeholder={field.placeholder}
                    value={fields[field.name] || ''} onChange={e => setFields(f => ({ ...f, [field.name]: e.target.value }))}
                    required={field.required}
                    style={inp(focused[field.name])}
                    onFocus={() => setFocused(f => ({ ...f, [field.name]: true }))}
                    onBlur={() => setFocused(f => ({ ...f, [field.name]: false }))} />
                )}
              </div>
            ))}
          </div>

          {/* Memo */}
          <div style={{ marginBottom: 24 }}>
            <Label>Memo / Reference (optional)</Label>
            <input type="text" placeholder="e.g. Invoice #1234, Rent payment" value={memo} onChange={e => setMemo(e.target.value)}
              style={inp(focused.memo)}
              onFocus={() => setFocused(f => ({ ...f, memo: true }))}
              onBlur={() => setFocused(f => ({ ...f, memo: false }))} />
          </div>

          <button type="submit"
            style={{ padding: '13px 32px', borderRadius: 9, background: '#1a3c5e', color: 'white', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer' }}>
            Review Transfer →
          </button>
        </form>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700, color: '#0f172a' }}>Review Transfer</h2>
          <div style={{ padding: '24px', borderRadius: 12, background: 'white', border: '1px solid #e2e8f0', marginBottom: 20 }}>
            {[
              ['Transfer Type', isIntl ? 'International Wire Transfer' : 'Domestic Transfer'],
              ['Recipient Country', `${selectedCountry.flag} ${selectedCountry.name}`],
              ['Amount', `$${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`],
              ['Recipient Name', fields.recipientName || '—'],
              ['Bank', fields.bankName || '—'],
              ...(fields.accountNumber ? [['Account Number', fields.accountNumber]] : []),
              ...(fields.routingNumber ? [['Routing / ABA', fields.routingNumber]] : []),
              ...(fields.iban ? [['IBAN', fields.iban]] : []),
              ...(fields.swiftCode ? [['SWIFT/BIC', fields.swiftCode]] : []),
              ...(fields.sortCode ? [['Sort Code', fields.sortCode]] : []),
              ...(fields.ifsc ? [['IFSC Code', fields.ifsc]] : []),
              ...(memo ? [['Memo', memo]] : []),
              ['Processing Time', '1–3 Business Days'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: 13, color: '#64748b' }}>{k}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', textAlign: 'right', maxWidth: '55%', wordBreak: 'break-all' }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: '12px 16px', borderRadius: 9, background: '#fffbeb', border: '1px solid #fde68a', marginBottom: 20 }}>
            <p style={{ margin: 0, fontSize: 12, color: '#92400e' }}>
              ⚠️ Please verify all details carefully. Wire transfers cannot be reversed once processed.
            </p>
          </div>
          <StatusBox />
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="button" onClick={() => setStep(1)}
              style={{ padding: '12px 24px', borderRadius: 9, border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: 14, cursor: 'pointer', color: '#374151' }}>
              ← Edit
            </button>
            <button type="button" onClick={handleConfirm} disabled={loading}
              style={{ flex: 1, padding: '12px', borderRadius: 9, background: '#1a3c5e', color: 'white', fontWeight: 700, fontSize: 15, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Processing…' : 'Confirm Transfer'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}