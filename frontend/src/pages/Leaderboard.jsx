import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

export default function Leaderboard() {
  const { rankings, isRankingLoading, fetchRankings } = useStore();

  useEffect(() => {
    fetchRankings();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Trophy className="text-accent" /> Live Rankings
        </h1>
        <p className="text-muted">Users ranked by our multi-factor fairness algorithm.</p>
      </motion.div>

      {isRankingLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1,2,3].map(i => (
            <div key={i} className="h-20 bg-white/5 rounded-2xl w-full"></div>
          ))}
        </div>
      ) : rankings.length === 0 ? (
        <div className="glass-panel p-12 text-center flex flex-col items-center justify-center">
          <Trophy className="w-16 h-16 text-white/10 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No Rankings Yet</h2>
          <p className="text-muted">Submit some transactions to populate the leaderboard.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rankings.map((user, idx) => (
            <motion.div 
              key={user.userId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-6">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold",
                  idx === 0 ? "bg-amber-500/20 text-amber-500 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]" : 
                  idx === 1 ? "bg-slate-300/20 text-slate-300 border border-slate-300/50" :
                  idx === 2 ? "bg-amber-700/20 text-amber-600 border border-amber-700/50" :
                  "bg-white/5 text-muted border border-white/10"
                )}>
                  #{user.rank}
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-white">{user.userId}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs">
                    <span className="flex items-center text-muted">
                      <Activity className="w-3 h-3 mr-1" /> Score: {user.score}
                    </span>
                    {user.breakdown.reliability < 100 && (
                      <span className="flex items-center text-rose-400 bg-rose-400/10 px-2 py-0.5 rounded-full">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Flagged
                      </span>
                    )}
                    {user.breakdown.reliability === 100 && (
                      <span className="flex items-center text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Breakdown metrics */}
              <div className="grid grid-cols-4 gap-4 bg-black/20 rounded-xl p-3 md:w-[400px]">
                <div className="text-center">
                  <p className="text-[10px] text-muted uppercase font-bold mb-1">Volume</p>
                  <p className="text-sm font-medium text-primary">{user.breakdown.amount}</p>
                </div>
                <div className="text-center border-l border-white/10">
                  <p className="text-[10px] text-muted uppercase font-bold mb-1">Freq</p>
                  <p className="text-sm font-medium text-white">{user.breakdown.count}</p>
                </div>
                <div className="text-center border-l border-white/10">
                  <p className="text-[10px] text-muted uppercase font-bold mb-1">Recency</p>
                  <p className="text-sm font-medium text-white">{user.breakdown.recency}</p>
                </div>
                <div className="text-center border-l border-white/10">
                  <p className="text-[10px] text-muted uppercase font-bold mb-1">Trust</p>
                  <p className="text-sm font-medium text-white">{user.breakdown.reliability}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
