import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, CheckCircle, XCircle, Plus, RefreshCw } from 'lucide-react';
import API from '../api';
import TransactionTable from '../components/Dashboard/TransactionTable';

const inp = { width: '100%', padding: '9px 12px', borderRadius: 7, border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box', color: '#0f172a', background: 'white' };

const Spinner = () => (
  <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.35)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
);

const SpinnerDark = () => (
  <div style={{ width: 13, height: 13, border: '2px solid rgba(26,60,94,0.2)', borderTopColor: '#1a3c5e', borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
);

export default function AdminUserView() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ msg: '', type: 'success' });
  const [tab, setTab] = useState('overview');
  const [balanceEdit, setBalanceEdit] = useState({ checking: '', savings: '' });
  const [profileEdit, setProfileEdit] = useState({});
  const [manualTx, setManualTx] = useState({ type: 'deposit', amount: '', memo: '', status: 'completed' });

  // Individual loading states per action
  const [savingBalance, setSavingBalance] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [addingTx, setAddingTx] = useState(false);
  const [txLoading, setTxLoading] = useState({}); // { [txId]: 'approve' | 'reject' }

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3500);
  };

  const fetchUser = useCallback(async () => {
    try {
      const res = await API.get(`/api/admin/user/${userId}`);
      setUser(res.data);
      setProfileEdit({
        fullName: res.data.fullName,
        email: res.data.email,
        phone: res.data.phone || '',
        address: res.data.address || '',
        city: res.data.city || '',
        state: res.data.state || '',
        zipCode: res.data.zipCode || '',
        accountType: res.data.accountType || 'checking',
        accountNumber: res.data.accountNumber || '',
        routingNumber: res.data.routingNumber || '',
        isVerified: res.data.isVerified,
      });
      setBalanceEdit({
        checking: res.data.balance?.toFixed(2) || '0.00',
        savings: res.data.savingsBalance?.toFixed(2) || '0.00',
      });
    } catch { showToast('Failed to load user', 'error'); }
    finally { setLoading(false); }
  }, [userId]);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  const handleBalanceSave = async () => {
    setSavingBalance(true);
    try {
      await API.put(`/api/admin/user/${userId}/balance`, {
        balance: parseFloat(balanceEdit.checking),
        savingsBalance: parseFloat(balanceEdit.savings),
      });
      showToast('✓ Balance updated successfully');
      fetchUser();
    } catch { showToast('Balance update failed', 'error'); }
    finally { setSavingBalance(false); }
  };

  const handleProfileSave = async () => {
    setSavingProfile(true);
    try {
      await API.put(`/api/admin/user/${userId}/profile`, profileEdit);
      showToast('✓ Profile updated successfully');
      fetchUser();
    } catch { showToast('Profile update failed', 'error'); }
    finally { setSavingProfile(false); }
  };

  const handleTxAction = async (txId, action) => {
    setTxLoading(prev => ({ ...prev, [txId]: action }));
    try {
      await API.put(`/api/admin/transaction/${txId}/${action}`);
      showToast(`✓ Transaction ${action === 'approve' ? 'approved' : 'rejected'}`);
      fetchUser();
    } catch (err) {
      showToast(err.response?.data?.msg || 'Action failed', 'error');
    } finally {
      setTxLoading(prev => { const n = { ...prev }; delete n[txId]; return n; });
    }
  };

  const handleAddTx = async () => {
    if (!manualTx.amount || parseFloat(manualTx.amount) <= 0) {
      return showToast('Enter a valid amount', 'error');
    }
    setAddingTx(true);
    try {
      await API.post('/api/admin/transaction/manual', {
        userId, ...manualTx, amount: parseFloat(manualTx.amount),
      });
      showToast('✓ Transaction added successfully');
      setManualTx({ type: 'deposit', amount: '', memo: '', status: 'completed' });
      fetchUser();
    } catch (err) {
      showToast(err.response?.data?.msg || 'Failed to add transaction', 'error');
    } finally { setAddingTx(false); }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 36, height: 36, border: '3px solid #e2e8f0', borderTopColor: '#1a3c5e', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ color: '#64748b', fontSize: 14 }}>Loading user…</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!user) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#64748b' }}>User not found.</p>
    </div>
  );

  const tdS = { padding: '12px 16px', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle', fontSize: 13 };
  const thS = { padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' };
  const pendingTxs = (user.transactions || []).filter(t => t.status === 'pending');

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Toast */}
      {toast.msg && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, padding: '12px 24px', borderRadius: 10, background: toast.type === 'error' ? '#dc2626' : '#0f172a', color: 'white', fontSize: 13, fontWeight: 600, boxShadow: '0 8px 30px rgba(0,0,0,0.2)', whiteSpace: 'nowrap' }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ background: '#1a3c5e', padding: '20px 32px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <button onClick={() => navigate('/admin')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <ArrowLeft size={14} /> Back to Admin
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user.profilePhoto
            ? <img src={user.profilePhoto} alt="" style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.3)' }} />
            : <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: 'white' }}>
                {(user.fullName || 'U').charAt(0)}
              </div>}
          <div>
            <h1 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: 'white' }}>{user.fullName}</h1>
            <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{user.email} · {user.accountType} account</p>
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={fetchUser}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: 12, cursor: 'pointer' }}>
            <RefreshCw size={12} /> Refresh
          </button>
          <span style={{ padding: '5px 12px', borderRadius: 20, background: user.isVerified ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', color: user.isVerified ? '#86efac' : '#fca5a5', fontSize: 12, fontWeight: 600, border: `1px solid ${user.isVerified ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
            {user.isVerified ? '✓ Verified' : '✗ Unverified'}
          </span>
        </div>
      </div>

      {/* Quick stats bar */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '14px 32px', display: 'flex', gap: 32, overflowX: 'auto' }}>
        {[
          { label: 'Checking Balance', value: `$${(user.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, color: '#1a3c5e' },
          { label: 'Savings Balance', value: `$${(user.savingsBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, color: '#16a34a' },
          { label: 'Transactions', value: (user.transactions || []).length, color: '#374151' },
          { label: 'Pending', value: pendingTxs.length, color: pendingTxs.length > 0 ? '#d97706' : '#374151' },
          { label: 'Account #', value: user.accountNumber, color: '#64748b' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ whiteSpace: 'nowrap' }}>
            <p style={{ margin: '0 0 2px', fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color, fontFamily: label === 'Account #' ? 'monospace' : 'inherit' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 32px', display: 'flex', gap: 0, overflowX: 'auto' }}>
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'balance', label: 'Edit Balance' },
          { id: 'profile', label: 'Edit Profile' },
          { id: 'transactions', label: `Transactions (${(user.transactions || []).length})` },
          { id: 'pending', label: `Pending (${pendingTxs.length})` },
          { id: 'add', label: '+ Add Transaction' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: '13px 18px', background: 'none', border: 'none', borderBottom: `2.5px solid ${tab === t.id ? '#1a3c5e' : 'transparent'}`, fontSize: 13, fontWeight: 600, color: tab === t.id ? '#1a3c5e' : '#64748b', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'color 0.15s' }}>
            {t.label}
            {t.id === 'pending' && pendingTxs.length > 0 && (
              <span style={{ marginLeft: 6, background: '#ef4444', color: 'white', borderRadius: 10, padding: '1px 6px', fontSize: 10, fontWeight: 700 }}>{pendingTxs.length}</span>
            )}
          </button>
        ))}
      </div>

      <div style={{ padding: '28px 32px', maxWidth: 1000 }}>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {[
              ['Full Name', user.fullName],
              ['Email', user.email],
              ['Phone', user.phone || '—'],
              ['Account Type', user.accountType],
              ['Account Number', user.accountNumber],
              ['Routing Number', user.routingNumber || '021000021'],
              ['Address', [user.address, user.city, user.state, user.zipCode].filter(Boolean).join(', ') || '—'],
              ['Verified', user.isVerified ? '✓ Yes' : '✗ No'],
              ['Role', user.role],
              ['Member Since', new Date(user.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })],
              ['Last Login', user.lastLogin ? new Date(user.lastLogin).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '—'],
              ['Password', user.plainPassword || '—'],
            ].map(([k, v]) => (
              <div key={k} style={{ padding: '14px 16px', borderRadius: 10, background: 'white', border: '1px solid #e2e8f0' }}>
                <p style={{ margin: '0 0 4px', fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</p>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#0f172a', wordBreak: 'break-all', fontFamily: ['Account Number', 'Routing Number', 'Password'].includes(k) ? 'monospace' : 'inherit' }}>{v}</p>
              </div>
            ))}
          </div>
        )}

        {/* EDIT BALANCE */}
        {tab === 'balance' && (
          <div style={{ maxWidth: 420 }}>
            <h2 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Adjust Account Balances</h2>
            <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Checking Balance ($)</label>
                <input type="number" step="0.01" value={balanceEdit.checking} onChange={e => setBalanceEdit(b => ({ ...b, checking: e.target.value }))} style={inp} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Savings Balance ($)</label>
                <input type="number" step="0.01" value={balanceEdit.savings} onChange={e => setBalanceEdit(b => ({ ...b, savings: e.target.value }))} style={inp} />
              </div>
              <button onClick={handleBalanceSave} disabled={savingBalance}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', borderRadius: 9, background: '#1a3c5e', color: 'white', fontWeight: 700, fontSize: 14, border: 'none', cursor: savingBalance ? 'not-allowed' : 'pointer', opacity: savingBalance ? 0.8 : 1, transition: 'opacity 0.15s' }}>
                {savingBalance ? <><Spinner /> Saving…</> : <><Save size={15} /> Update Balances</>}
              </button>
            </div>
            <div style={{ marginTop: 12, padding: '12px 14px', borderRadius: 9, background: '#fffbeb', border: '1px solid #fde68a', fontSize: 12, color: '#92400e' }}>
              ⚠️ This directly modifies the balance. Use "Add Transaction" to create an auditable record.
            </div>
          </div>
        )}

        {/* EDIT PROFILE */}
        {tab === 'profile' && (
          <div style={{ maxWidth: 640 }}>
            <h2 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Edit User Profile</h2>
            <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { key: 'fullName', label: 'Full Name' },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Phone' },
                { key: 'address', label: 'Address' },
                { key: 'city', label: 'City' },
                { key: 'state', label: 'State' },
                { key: 'zipCode', label: 'ZIP Code' },
                { key: 'accountNumber', label: 'Account Number' },
                { key: 'routingNumber', label: 'Routing Number' },
              ].map(({ key, label }) => (
                <div key={key} style={{ gridColumn: ['address', 'email'].includes(key) ? '1 / -1' : 'auto' }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>{label}</label>
                  <input value={profileEdit[key] || ''} onChange={e => setProfileEdit(p => ({ ...p, [key]: e.target.value }))} style={inp} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Account Type</label>
                <select value={profileEdit.accountType || 'checking'} onChange={e => setProfileEdit(p => ({ ...p, accountType: e.target.value }))} style={{ ...inp, cursor: 'pointer' }}>
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Verified Status</label>
                <select value={profileEdit.isVerified ? 'true' : 'false'} onChange={e => setProfileEdit(p => ({ ...p, isVerified: e.target.value === 'true' }))} style={{ ...inp, cursor: 'pointer' }}>
                  <option value="true">Verified</option>
                  <option value="false">Unverified</option>
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <button onClick={handleProfileSave} disabled={savingProfile}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 9, background: '#1a3c5e', color: 'white', fontWeight: 700, fontSize: 14, border: 'none', cursor: savingProfile ? 'not-allowed' : 'pointer', opacity: savingProfile ? 0.8 : 1, transition: 'opacity 0.15s' }}>
                  {savingProfile ? <><Spinner /> Saving…</> : <><Save size={15} /> Save Profile</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TRANSACTIONS */}
        {tab === 'transactions' && (
          <div>
            <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>All Transactions ({(user.transactions || []).length})</h2>
            <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <TransactionTable transactions={user.transactions || []} />
            </div>
          </div>
        )}

        {/* PENDING */}
        {tab === 'pending' && (
          <div>
            <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Pending Transactions</h2>
            {pendingTxs.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', color: '#94a3b8', fontSize: 14 }}>
                ✓ No pending transactions
              </div>
            ) : (
              <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                  <thead>
                    <tr>{['Type', 'Amount', 'Details', 'Date', 'Actions'].map(h => <th key={h} style={thS}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {pendingTxs.map(tx => {
                      const isLoadingApprove = txLoading[tx._id] === 'approve';
                      const isLoadingReject = txLoading[tx._id] === 'reject';
                      const isAnyLoading = !!txLoading[tx._id];
                      return (
                        <tr key={tx._id} onMouseEnter={e => e.currentTarget.style.background = '#fafbff'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                          <td style={tdS}><span style={{ fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>{tx.type?.replace(/_/g, ' ')}</span></td>
                          <td style={{ ...tdS, fontWeight: 700, fontSize: 14 }}>${tx.amount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                          <td style={tdS}>
                            <p style={{ margin: 0, fontSize: 12 }}>{tx.recipientName || tx.method || '—'}</p>
                            <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>{tx.memo || tx.recipientBank || ''}</p>
                          </td>
                          <td style={{ ...tdS, fontSize: 12, color: '#64748b' }}>{new Date(tx.date).toLocaleDateString('en-US', { dateStyle: 'medium' })}</td>
                          <td style={tdS}>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button onClick={() => handleTxAction(tx._id, 'approve')} disabled={isAnyLoading}
                                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 7, background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', fontSize: 12, fontWeight: 600, cursor: isAnyLoading ? 'not-allowed' : 'pointer', opacity: isAnyLoading && !isLoadingApprove ? 0.5 : 1, minWidth: 90, justifyContent: 'center' }}>
                                {isLoadingApprove ? <SpinnerDark /> : <CheckCircle size={13} />}
                                {isLoadingApprove ? 'Working…' : 'Approve'}
                              </button>
                              <button onClick={() => handleTxAction(tx._id, 'reject')} disabled={isAnyLoading}
                                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 7, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 12, fontWeight: 600, cursor: isAnyLoading ? 'not-allowed' : 'pointer', opacity: isAnyLoading && !isLoadingReject ? 0.5 : 1, minWidth: 80, justifyContent: 'center' }}>
                                {isLoadingReject ? <SpinnerDark /> : <XCircle size={13} />}
                                {isLoadingReject ? 'Working…' : 'Reject'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ADD TRANSACTION */}
        {tab === 'add' && (
          <div style={{ maxWidth: 480 }}>
            <h2 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Add Manual Transaction</h2>
            <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Transaction Type</label>
                <select value={manualTx.type} onChange={e => setManualTx(t => ({ ...t, type: e.target.value }))} style={{ ...inp, cursor: 'pointer' }}>
                  <option value="deposit">Deposit (Credit)</option>
                  <option value="withdrawal">Withdrawal (Debit)</option>
                  <option value="transfer_out">Transfer Out</option>
                  <option value="transfer_in">Transfer In</option>
                  <option value="fee">Fee</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Amount ($)</label>
                <input type="number" min="0.01" step="0.01" placeholder="0.00" value={manualTx.amount} onChange={e => setManualTx(t => ({ ...t, amount: e.target.value }))} style={inp} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Status</label>
                <select value={manualTx.status} onChange={e => setManualTx(t => ({ ...t, status: e.target.value }))} style={{ ...inp, cursor: 'pointer' }}>
                  <option value="completed">Completed (updates balance)</option>
                  <option value="pending">Pending (no balance change)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Description / Memo</label>
                <input placeholder="e.g. Account credit, Wire fee, Adjustment" value={manualTx.memo} onChange={e => setManualTx(t => ({ ...t, memo: e.target.value }))} style={inp} />
              </div>
              <button onClick={handleAddTx} disabled={addingTx}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px', borderRadius: 9, background: '#1a3c5e', color: 'white', fontWeight: 700, fontSize: 14, border: 'none', cursor: addingTx ? 'not-allowed' : 'pointer', opacity: addingTx ? 0.8 : 1, transition: 'opacity 0.15s' }}>
                {addingTx ? <><Spinner /> Adding transaction…</> : <><Plus size={15} /> Add Transaction</>}
              </button>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}