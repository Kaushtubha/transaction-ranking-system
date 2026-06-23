import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { TiltCard } from '../components/ui/TiltCard';
import { MagneticButton } from '../components/ui/MagneticButton';

const pageTransition = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30, filter: 'blur(10px)' },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } // Custom easing for luxury feel
};

export default function TransactionPage() {
  const { isSubmitting, processTransaction } = useStore();
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('credit');

  const handleTransaction = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || amount <= 0) return;
    const success = await processTransaction(amount, type);
    if (success) setAmount('');
  };

  return (
    <motion.div 
      {...pageTransition}
      className="pt-16 pb-32 flex flex-col items-center justify-center min-h-[80vh]"
    >
      <div className="text-center mb-16 relative z-10">
        <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-6 tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
          Execute Protocol
        </h1>
        <p className="text-muted text-lg max-w-xl mx-auto leading-relaxed">
          Initialize a secure transaction across the neural network.
        </p>
      </div>

      <TiltCard className="w-full max-w-md relative z-10">
        <div className="glass-panel p-10 flex flex-col relative overflow-visible rounded-3xl">
          {/* Subtle outer glow on the card itself */}
          <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-2xl pointer-events-none mix-blend-screen"></div>

          <h3 className="text-2xl font-display font-bold text-white mb-10 flex items-center gap-4 relative z-10">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] backdrop-blur-md">
              <CreditCard className="w-6 h-6 text-primary drop-shadow-[0_0_10px_rgba(168,216,240,0.8)]" />
            </div>
            Transfer Assets
          </h3>

          <form onSubmit={handleTransaction} className="flex flex-col space-y-8 relative z-10">
            <div className="relative group">
              <label className="block text-[10px] font-bold text-muted mb-3 uppercase tracking-[0.2em]">Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 font-display font-bold text-2xl">$</span>
                <input 
                  type="number" 
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="glass-input text-4xl font-display font-bold pl-12 h-20 bg-white/5 border-white/10 rounded-2xl"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-muted mb-3 uppercase tracking-[0.2em]">Action Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setType('credit')}
                  className={cn(
                    "h-16 rounded-2xl font-bold transition-all text-sm flex items-center justify-center gap-3 border relative overflow-hidden group/btn",
                    type === 'credit' 
                      ? "bg-primary/10 text-primary border-primary/30 shadow-[0_0_30px_rgba(168,216,240,0.15)]" 
                      : "bg-[#04070F]/40 text-muted border-transparent hover:bg-white/5 hover:text-white"
                  )}
                >
                  {type === 'credit' && <motion.div layoutId="type-glow" className="absolute inset-0 bg-primary/20 blur-xl transition-all" />}
                  <ArrowUpRight className="w-5 h-5 relative z-10 group-hover/btn:rotate-45 transition-transform" /> <span className="relative z-10">Deposit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType('debit')}
                  className={cn(
                    "h-16 rounded-2xl font-bold transition-all text-sm flex items-center justify-center gap-3 border relative overflow-hidden group/btn",
                    type === 'debit' 
                      ? "bg-accent/10 text-accent border-accent/30 shadow-[0_0_30px_rgba(94,64,194,0.15)]" 
                      : "bg-[#04070F]/40 text-muted border-transparent hover:bg-white/5 hover:text-white"
                  )}
                >
                  {type === 'debit' && <motion.div layoutId="type-glow" className="absolute inset-0 bg-accent/20 blur-xl transition-all" />}
                  <ArrowDownRight className="w-5 h-5 relative z-10 group-hover/btn:-rotate-45 transition-transform" /> <span className="relative z-10">Withdraw</span>
                </button>
              </div>
            </div>

            <div className="pt-4 flex justify-center">
              <MagneticButton 
                disabled={isSubmitting || !amount}
                className="w-full relative overflow-hidden rounded-full p-[1px] disabled:opacity-50 disabled:cursor-not-allowed group/submit"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary animate-[orbit_3s_linear_infinite] opacity-50 group-hover/submit:opacity-100 transition-opacity"></span>
                <div className="btn-submit h-16 w-full flex items-center justify-center relative bg-black rounded-full text-white">
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="loader-ring w-5 h-5 border-[2px]"></div>
                      Processing...
                    </div>
                  ) : 'Confirm Transaction'}
                </div>
              </MagneticButton>
            </div>
          </form>
        </div>
      </TiltCard>
    </motion.div>
  );
}
