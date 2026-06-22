import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LayoutDashboard, ArrowRightLeft, Trophy, Activity, Wallet } from 'lucide-react';
import { cn } from './lib/utils';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';

function Sidebar() {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
  ];

  return (
    <div className="w-64 border-r border-border bg-surface/50 backdrop-blur-xl hidden md:flex flex-col h-screen fixed top-0 left-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
          FinRank
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-muted hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted")} />
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
            <Wallet className="w-5 h-5 text-white/80" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">user_123</p>
            <p className="text-xs text-muted">Free Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 md:ml-64 w-full relative">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </main>
      </div>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#12121a',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
    </Router>
  );
}

export default App;
