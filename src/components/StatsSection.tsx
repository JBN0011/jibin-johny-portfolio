import React, { useEffect, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const StatsSection: React.FC = () => {
  const { stats } = usePortfolio();
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Counter animation tied to ScrollTrigger
      stats.forEach((stat, index) => {
        const numEl = numberRefs.current[index];
        const cardEl = cardsRef.current[index];

        if (numEl && cardEl) {
          const counterObj = { val: 0 };

          // Reveal animation
          gsap.fromTo(
            cardEl,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: 'power3.out',
              delay: index * 0.15,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
            }
          );

          // Number count-up animation
          gsap.to(counterObj, {
            val: stat.number,
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
            onUpdate: () => {
              if (numEl) {
                numEl.innerText = Math.floor(counterObj.val).toString();
              }
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [stats]);

  return (
    <section
      ref={sectionRef}
      id="stats"
      className="bg-[hsl(var(--bg))] py-16 md:py-24 border-t border-[hsl(var(--stroke))] relative overflow-hidden"
    >
      {/* Background subtle radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-[hsl(var(--stroke))]" />
            <span className="text-xs text-[hsl(var(--muted))] uppercase tracking-[0.3em] font-mono">
              Metrics & Impact
            </span>
            <div className="w-8 h-px bg-[hsl(var(--stroke))]" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-[hsl(var(--text))] tracking-tight">
            Proof of <span className="font-display italic font-normal">execution</span>
          </h2>
        </div>

        {/* 3-Column Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {stats.map((stat, idx) => (
            <div
              key={stat.id || idx}
              ref={(el) => { cardsRef.current[idx] = el; }}
              className="relative group p-8 sm:p-10 rounded-3xl bg-[hsl(var(--surface))] border border-[hsl(var(--stroke))] hover:border-white/40 transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-xl"
            >
              {/* Subtle gradient border hover */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div>
                {/* Number with suffix */}
                <div className="flex items-baseline gap-1 mb-4">
                  <span
                    ref={(el) => { numberRefs.current[idx] = el; }}
                    className="text-6xl sm:text-7xl lg:text-8xl font-display italic text-white tracking-tighter tabular-nums"
                  >
                    0
                  </span>
                  <span className="text-4xl sm:text-5xl font-display text-white/80 font-normal">
                    {stat.suffix}
                  </span>
                </div>

                {/* Label */}
                <h3 className="text-lg sm:text-xl font-medium text-white/95 mb-2 leading-snug">
                  {stat.label}
                </h3>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[hsl(var(--muted))] font-mono leading-relaxed mt-4 pt-4 border-t border-[hsl(var(--stroke))]">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
