import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export function DeepSpaceBackground() {
  // Generate random stars for the background
  const stars = useMemo(() => {
    let shadow = '';
    for (let i = 0; i < 100; i++) {
      const x = Math.floor(Math.random() * 100);
      const y = Math.floor(Math.random() * 100);
      const size = Math.random() < 0.2 ? 2 : 1; // 20% slightly larger stars
      const opacity = (Math.random() * 0.6 + 0.2).toFixed(2);
      shadow += `${x}vw ${y}vh 1px ${size}px rgba(255,255,255,${opacity})${i < 99 ? ',' : ''}`;
    }
    return shadow;
  }, []);

  return (
    <div className="fixed inset-0 z-[-10] bg-[#04070F] overflow-hidden">
      {/* Deep Space Stars */}
      <div 
        className="absolute w-[2px] h-[2px] rounded-full bg-transparent"
        style={{ boxShadow: stars }}
      />
      <motion.div 
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[3px] h-[3px] rounded-full bg-transparent"
        style={{ boxShadow: stars }} // duplicate to create twinkling
      />

      {/* The Ambient Anchor: Uranus Sphere */}
      <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] md:w-[600px] md:h-[600px]">
        {/* Core glowing sphere */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#A8D8F0,#3b2c6b_60%,#04070F_100%)] rounded-full blur-[2px] shadow-[0_0_80px_rgba(168,216,240,0.4),inset_-40px_-40px_60px_rgba(0,0,0,0.8)] animate-planet-pulse"></div>
        
        {/* Soft bloom aura behind the sphere */}
        <div className="absolute inset-0 bg-[#A8D8F0]/20 rounded-full blur-[80px] scale-125"></div>

        {/* CSS 3D Orbital Rings */}
        <div className="absolute inset-0 flex items-center justify-center [perspective:1000px]">
          {/* Ring 1 */}
          <div className="absolute w-[160%] h-[160%] rounded-full border-[1px] border-white/20 border-t-primary/50 border-b-accent/50 animate-orbit" style={{ transformStyle: 'preserve-3d' }}></div>
          
          {/* Ring 2 (Tilted differently) */}
          <div className="absolute w-[190%] h-[190%] rounded-full border-[1px] border-white/10 border-l-primary/30 border-r-accent/30 animate-orbit" style={{ transformStyle: 'preserve-3d', animationDuration: '30s', animationDirection: 'reverse' }}></div>
          
          {/* Ring 3 (Faint outer dust) */}
          <div className="absolute w-[220%] h-[220%] rounded-full border-[2px] border-dashed border-white/5 animate-orbit" style={{ transformStyle: 'preserve-3d', animationDuration: '40s' }}></div>
        </div>
      </div>
    </div>
  );
}
