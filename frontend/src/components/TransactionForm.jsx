import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { submitTransaction } from '../api';

export default function TransactionForm() {
  const [formData, setFormData] = useState({
    userId: 'user_123',
    amount: '',
    type: 'credit'
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    
    // Auto-generate unique IDs
    const transactionId = uuidv4();
    const idempotencyKey = uuidv4();
    
    const payload = {
      transactionId,
      userId: formData.userId,
      amount: parseFloat(formData.amount),
      timestamp: new Date().toISOString(),
      type: formData.type,
      metadata: { source: 'web_ui' }
    };

    try {
      await submitTransaction(payload, idempotencyKey);
      setStatus('Transaction submitted successfully!');
      setFormData(prev => ({ ...prev, amount: '' }));
    } catch (err) {
      setStatus(`Error: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '60vh' }}>
      <div className="glass-card" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }} className="text-neon">Submit Transaction</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>User ID</label>
            <input 
              type="text" 
              value={formData.userId} 
              onChange={e => setFormData({...formData, userId: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Amount</label>
            <input 
              type="number" 
              step="0.01"
              value={formData.amount} 
              onChange={e => setFormData({...formData, amount: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select 
              value={formData.type} 
              onChange={e => setFormData({...formData, type: e.target.value})}
            >
              <option value="credit">Credit (Add Funds)</option>
              <option value="debit">Debit (Remove Funds)</option>
            </select>
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Submit'}
          </button>
          
          {status && (
            <p style={{ marginTop: '1rem', textAlign: 'center', color: status.includes('Error') ? '#ff3366' : '#00f3ff' }}>
              {status}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
