import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

const ROTATING_WORDS = ['Design', 'Create', 'Inspire'];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);

  // Counter using requestAnimationFrame over 2700ms
  useEffect(() => {
    const duration = 2700;
    const startTime = performance.now();

    let animationFrameId: number;

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing curve for realistic smooth momentum
      const easeOutProgress = 1 - Math.pow(1 - progress, 2);
      const currentVal = Math.floor(easeOutProgress * 100);
      
      setCount(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCounter);
      } else {
        setCount(100);
        setTimeout(() => {
          onComplete();
        }, 400);
      }
    };

    animationFrameId = requestAnimationFrame(updateCounter);

    return () => cancelAnimationFrame(animationFrameId);
  }, [onComplete]);

  // Rotate center word every 900ms
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 900);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      id="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.65, 0, 0.35, 1] } }}
      className="fixed inset-0 z-[9999] bg-black text-white flex flex-col justify-between p-8 md:p-14 lg:p-20 overflow-hidden select-none pointer-events-auto"
    >
      {/* Top Bar */}
      <div className="flex justify-between items-start w-full">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-xs text-[hsl(var(--muted))] uppercase tracking-[0.3em] font-mono"
        >
          Portfolio
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xs text-[hsl(var(--muted))] tracking-[0.2em] font-mono"
        >
          2026 EDITION
        </motion.div>
      </div>

      {/* Center Rotating Words */}
      <div className="flex items-center justify-center my-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={ROTATING_WORDS[wordIndex]}
            initial={{ y: 20, opacity: 0, filter: 'blur(4px)' }}
            animate={{ y: 0, opacity: 0.85, filter: 'blur(0px)' }}
            exit={{ y: -20, opacity: 0, filter: 'blur(4px)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display italic text-[hsl(var(--text))] text-center tracking-tight"
          >
            {ROTATING_WORDS[wordIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Display */}
      <div className="flex justify-between items-end w-full">
        <div className="text-xs text-[hsl(var(--muted))] max-w-[200px] hidden sm:block font-mono leading-relaxed">
          INITIALIZING SPATIAL ARCHITECTURE & INTERACTIVE SHADERS
        </div>

        {/* Counter Display */}
        <div className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-display text-[hsl(var(--text))] tabular-nums leading-none tracking-tighter">
          {String(count).padStart(3, '0')}
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[hsl(var(--stroke))]/50 overflow-hidden">
        <div
          className="h-full accent-gradient origin-left transition-transform duration-75"
          style={{
            transform: `scaleX(${count / 100})`,
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.45)',
          }}
        />
      </div>
    </motion.div>
  );
};
