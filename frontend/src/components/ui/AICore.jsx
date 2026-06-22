import React from 'react';
import { motion } from 'framer-motion';

export function AICore() {
  return (
    <div className="relative flex items-center justify-center w-64 h-64 mx-auto my-12 perspective-1000">
      {/* Outer Glow */}
      <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full mix-blend-screen"></div>
      
      {/* Rotating Rings */}
      <motion.div 
        animate={{ rotateX: [0, 360], rotateY: [0, 360], rotateZ: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute w-full h-full border border-primary/30 rounded-full"
        style={{ transformStyle: 'preserve-3d' }}
      ></motion.div>
      <motion.div 
        animate={{ rotateX: [360, 0], rotateY: [0, 360], rotateZ: [360, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute w-56 h-56 border border-accent/40 rounded-full"
        style={{ transformStyle: 'preserve-3d' }}
      ></motion.div>
      <motion.div 
        animate={{ rotateX: [0, 360], rotateY: [360, 0], rotateZ: [0, 360] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute w-48 h-48 border border-white/20 rounded-full"
        style={{ transformStyle: 'preserve-3d' }}
      ></motion.div>

      {/* Core Orb */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-white via-primary to-accent shadow-[0_0_60px_rgba(59,130,246,0.8)]"
      >
        <div className="absolute inset-0 rounded-full bg-white blur-[10px] opacity-50 mix-blend-overlay animate-pulse"></div>
      </motion.div>
    </div>
  );
}
