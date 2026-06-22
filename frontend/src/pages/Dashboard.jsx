import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Wallet, Activity, CreditCard } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { TiltCard } from '../components/ui/TiltCard';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { MagneticButton } from '../components/ui/MagneticButton';
import { AICore } from '../components/ui/AICore';

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20, filter: 'blur(10px)' },
  transition: { duration: 0.4, ease: "easeOut" }
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 border border-white/20 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
        <p className="text-muted text-xs uppercase tracking-wider mb-1">{label}</p>
        <p className="text-white font-bold text-lg">
          ${payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
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

  const chartData = summary?.transactions?.slice().reverse().map((tx, i) => ({
    name: `Tx ${i+1}`,
    amount: tx.type === 'credit' ? Math.abs(tx.amount) : -Math.abs(tx.amount),
    rawAmount: Math.abs(tx.amount)
  })) || [];

  return (
    <motion.div 
      {...pageTransition}
      className="pt-12 md:pt-16 pb-32"
    >
      <div className="text-center mb-16 relative">
        <AICore />
        <h1 className="text-5xl md:text-6xl font-black font-display text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-4 tracking-tighter">
          Financial Intelligence
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
          Monitor your activity and execute transactions through our secure, high-performance neural network.
        </p>
      </div>

      {isSummaryLoading && !summary ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
          <div className="h-32 bg-white/5 rounded-2xl border border-white/10"></div>
          <div className="h-32 bg-white/5 rounded-2xl border border-white/10"></div>
          <div className="h-[400px] bg-white/5 rounded-2xl border border-white/10 lg:row-span-2"></div>
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Metrics */}
          <motion.div variants={item}>
            <TiltCard className="h-full">
              <div className="glass-panel p-6 flex flex-col justify-between h-full bg-gradient-to-br from-white/5 to-transparent">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted mb-1 uppercase tracking-widest">Total Volume</p>
                    <h3 className="text-4xl font-bold text-white tracking-tight">
                      <AnimatedCounter value={summary?.total_amount || 0} />
                    </h3>
                  </div>
                  <div className="p-3 rounded-xl bg-primary/20 border border-primary/30 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                    <Wallet className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="mt-6 flex items-center text-sm text-emerald-400 bg-emerald-400/10 w-max px-3 py-1 rounded-full border border-emerald-400/20">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span className="font-medium">Healthy Account</span>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          <motion.div variants={item}>
            <TiltCard className="h-full">
              <div className="glass-panel p-6 flex flex-col justify-between h-full bg-gradient-to-br from-white/5 to-transparent">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted mb-1 uppercase tracking-widest">Transactions</p>
                    <h3 className="text-4xl font-bold text-white tracking-tight">
                      <AnimatedCounter value={summary?.transaction_count || 0} />
                    </h3>
                  </div>
                  <div className="p-3 rounded-xl bg-accent/20 border border-accent/30 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                    <Activity className="w-6 h-6 text-accent" />
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Transaction Form */}
          <motion.div variants={item} className="lg:row-span-2 flex flex-col">
            <TiltCard className="flex-1">
              <div className="glass-panel p-8 flex flex-col h-full bg-gradient-to-b from-white/5 to-transparent relative overflow-hidden">
                
                {/* Decorative background glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-[60px] pointer-events-none"></div>

                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg border border-white/20">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  New Transaction
                </h3>

                <form onSubmit={handleTransaction} className="flex-1 flex flex-col">
                  <div className="flex-1 space-y-6">
                    <div className="relative group">
                      <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-widest">Amount (USD)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 font-bold text-xl">$</span>
                        <input 
                          type="number" 
                          step="0.01"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.00"
                          className="glass-input text-3xl font-bold pl-10 h-16 bg-black/60 shadow-inner"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-widest">Type</label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setType('credit')}
                          className={cn(
                            "h-14 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2 border shadow-lg relative overflow-hidden",
                            type === 'credit' 
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]" 
                              : "bg-white/5 text-muted border-transparent hover:bg-white/10 hover:text-white"
                          )}
                        >
                          {type === 'credit' && <motion.div layoutId="type-glow" className="absolute inset-0 bg-emerald-500/10 blur-md" />}
                          <ArrowUpRight className="w-5 h-5 relative z-10" /> <span className="relative z-10">Credit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setType('debit')}
                          className={cn(
                            "h-14 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2 border shadow-lg relative overflow-hidden",
                            type === 'debit' 
                              ? "bg-rose-500/20 text-rose-400 border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.2)]" 
                              : "bg-white/5 text-muted border-transparent hover:bg-white/10 hover:text-white"
                          )}
                        >
                          {type === 'debit' && <motion.div layoutId="type-glow" className="absolute inset-0 bg-rose-500/10 blur-md" />}
                          <ArrowDownRight className="w-5 h-5 relative z-10" /> <span className="relative z-10">Debit</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <MagneticButton 
                    disabled={isSubmitting || !amount}
                    className="w-full h-14 bg-white text-black font-bold rounded-xl mt-8 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                  >
                    {isSubmitting ? 'Processing safely...' : 'Submit Now'}
                  </MagneticButton>
                </form>
              </div>
            </TiltCard>
          </motion.div>

          {/* Chart */}
          <motion.div variants={item} className="glass-panel p-8 lg:col-span-2 h-[400px] flex flex-col relative overflow-hidden">
            {/* Ambient glow behind chart */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>

            <h3 className="text-sm font-bold text-muted mb-8 uppercase tracking-widest relative z-10">Activity Timeline</h3>
            
            <div className="flex-1 relative z-10">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="#8b8b9b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#8b8b9b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} dx={-10} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }} />
                    <Area 
                      type="monotone" 
                      dataKey="rawAmount" 
                      stroke="#3b82f6" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#colorAmount)"
                      filter="url(#glow)"
                      animationDuration={1500}
                      animationEasing="ease-out"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted border border-dashed border-white/10 rounded-xl">
                  No transaction data available yet.
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Activity Feed */}
          <motion.div variants={item} className="lg:col-span-3 mt-8">
            <h3 className="text-lg font-display font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> Live Activity Feed
            </h3>
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {summary?.transactions?.length > 0 ? (
                  summary.transactions.slice().reverse().map((tx, idx) => (
                    <motion.div
                      key={tx.transaction_id || idx}
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="glass-panel p-5 flex items-center justify-between hover:bg-white/5 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center border shadow-inner",
                          tx.type === 'credit' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                        )}>
                          {tx.type === 'credit' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
                        </div>
                        <div>
                          <p className="font-bold text-white text-lg font-display">
                            {tx.type === 'credit' ? 'Deposit' : 'Withdrawal'}
                          </p>
                          <p className="text-xs text-muted tracking-wider uppercase">
                            {new Date(tx.timestamp).toLocaleTimeString()} • {tx.transaction_id.slice(0,8)}...
                          </p>
                        </div>
                      </div>
                      <div className={cn(
                        "text-xl font-black font-display tracking-tight",
                        tx.type === 'credit' ? "text-emerald-400" : "text-rose-400"
                      )}>
                        {tx.type === 'credit' ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="glass-panel p-8 text-center text-muted border-dashed border-white/10">
                    Awaiting incoming transactions to build feed.
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </motion.div>
      )}
    </motion.div>
  );
}
