import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Trophy, Wallet, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';

export function FloatingDock() {
  const location = useLocation();
  let mouseX = useMotionValue(Infinity);

  const links = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
  ];

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-end gap-4 rounded-2xl bg-black/40 border border-white/10 px-4 pb-3 pt-4 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
    >
      <div className="flex items-end gap-2 pr-4 border-r border-white/10">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.6)] animate-pulse">
          <Activity className="w-6 h-6 text-white" />
        </div>
      </div>

      {links.map((link) => (
        <DockIcon mouseX={mouseX} key={link.path} {...link} isActive={location.pathname === link.path} />
      ))}

      <div className="flex items-end gap-2 pl-4 border-l border-white/10">
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors cursor-pointer group">
          <Wallet className="w-5 h-5 text-white/80 group-hover:text-white" />
        </div>
      </div>
    </motion.div>
  );
}

function DockIcon({ mouseX, name, icon: Icon, path, isActive }) {
  const ref = useRef(null);

  // Measure distance from mouse to center of icon
  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Calculate width based on distance
  let widthSync = useTransform(distance, [-150, 0, 150], [48, 80, 48]);
  let width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <Link to={path}>
      <motion.div
        ref={ref}
        style={{ width, height: width }}
        className={cn(
          "relative flex items-center justify-center rounded-xl transition-colors duration-200",
          isActive ? "bg-white/10 border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]" : "bg-transparent hover:bg-white/5"
        )}
      >
        <Icon className={cn("transition-colors", isActive ? "text-primary" : "text-muted")} style={{ width: '40%', height: '40%' }} />
        
        {isActive && (
          <motion.div 
            layoutId="dock-indicator"
            className="absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.8)]"
          />
        )}
      </motion.div>
    </Link>
  );
}
