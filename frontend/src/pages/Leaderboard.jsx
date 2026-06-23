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

export default function RankingPage() {
  const { rankings, isRankingLoading, fetchRankings } = useStore();

  useEffect(() => {
    fetchRankings();
  }, []);

  return (
    <motion.div 
      {...pageTransition}
      className="pt-32 pb-32 max-w-5xl mx-auto px-4"
    >
      <div className="mb-16 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-black font-display text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-4 flex items-center justify-center gap-4 tracking-tighter">
          <Trophy className="text-primary w-10 h-10 drop-shadow-[0_0_20px_rgba(168,216,240,0.6)]" /> 
          Global Rankings
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
          The elite tier of active network participants.
        </p>
      </div>

      {isRankingLoading ? (
        <div className="flex items-center justify-center p-12 relative z-10">
          <div className="loader-ring w-16 h-16"></div>
        </div>
      ) : rankings.length === 0 ? (
        <div className="glass-panel p-16 text-center flex flex-col items-center justify-center border-dashed border-2 border-white/10 bg-transparent relative z-10">
          <Trophy className="w-16 h-16 text-white/10 mb-6" />
          <h2 className="text-2xl font-bold font-display text-white mb-2 tracking-tight">No Rankings Yet</h2>
          <p className="text-muted max-w-sm">Initialize transactions to populate the network leaderboard.</p>
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4 perspective-1000 relative z-10"
        >
          {rankings.map((user, idx) => (
            <motion.div key={user.userId} variants={item}>
              <TiltCard>
                <div className={cn(
                  "glass-panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/5 transition-colors relative overflow-hidden group",
                  idx === 0 ? "rank-glow-1" :
                  idx === 1 ? "rank-glow-2" :
                  idx === 2 ? "rank-glow-3" : ""
                )}>
                  
                  <div className="flex items-center gap-6 relative z-10">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center text-xl font-display font-bold shadow-[0_0_15px_rgba(255,255,255,0.1)]",
                      idx === 0 ? "bg-[#eab308] text-black shadow-[0_0_20px_rgba(234,179,8,0.6)]" : 
                      idx === 1 ? "bg-[#cbd5e1] text-black shadow-[0_0_20px_rgba(203,213,225,0.6)]" :
                      idx === 2 ? "bg-[#d97706] text-white shadow-[0_0_20px_rgba(217,119,6,0.6)]" :
                      "bg-white/10 text-muted border border-white/10"
                    )}>
                      {idx === 0 ? <Flame className="w-6 h-6 text-black" /> : `#${user.rank}`}
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold font-display text-white tracking-tight">{user.userId}</h3>
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] font-bold uppercase tracking-widest">
                        <span className="flex items-center text-primary">
                          <Activity className="w-3 h-3 mr-1" /> {(user.score * 100).toFixed(1)} Pts
                        </span>
                        {user.breakdown.reliability < 100 ? (
                          <span className="flex items-center text-rose-400">
                            <AlertTriangle className="w-3 h-3 mr-1" /> Flagged
                          </span>
                        ) : (
                          <span className="flex items-center text-emerald-400">
                            <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 bg-[#04070F]/60 rounded-xl p-2 border border-white/5 md:w-[400px] relative z-10 shadow-inner">
                    <div className="text-center p-2 rounded-lg hover:bg-white/5 transition-colors">
                      <p className="text-[9px] text-muted uppercase font-bold tracking-widest mb-1">Vol</p>
                      <p className="text-sm font-bold text-white">{user.breakdown.amount}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg hover:bg-white/5 transition-colors border-l border-white/5">
                      <p className="text-[9px] text-muted uppercase font-bold tracking-widest mb-1">Freq</p>
                      <p className="text-sm font-bold text-white">{user.breakdown.count}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg hover:bg-white/5 transition-colors border-l border-white/5">
                      <p className="text-[9px] text-muted uppercase font-bold tracking-widest mb-1">Recency</p>
                      <p className="text-sm font-bold text-white">{user.breakdown.recency}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg hover:bg-white/5 transition-colors border-l border-white/5">
                      <p className="text-[9px] text-muted uppercase font-bold tracking-widest mb-1">Trust</p>
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
