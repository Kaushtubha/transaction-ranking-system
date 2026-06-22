import React from 'react';
import { motion } from 'framer-motion';

export default function Cinematic3DBackground() {
  return (
    <>
      <div className="noise-overlay"></div>
      
      {/* 3D Perspective Grid */}
      <div className="fixed inset-0 z-[-4] pointer-events-none perspective-container overflow-hidden bg-black">
        {/* Deep background glow to contrast the grid */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary/10 to-transparent"></div>
        <div className="grid-floor"></div>
      </div>

      {/* Massive Aurora Clouds in the distance */}
      <div className="fixed inset-0 z-[-5] pointer-events-none overflow-hidden blur-[150px] opacity-70">
        <motion.div 
          animate={{ 
            x: [0, 200, -200, 0],
            y: [0, -100, 100, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.5, 1]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-primary/40 rounded-full mix-blend-screen"
        ></motion.div>
        
        <motion.div 
          animate={{ 
            x: [0, -200, 200, 0],
            y: [0, 200, -200, 0],
            rotate: [360, 180, 0],
            scale: [1, 0.8, 1.2, 1]
          }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-[60vw] h-[60vw] bg-accent/30 rounded-full mix-blend-screen"
        ></motion.div>
        
        {/* Hot pink neon accent core */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] bg-pink-500/20 rounded-full mix-blend-screen"
        ></motion.div>
      </div>
    </>
  );
}
