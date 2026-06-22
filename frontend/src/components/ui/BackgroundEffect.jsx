import React from 'react';
import { motion } from 'framer-motion';

export default function BackgroundEffect() {
  return (
    <>
      <div className="noise-overlay"></div>
      
      {/* Animated Grid */}
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden [mask-image:linear-gradient(to_bottom,white,transparent)]">
        <div className="absolute inset-[-100%] h-[300%] bg-grid-pattern opacity-30 animate-grid-scroll"></div>
      </div>

      {/* Aurora glowing orbs */}
      <div className="fixed inset-0 z-[-2] pointer-events-none overflow-hidden blur-[120px] opacity-60">
        <motion.div 
          animate={{ 
            x: [0, 100, -100, 0],
            y: [0, -100, 100, 0],
            scale: [1, 1.2, 0.8, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-primary/30 rounded-full mix-blend-screen"
        ></motion.div>
        
        <motion.div 
          animate={{ 
            x: [0, -100, 100, 0],
            y: [0, 100, -100, 0],
            scale: [1, 0.8, 1.2, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] bg-accent/20 rounded-full mix-blend-screen"
        ></motion.div>
      </div>
    </>
  );
}
