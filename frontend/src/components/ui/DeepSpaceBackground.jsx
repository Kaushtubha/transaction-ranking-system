import React, { useMemo, useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

export function DeepSpaceBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate random stars for the background
  const stars = useMemo(() => {
    let shadow = '';
    for (let i = 0; i < 150; i++) {
      const x = Math.floor(Math.random() * 100);
      const y = Math.floor(Math.random() * 100);
      const size = Math.random() < 0.1 ? 2 : 1; 
      const opacity = (Math.random() * 0.8 + 0.2).toFixed(2);
      shadow += `${x}vw ${y}vh ${Math.random() * 2}px ${size}px rgba(168,216,240,${opacity})${i < 149 ? ',' : ''}`;
    }
    return shadow;
  }, []);

  return (
    <div className="fixed inset-0 z-[-10] bg-[#02040a] overflow-hidden">
      
      {/* Dynamic Nebula Clouds */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 10, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-accent/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
          rotate: [0, -10, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-primary/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"
      />

      {/* Deep Space Stars with Parallax */}
      <motion.div 
        animate={{ x: mousePosition.x * -1, y: mousePosition.y * -1 }}
        transition={{ type: "spring", stiffness: 50, damping: 30 }}
        className="absolute w-[2px] h-[2px] rounded-full bg-transparent"
        style={{ boxShadow: stars }}
      />
      <motion.div 
        animate={{ 
          opacity: [0.4, 1, 0.4],
          x: mousePosition.x * -2,
          y: mousePosition.y * -2
        }}
        transition={{ opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }, x: { type: "spring", stiffness: 40 }, y: { type: "spring", stiffness: 40 } }}
        className="absolute w-[3px] h-[3px] rounded-full bg-transparent"
        style={{ boxShadow: stars }} 
      />

      {/* Shooting Stars */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={`shooting-star-${i}`}
          initial={{ x: '120vw', y: '-20vh', opacity: 0 }}
          animate={{ x: '-20vw', y: '100vh', opacity: [0, 1, 1, 0] }}
          transition={{ 
            duration: 2 + Math.random() * 2, 
            repeat: Infinity, 
            delay: Math.random() * 15,
            ease: "linear" 
          }}
          className="absolute w-[150px] h-[2px] bg-gradient-to-r from-transparent via-primary to-white rotate-[45deg] blur-[1px]"
        />
      ))}

      {/* The Ambient Anchor: Uranus Sphere */}
      <motion.div 
        animate={{ x: mousePosition.x * 2, y: mousePosition.y * 2 }}
        transition={{ type: "spring", stiffness: 40, damping: 30 }}
        className="absolute top-[15%] right-[5%] w-[300px] h-[300px] md:w-[600px] md:h-[600px]"
      >
        {/* Core glowing sphere */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#e0f2fe,#A8D8F0_40%,#3b2c6b_70%,#02040a_100%)] rounded-full blur-[2px] shadow-[0_0_120px_rgba(168,216,240,0.5),inset_-40px_-40px_80px_rgba(0,0,0,0.9)] animate-planet-pulse"></div>
        
        {/* Soft bloom aura behind the sphere */}
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] scale-125"></div>

        {/* CSS 3D Orbital Rings */}
        <div className="absolute inset-0 flex items-center justify-center [perspective:1200px]">
          {/* Ring 1 */}
          <div className="absolute w-[150%] h-[150%] rounded-full border-[1px] border-white/20 border-t-primary border-b-accent animate-orbit shadow-[0_0_30px_rgba(168,216,240,0.2)]" style={{ transformStyle: 'preserve-3d' }}>
            {/* Orbiting Satellite Node */}
            <div className="absolute top-0 left-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_15px_#fff] -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          
          {/* Ring 2 */}
          <div className="absolute w-[180%] h-[180%] rounded-full border-[1px] border-white/10 border-l-primary/50 border-r-accent/50 animate-orbit" style={{ transformStyle: 'preserve-3d', animationDuration: '25s', animationDirection: 'reverse' }}>
            <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-primary rounded-full shadow-[0_0_15px_#A8D8F0] -translate-x-1/2 translate-y-1/2"></div>
          </div>
          
          {/* Ring 3 (Outer dust ring) */}
          <div className="absolute w-[220%] h-[220%] rounded-full border-[2px] border-dashed border-white/10 animate-orbit" style={{ transformStyle: 'preserve-3d', animationDuration: '40s' }}></div>
        </div>
      </motion.div>

    </div>
  );
}
