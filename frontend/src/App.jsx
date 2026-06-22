import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LayoutDashboard, Trophy, Activity, Wallet } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from './lib/utils';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import BackgroundEffect from './components/ui/BackgroundEffect';

function Sidebar() {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
  ];

  return (
    <div className="w-64 border-r border-border bg-black/20 backdrop-blur-3xl hidden md:flex flex-col h-screen fixed top-0 left-0 z-40 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
      <div className="p-6 flex items-center gap-3 relative z-10">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
          FinRank
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4 relative z-10">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group",
                isActive ? "text-white" : "text-muted hover:text-white"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-pill" 
                  className="absolute inset-0 bg-primary/20 border border-primary/30 rounded-xl -z-10 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-primary" : "text-muted")} />
              <span className="font-medium tracking-wide">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-border relative z-10">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border border-white/20 shadow-inner">
            <Wallet className="w-5 h-5 text-white/80" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">user_123</p>
            <p className="text-[10px] text-emerald-400 font-medium tracking-widest uppercase">Premium</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <BackgroundEffect />
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 md:ml-64 w-full relative">
          <AnimatedRoutes />
        </main>
      </div>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'rgba(15, 15, 15, 0.8)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          },
        }}
      />
    </Router>
  );
}

export default App;
