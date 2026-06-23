import React, { useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";

export function TiltCard({ children, className }) {
  const ref = useRef(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const [isHovered, setIsHovered] = useState(false);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useMotionTemplate`${mouseYSpring}deg`;
  const rotateY = useMotionTemplate`${mouseXSpring}deg`;
  
  const background = useMotionTemplate`radial-gradient(
    600px circle at ${mouseX}px ${mouseY}px,
    rgba(255, 255, 255, 0.08),
    transparent 40%
  )`;

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    
    mouseX.set(clientX);
    mouseY.set(clientY);
    
    const xPct = clientX / width - 0.5;
    const yPct = clientY / height - 0.5;
    
    // Max rotation is 15deg for a deeper feel
    x.set(xPct * 15);
    y.set(yPct * -15);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative group ${className || ''}`}
    >
      <div className="absolute inset-0 z-0 transition-opacity duration-300 pointer-events-none rounded-2xl" 
           style={{ opacity: isHovered ? 1 : 0 }}>
        <motion.div className="absolute inset-0 rounded-2xl" style={{ background }} />
      </div>
      
      {/* Glossy inner reflection border */}
      <div className="absolute inset-0 rounded-2xl border-[1px] border-white/5 group-hover:border-white/20 transition-colors duration-500 z-10 pointer-events-none mix-blend-overlay"></div>

      <div className="relative z-20" style={{ transform: "translateZ(30px)" }}>
        {children}
      </div>
    </motion.div>
  );
}
