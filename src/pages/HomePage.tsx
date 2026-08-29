import React, { useState } from 'react';
import { LoadingScreen } from '../components/LoadingScreen';
import { Hero } from '../components/Hero';
import { SelectedWorks } from '../components/SelectedWorks';
import { JournalSection } from '../components/JournalSection';
import { StatsSection } from '../components/StatsSection';
import { ContactFooter } from '../components/ContactFooter';
import { AnimatePresence } from 'framer-motion';

export const HomePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(() => {
    // Only show loading screen once per session for best user experience
    const shown = sessionStorage.getItem('jbn_loaded_v1');
    return !shown;
  });

  const handleLoadingComplete = () => {
    sessionStorage.setItem('jbn_loaded_v1', 'true');
    setIsLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-[hsl(var(--bg))] text-[hsl(var(--text))]">
      {/* Section 1: Loading Screen */}
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      </AnimatePresence>

      {/* Section 2: Hero */}
      <Hero />

      {/* Section 3: Selected Works */}
      <SelectedWorks />

      {/* Section 4: Journal */}
      <JournalSection />

      {/* Section 5: Stats */}
      <StatsSection />

      {/* Section 6: Contact / Footer */}
      <ContactFooter />
    </div>
  );
};
