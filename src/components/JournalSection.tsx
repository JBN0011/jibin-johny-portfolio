import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { JournalModal } from './JournalModal';
import { JournalEntry } from '../types';
import { ArrowUpRight, Clock, ArrowRight } from 'lucide-react';

export const JournalSection: React.FC = () => {
  const { journals } = usePortfolio();
  const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(null);

  const displayJournals = journals.slice(0, 4);

  return (
    <section id="writings" className="bg-[hsl(var(--bg))] py-16 md:py-24 border-t border-[hsl(var(--stroke))]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-px bg-[hsl(var(--stroke))]" />
              <span className="text-xs text-[hsl(var(--muted))] uppercase tracking-[0.3em] font-mono">
                Journal
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl text-[hsl(var(--text))] tracking-tight">
              Recent <span className="font-display italic font-normal">thoughts</span>
            </h2>

            <p className="text-sm md:text-base text-[hsl(var(--muted))] mt-3 max-w-lg">
              Reflections on design systems, full-stack architecture, and machine learning interfaces.
            </p>
          </div>

          <Link
            to="/writings"
            id="journal-view-all-btn"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-mono px-5 py-3 rounded-full border border-[hsl(var(--stroke))] bg-[hsl(var(--surface))] text-white hover:bg-white hover:text-black transition-all duration-300 hover:scale-105 self-start md:self-auto"
          >
            <span>View all</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {/* Journal Entries List: Horizontal Pills */}
        <div className="flex flex-col gap-4">
          {displayJournals.map((entry, idx) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={() => setSelectedJournal(entry)}
              className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 p-4 sm:p-5 rounded-[28px] sm:rounded-full bg-[hsl(var(--surface))]/40 hover:bg-[hsl(var(--surface))] border border-[hsl(var(--stroke))] hover:border-white/40 transition-all duration-300 cursor-pointer"
            >
              {/* Left content: Thumbnail + Title */}
              <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                {/* Grayscale Thumbnail */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden shrink-0 border border-[hsl(var(--stroke))] bg-black">
                  <img
                    src={entry.image}
                    alt={entry.title}
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Title & Date */}
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg md:text-xl font-display italic text-[hsl(var(--text))] truncate group-hover:text-white transition-colors">
                    {entry.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs font-mono text-[hsl(var(--muted))] mt-1">
                    <span>{entry.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {entry.readTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right content: Read Action */}
              <div className="flex items-center gap-3 self-end sm:self-center shrink-0 pr-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[hsl(var(--muted))] group-hover:text-white transition-colors hidden md:inline-block">
                  Read Article
                </span>
                <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 group-hover:bg-white group-hover:text-black flex items-center justify-center text-white/80 transition-all duration-300">
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Journal Modal */}
      <JournalModal journal={selectedJournal} onClose={() => setSelectedJournal(null)} />
    </section>
  );
};
