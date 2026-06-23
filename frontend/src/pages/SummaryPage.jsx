import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Activity, Wallet, Hash } from 'lucide-react';
import { useStore } from '../store/useStore';
import { TiltCard } from '../components/ui/TiltCard';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';

const pageTransition = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30, filter: 'blur(10px)' },
  transition: { duration: 0.4, ease: "easeOut" }
};

export default function SummaryPage() {
  const { summary, isSummaryLoading, fetchSummary } = useStore();
  const [searchInput, setSearchInput] = useState('');
  const [searchedUserId, setSearchedUserId] = useState(null);

  // Default to fetching for user1 on initial load if we want to show something,
  // but prompt says "User ID input with animated search icon".
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchedUserId(searchInput.trim());
      fetchSummary(searchInput.trim());
    }
  };

  const avgAmount = summary?.transaction_count > 0 
    ? summary.total_amount / summary.transaction_count 
    : 0;

  return (
    <motion.div 
      {...pageTransition}
      className="pt-32 pb-32 flex flex-col items-center min-h-screen max-w-4xl mx-auto px-4"
    >
      <div className="w-full text-center mb-12 relative z-10">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          Account Summary
        </h1>
        <p className="text-muted text-lg max-w-xl mx-auto leading-relaxed">
          Query the network for real-time wallet statistics.
        </p>
      </div>

      <form onSubmit={handleSearch} className="w-full max-w-lg mb-12 relative z-10">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary group-focus-within:animate-pulse shadow-[0_0_10px_rgba(168,216,240,0.5)] rounded-full" />
          <input 
            type="text" 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Enter User ID (e.g. user1)"
            className="glass-input pl-12 h-14 font-display text-lg"
          />
          <button type="submit" className="hidden">Search</button>
        </div>
      </form>

      <AnimatePresence mode="wait">
        {isSummaryLoading ? (
          <motion.div 
            key="loader"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center justify-center p-12 relative z-10"
          >
            <div className="loader-ring w-16 h-16"></div>
          </motion.div>
        ) : summary ? (
          <motion.div 
            key="results"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10"
          >
            <TiltCard>
              <div className="glass-panel p-6 flex flex-col items-center justify-center text-center h-40 group">
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(168,216,240,0.2)]">
                  <Hash className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs font-bold text-muted uppercase tracking-widest mb-1">Total TXs</p>
                <h3 className="text-3xl font-display font-bold text-white">
                  <AnimatedCounter value={summary.transaction_count} />
                </h3>
              </div>
            </TiltCard>

            <TiltCard>
              <div className="glass-panel p-6 flex flex-col items-center justify-center text-center h-40 group">
                <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(94,64,194,0.2)]">
                  <Wallet className="w-5 h-5 text-accent" />
                </div>
                <p className="text-xs font-bold text-muted uppercase tracking-widest mb-1">Total Volume</p>
                <h3 className="text-3xl font-display font-bold text-white flex items-center">
                  $<AnimatedCounter value={summary.total_amount} />
                </h3>
              </div>
            </TiltCard>

            <TiltCard>
              <div className="glass-panel p-6 flex flex-col items-center justify-center text-center h-40 group">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <Activity className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-xs font-bold text-muted uppercase tracking-widest mb-1">Avg Amount</p>
                <h3 className="text-3xl font-display font-bold text-white flex items-center">
                  $<AnimatedCounter value={avgAmount} />
                </h3>
              </div>
            </TiltCard>
          </motion.div>
        ) : searchedUserId ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel p-8 text-center border-dashed border-white/10 max-w-lg w-full relative z-10"
          >
            <p className="text-muted">No transaction data found for <span className="text-white font-bold">{searchedUserId}</span>.</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
