import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { PortfolioProvider } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { MouseGlow } from './components/MouseGlow';
import { HomePage } from './pages/HomePage';
import { WorkPage } from './pages/WorkPage';
import { WritingsPage } from './pages/WritingsPage';
import { AdminPage } from './pages/AdminPage';

// Scroll to top helper on route transition
const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);

  return null;
};

// Animated route container
const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full min-h-screen"
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/writings" element={<WritingsPage />} />
          <Route path="/jbn@admin" element={<AdminPage />} />
          <Route path="/jbn%40admin" element={<AdminPage />} />
          {/* Catch-all */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <PortfolioProvider>
      <BrowserRouter>
        <ScrollToTop />
        <MouseGlow />
        <Navbar />
        <main className="min-h-screen bg-[hsl(var(--bg))] text-[hsl(var(--text))]">
          <AnimatedRoutes />
        </main>
      </BrowserRouter>
    </PortfolioProvider>
  );
}
