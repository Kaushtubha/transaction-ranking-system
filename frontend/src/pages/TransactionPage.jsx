import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { TiltCard } from '../components/ui/TiltCard';

const pageTransition = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30, filter: 'blur(10px)' },
  transition: { duration: 0.4, ease: "easeOut" }
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
      className="pt-32 pb-32 flex flex-col items-center justify-center min-h-screen"
    >
      <div className="text-center mb-12 relative z-10">
        <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4 tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          Execute Protocol
        </h1>
        <p className="text-muted text-lg max-w-xl mx-auto leading-relaxed">
          Initialize a secure transaction across the neural network.
        </p>
      </div>

      <TiltCard className="w-full max-w-md relative z-10">
        <div className="glass-panel p-8 flex flex-col relative overflow-visible">
          {/* Subtle outer glow on the card itself */}
          <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl pointer-events-none"></div>

          <h3 className="text-xl font-display font-bold text-white mb-8 flex items-center gap-3 relative z-10">
            <div className="p-2 bg-white/5 rounded-lg border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            Transfer Assets
          </h3>

          <form onSubmit={handleTransaction} className="flex flex-col space-y-6 relative z-10">
            <div className="relative group">
              <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-widest">Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-bold text-xl">$</span>
                <input 
                  type="number" 
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="glass-input text-3xl font-bold pl-10 h-16"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-widest">Action</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setType('credit')}
                  className={cn(
                    "h-14 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2 border relative overflow-hidden",
                    type === 'credit' 
                      ? "bg-primary/20 text-primary border-primary/50 shadow-[0_0_20px_rgba(168,216,240,0.3)]" 
                      : "bg-[#04070F]/40 text-muted border-transparent hover:bg-white/5 hover:text-white"
                  )}
                >
                  {type === 'credit' && <motion.div layoutId="type-glow" className="absolute inset-0 bg-primary/10 blur-md" />}
                  <ArrowUpRight className="w-5 h-5 relative z-10" /> <span className="relative z-10">Deposit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType('debit')}
                  className={cn(
                    "h-14 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2 border relative overflow-hidden",
                    type === 'debit' 
                      ? "bg-accent/20 text-accent border-accent/50 shadow-[0_0_20px_rgba(94,64,194,0.3)]" 
                      : "bg-[#04070F]/40 text-muted border-transparent hover:bg-white/5 hover:text-white"
                  )}
                >
                  {type === 'debit' && <motion.div layoutId="type-glow" className="absolute inset-0 bg-accent/10 blur-md" />}
                  <ArrowDownRight className="w-5 h-5 relative z-10" /> <span className="relative z-10">Withdraw</span>
                </button>
              </div>
            </div>

            <button 
              disabled={isSubmitting || !amount}
              className="btn-submit mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="loader-ring w-5 h-5 border-[2px]"></div>
                  Processing...
                </div>
              ) : 'Submit Transaction'}
            </button>
          </form>
        </div>
      </TiltCard>
    </motion.div>
  );
}
