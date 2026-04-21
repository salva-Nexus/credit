// frontend/src/components/History.jsx
import React, { useState, useEffect } from 'react';
import API from '../api';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPaths, setExpandedPaths] = useState(new Set());

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get('/api/investor/history', {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        setTransactions(res.data);
      } catch (err) {
        console.error("History Fetch Error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const groupTransactions = (data) => {
    if (!data || data.length === 0) return {};
    const tree = {};
    data.forEach(tx => {
      const dateValue = tx.date || tx.createdAt || tx.timestamp;
      if (!dateValue) return;
      const d = new Date(dateValue);
      if (isNaN(d.getTime())) return;
      const year = d.getFullYear();
      const monthIdx = d.getMonth();
      const monthName = d.toLocaleString('default', { month: 'long' });
      const semester = monthIdx < 6 ? 'H1 (Jan–Jun)' : 'H2 (Jul–Dec)';
      const day = d.toLocaleDateString('default', { weekday: 'long', day: 'numeric', month: 'short' });
      if (!tree[year]) tree[year] = {};
      if (!tree[year][semester]) tree[year][semester] = {};
      if (!tree[year][semester][monthName]) tree[year][semester][monthName] = {};
      if (!tree[year][semester][monthName][day]) tree[year][semester][monthName][day] = [];
      tree[year][semester][monthName][day].push(tx);
    });
    return tree;
  };

  const toggle = (path) => {
    const newPaths = new Set(expandedPaths);
    newPaths.has(path) ? newPaths.delete(path) : newPaths.add(path);
    setExpandedPaths(newPaths);
  };

  const groupedData = groupTransactions(transactions);

  const statusColor = { success: '#10b981', completed: '#10b981', pending: '#f59e0b', failed: '#ef4444' };

  const Folder = ({ title, children, path, level }) => {
    const isOpen = expandedPaths.has(path);
    return (
      <div className="mb-1.5">
        <button onClick={() => toggle(path)}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-left"
          style={{
            marginLeft: `${level * 14}px`,
            background: isOpen ? 'rgba(59,130,246,0.06)' : 'transparent',
            color: isOpen ? '#93c5fd' : '#4a6fa5',
          }}
          onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
          onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = 'transparent'; }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"
            style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
            <path d="M4 2l4 4-4 4" />
          </svg>
          <span className="text-xs font-semibold uppercase tracking-wider">{title}</span>
        </button>
        {isOpen && (
          <div style={{ marginLeft: `${level * 14}px`, borderLeft: '0.5px solid rgba(26,58,110,0.25)', paddingLeft: '12px' }}>
            {children}
          </div>
        )}
      </div>
    );
  };

  if (loading) return (
    <div className="p-10 text-xs uppercase tracking-widest animate-pulse" style={{ color: '#3b82f6' }}>
      Loading transaction archive...
    </div>
  );

  return (
    <div className="max-w-3xl animate-in fade-in duration-500">
      <header className="mb-10">
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#e8f0ff' }}>Transaction History</h1>
        <p className="text-xs uppercase tracking-wide" style={{ color: '#3b5a9e' }}>
          Year → Semester → Month → Day
        </p>
      </header>

      {transactions.length === 0 ? (
        <div className="py-20 text-center rounded-2xl" style={{ border: '0.5px dashed rgba(26,58,110,0.4)' }}>
          <p className="text-xs uppercase tracking-widest" style={{ color: '#1e3a6e' }}>No transaction records found</p>
        </div>
      ) : (
        Object.keys(groupedData).sort().reverse().map(year => (
          <Folder key={year} title={year} path={year} level={0}>
            {Object.keys(groupedData[year]).map(sem => (
              <Folder key={sem} title={sem} path={`${year}-${sem}`} level={1}>
                {Object.keys(groupedData[year][sem]).map(month => (
                  <Folder key={month} title={month} path={`${year}-${sem}-${month}`} level={2}>
                    {Object.keys(groupedData[year][sem][month]).map(day => (
                      <Folder key={day} title={day} path={`${year}-${sem}-${month}-${day}`} level={3}>
                        <div className="space-y-2 py-2">
                          {groupedData[year][sem][month][day].map(tx => (
                            <div key={tx._id}
                              className="flex items-center justify-between p-4 rounded-xl transition-all"
                              style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(26,58,110,0.25)' }}>
                              <div>
                                <p className="text-sm font-medium capitalize" style={{ color: '#c8d6f0' }}>
                                  {tx.type || 'Transaction'}
                                </p>
                                <p className="text-xs" style={{ color: '#3b5a9e' }}>
                                  {tx.coin || 'N/A'} · {tx.network || 'Network'}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold" style={{ color: '#e8f0ff' }}>${tx.amount?.toLocaleString()}</p>
                                <p className="text-xs font-semibold" style={{ color: statusColor[tx.status] || '#f59e0b' }}>
                                  {tx.status}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Folder>
                    ))}
                  </Folder>
                ))}
              </Folder>
            ))}
          </Folder>
        ))
      )}
    </div>
  );
};

export default History;