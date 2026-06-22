import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Activity, AlertTriangle, ShieldCheck, Flame } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { TiltCard } from '../components/ui/TiltCard';

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
  hidden: { opacity: 0, x: -50, filter: 'blur(10px)' },
  show: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Leaderboard() {
  const { rankings, isRankingLoading, fetchRankings } = useStore();

  useEffect(() => {
    fetchRankings();
  }, []);

  return (
    <motion.div 
      {...pageTransition}
      className="pt-12 md:pt-16 max-w-5xl mx-auto pb-32"
    >
      <div className="mb-16 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/20 rounded-full blur-[80px] pointer-events-none"></div>
        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-4 flex items-center justify-center gap-4 tracking-tighter">
          <Trophy className="text-accent w-10 h-10 drop-shadow-[0_0_20px_rgba(139,92,246,0.6)]" /> 
          Global Rankings
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
          Fairness enforced by our advanced multi-factor machine learning algorithm.
        </p>
      </div>

      {isRankingLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1,2,3].map(i => (
            <div key={i} className="h-24 bg-white/5 rounded-2xl w-full border border-white/10"></div>
          ))}
        </div>
      ) : rankings.length === 0 ? (
        <div className="glass-panel p-16 text-center flex flex-col items-center justify-center border-dashed border-2 border-white/10 bg-transparent">
          <Trophy className="w-16 h-16 text-white/10 mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">No Rankings Yet</h2>
          <p className="text-muted max-w-sm">Submit some transactions on the dashboard to populate the leaderboard.</p>
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4 perspective-1000"
        >
          {rankings.map((user, idx) => (
            <motion.div key={user.userId} variants={item}>
              <TiltCard>
                <div className="glass-panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/5 transition-colors relative overflow-hidden group">
                  
                  {/* Rank highlight glow for top 3 */}
                  {idx === 0 && <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />}
                  {idx === 1 && <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-slate-300/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />}
                  {idx === 2 && <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-amber-700/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />}

                  <div className="flex items-center gap-6 relative z-10">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg",
                      idx === 0 ? "bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow-[0_0_30px_rgba(245,158,11,0.4)] border-none" : 
                      idx === 1 ? "bg-gradient-to-br from-slate-200 to-slate-400 text-black shadow-[0_0_20px_rgba(203,213,225,0.3)] border-none" :
                      idx === 2 ? "bg-gradient-to-br from-amber-700 to-amber-900 text-white shadow-[0_0_20px_rgba(180,83,9,0.3)] border-none" :
                      "bg-black/40 text-muted border border-white/10"
                    )}>
                      {idx === 0 ? <Flame className="w-7 h-7 text-black drop-shadow-md" /> : `#${user.rank}`}
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">{user.userId}</h3>
                      <div className="flex items-center gap-3 mt-1.5 text-xs font-bold uppercase tracking-wider">
                        <span className="flex items-center text-primary bg-primary/10 px-2 py-1 rounded-md border border-primary/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                          <Activity className="w-3 h-3 mr-1.5" /> {(user.score * 100).toFixed(1)} Pts
                        </span>
                        {user.breakdown.reliability < 100 ? (
                          <span className="flex items-center text-rose-400 bg-rose-400/10 px-2 py-1 rounded-md border border-rose-400/20">
                            <AlertTriangle className="w-3 h-3 mr-1.5" /> Flagged
                          </span>
                        ) : (
                          <span className="flex items-center text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md border border-emerald-400/20">
                            <ShieldCheck className="w-3 h-3 mr-1.5" /> Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Breakdown metrics */}
                  <div className="grid grid-cols-4 gap-2 bg-black/40 rounded-xl p-2 border border-white/5 md:w-[450px] relative z-10 shadow-inner">
                    <div className="text-center p-2 rounded-lg hover:bg-white/5 transition-colors">
                      <p className="text-[9px] text-muted uppercase font-black tracking-widest mb-1">Volume</p>
                      <p className="text-sm font-bold text-white">{user.breakdown.amount}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg hover:bg-white/5 transition-colors border-l border-white/5">
                      <p className="text-[9px] text-muted uppercase font-black tracking-widest mb-1">Freq</p>
                      <p className="text-sm font-bold text-white">{user.breakdown.count}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg hover:bg-white/5 transition-colors border-l border-white/5">
                      <p className="text-[9px] text-muted uppercase font-black tracking-widest mb-1">Recency</p>
                      <p className="text-sm font-bold text-white">{user.breakdown.recency}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg hover:bg-white/5 transition-colors border-l border-white/5">
                      <p className="text-[9px] text-muted uppercase font-black tracking-widest mb-1">Trust</p>
                      <p className={cn(
                        "text-sm font-bold",
                        user.breakdown.reliability < 100 ? "text-rose-400" : "text-emerald-400"
                      )}>{user.breakdown.reliability}</p>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
