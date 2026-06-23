import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Transact' },
  { path: '/summary', label: 'Summary' },
  { path: '/ranking', label: 'Rankings' },
];

export function TopNav() {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent py-6 px-8 flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_15px_rgba(168,216,240,0.8)] group-hover:scale-110 transition-transform"></div>
        <span className="font-display font-bold text-2xl tracking-tighter text-white">TxRank</span>
      </Link>

      {/* Nav Links */}
      <div className="flex items-center gap-8">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path === '/summary' && location.pathname.startsWith('/summary'));
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative text-sm font-medium tracking-widest uppercase transition-colors duration-300 py-2 px-1"
              style={{ color: isActive ? '#fff' : '#8899BB' }}
            >
              <span className="relative z-10">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute bottom-0 left-0 w-full h-[2px] bg-primary shadow-[0_0_10px_rgba(168,216,240,0.8)] rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
