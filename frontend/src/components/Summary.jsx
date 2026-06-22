import React, { useState, useEffect } from 'react';
import { getSummary } from '../api';

export default function Summary() {
  const [userId, setUserId] = useState('user_123');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSummary = async (uid) => {
    setLoading(true);
    try {
      const data = await getSummary(uid);
      setSummary(data);
    } catch (err) {
      console.error(err);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary(userId);
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div className="glass-card" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
        <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
          <label>View Summary for User ID</label>
          <input 
            type="text" 
            value={userId} 
            onChange={(e) => setUserId(e.target.value)} 
          />
        </div>
        <button style={{ width: 'auto', padding: '0.8rem 2rem' }} onClick={() => fetchSummary(userId)}>
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-neon" style={{ textAlign: 'center' }}>Loading...</p>
      ) : summary ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="glass-card">
              <h3 style={{ color: '#888', fontSize: '0.9rem', textTransform: 'uppercase' }}>Total Volume</h3>
              <p className="text-neon" style={{ fontSize: '2.5rem', fontWeight: 800 }}>
                ${summary.total_amount.toFixed(2)}
              </p>
            </div>
            <div className="glass-card">
              <h3 style={{ color: '#888', fontSize: '0.9rem', textTransform: 'uppercase' }}>Transactions</h3>
              <p className="text-purple" style={{ fontSize: '2.5rem', fontWeight: 800 }}>
                {summary.transaction_count}
              </p>
            </div>
          </div>

          <h2 style={{ marginBottom: '1rem' }}>Transaction History</h2>
          {summary.transactions.length === 0 ? (
            <p>No transactions found.</p>
          ) : (
            <div className="transaction-list">
              {summary.transactions.map((tx, idx) => (
                <div key={idx} className={`transaction-item ${tx.type}`}>
                  <div>
                    <p className="tx-amount" style={{ color: tx.type === 'credit' ? 'var(--accent-neon)' : '#ff3366' }}>
                      {tx.type === 'credit' ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                    </p>
                    <p className="tx-meta">{new Date(tx.timestamp).toLocaleString()}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p className="tx-meta" style={{ fontFamily: 'monospace' }}>{tx.transactionId.substring(0, 8)}...</p>
                    <p className="tx-meta" style={{ textTransform: 'uppercase' }}>{tx.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
