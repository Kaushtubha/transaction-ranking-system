import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import { R3FBackground } from './components/ui/R3FBackground';
import { SmoothScroll } from './components/ui/SmoothScroll';
import { FloatingDock } from './components/ui/FloatingDock';

import TransactionPage from './pages/TransactionPage';
import SummaryPage from './pages/SummaryPage';
import RankingPage from './pages/Leaderboard';
import Dashboard from './pages/Dashboard';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/summary" element={<SummaryPage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/transaction" element={<TransactionPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <SmoothScroll />
      <R3FBackground />
      <FloatingDock />
      <main className="relative z-10 min-h-screen pt-24">
        <AnimatedRoutes />
      </main>
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: 'rgba(7, 13, 26, 0.8)',
            backdropFilter: 'blur(16px)',
            color: '#fff',
            border: '1px solid rgba(168, 216, 240, 0.2)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#A8D8F0',
              secondary: '#070D1A',
            },
          },
          error: {
            iconTheme: {
              primary: '#f43f5e',
              secondary: '#fff',
            },
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
