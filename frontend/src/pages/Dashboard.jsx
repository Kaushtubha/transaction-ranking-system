import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Wallet, Activity, CreditCard } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Dashboard() {
  const { summary, isSummaryLoading, fetchSummary, isSubmitting, processTransaction } = useStore();
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('credit');

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleTransaction = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || amount <= 0) return;
    const success = await processTransaction(amount, type);
    if (success) setAmount('');
  };

  // Prepare chart data from transactions
  const chartData = summary?.transactions?.slice().reverse().map((tx, i) => ({
    name: `Tx ${i+1}`,
    amount: tx.type === 'credit' ? Math.abs(tx.amount) : -Math.abs(tx.amount),
    rawAmount: Math.abs(tx.amount)
  })) || [];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Overview</h1>
        <p className="text-muted">Track your balance and submit new transactions.</p>
      </motion.div>

      {isSummaryLoading && !summary ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
          <div className="h-32 bg-white/5 rounded-2xl"></div>
          <div className="h-32 bg-white/5 rounded-2xl"></div>
          <div className="h-32 bg-white/5 rounded-2xl"></div>
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Metrics */}
          <motion.div variants={item} className="glass-panel p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted mb-1">Total Volume</p>
                <h3 className="text-3xl font-bold text-white">
                  ${summary?.total_amount?.toFixed(2) || '0.00'}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-primary/10">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-emerald-400">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span>Healthy account</span>
            </div>
          </motion.div>

          <motion.div variants={item} className="glass-panel p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted mb-1">Total Transactions</p>
                <h3 className="text-3xl font-bold text-white">
                  {summary?.transaction_count || 0}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-accent/10">
                <Activity className="w-5 h-5 text-accent" />
              </div>
            </div>
          </motion.div>

          {/* Transaction Form */}
          <motion.div variants={item} className="glass-panel p-6 lg:row-span-2">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              New Transaction
            </h3>
            <form onSubmit={handleTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Amount ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="glass-input text-2xl font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setType('credit')}
                    className={cn(
                      "py-3 px-4 rounded-xl font-medium transition-all text-sm flex items-center justify-center gap-2 border",
                      type === 'credit' 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/50" 
                        : "bg-white/5 text-muted border-transparent hover:bg-white/10"
                    )}
                  >
                    <ArrowUpRight className="w-4 h-4" /> Credit
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('debit')}
                    className={cn(
                      "py-3 px-4 rounded-xl font-medium transition-all text-sm flex items-center justify-center gap-2 border",
                      type === 'debit' 
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/50" 
                        : "bg-white/5 text-muted border-transparent hover:bg-white/10"
                    )}
                  >
                    <ArrowDownRight className="w-4 h-4" /> Debit
                  </button>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting || !amount}
                className="premium-button-primary w-full mt-6"
              >
                {isSubmitting ? 'Processing...' : 'Submit Transaction'}
              </button>
            </form>
          </motion.div>

          {/* Chart */}
          <motion.div variants={item} className="glass-panel p-6 lg:col-span-2 h-80">
            <h3 className="text-sm font-medium text-muted mb-6">Activity Timeline</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#8b8b9b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#8b8b9b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#12121a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="rawAmount" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted">
                No transaction data available yet.
              </div>
            )}
          </motion.div>

        </motion.div>
      )}
    </div>
  );
}
