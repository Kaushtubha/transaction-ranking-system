import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Cinematic3DBackground from './components/ui/Cinematic3DBackground';
import ParticlesBackground from './components/ui/ParticlesBackground';
import { FloatingDock } from './components/ui/FloatingDock';

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
      <Cinematic3DBackground />
      <ParticlesBackground />
      <div className="flex flex-col min-h-screen relative pb-32">
        <main className="flex-1 w-full relative max-w-7xl mx-auto px-4">
          <AnimatedRoutes />
        </main>
        <FloatingDock />
      </div>
      <Toaster 
        position="top-center"
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
