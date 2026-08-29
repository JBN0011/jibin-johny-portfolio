import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { JournalModal } from '../components/JournalModal';
import { JournalEntry } from '../types';
import { ArrowLeft, Clock, ArrowRight } from 'lucide-react';
import { ContactFooter } from '../components/ContactFooter';

export const WritingsPage: React.FC = () => {
  const { journals } = usePortfolio();
  const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('All');

  // Extract tags
  const allTags = ['All', ...Array.from(new Set(journals.flatMap((j) => j.tags || [])))];

  const filteredJournals = journals.filter((j) => {
    return selectedTag === 'All' || (j.tags && j.tags.includes(selectedTag));
  });

  return (
    <div className="min-h-screen bg-[hsl(var(--bg))] text-[hsl(var(--text))] pt-28 pb-20">
      <div className="max-w-[1000px] mx-auto px-6 md:px-10">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-mono text-[hsl(var(--muted))] hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
            <span>Return to Overview</span>
          </Link>
        </div>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-[hsl(var(--stroke))]" />
            <span className="text-xs text-[hsl(var(--muted))] uppercase tracking-[0.3em] font-mono">
              Essays & Notes
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-display italic text-white tracking-tight">
            Writings & Philosophy
          </h1>

          <p className="text-sm md:text-base text-[hsl(var(--muted))] mt-3 max-w-xl leading-relaxed">
            Observations on software architecture, design heuristics, deep learning interfaces, and mathematical typography.
          </p>
        </motion.div>

        {/* Tags Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 border-b border-[hsl(var(--stroke))] custom-scrollbar">
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`text-xs px-4 py-2 rounded-full font-mono whitespace-nowrap transition-all ${
                selectedTag === tag
                  ? 'bg-white text-black font-medium shadow-sm'
                  : 'bg-[hsl(var(--surface))] text-[hsl(var(--muted))] border border-[hsl(var(--stroke))] hover:text-white hover:border-white/40'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Journal Entries List: Clean Vertical Stack of Horizontal Pills */}
        {filteredJournals.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[hsl(var(--stroke))] rounded-3xl">
            <p className="text-base text-[hsl(var(--muted))] font-mono">No matching essays found.</p>
            <button
              onClick={() => setSelectedTag('All')}
              className="mt-4 text-xs font-mono underline uppercase text-white hover:text-white/80"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJournals.map((entry, idx) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                onClick={() => setSelectedJournal(entry)}
                className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 p-4 sm:p-5 rounded-[28px] sm:rounded-full bg-[hsl(var(--surface))]/50 hover:bg-[hsl(var(--surface))] border border-[hsl(var(--stroke))] hover:border-white/40 transition-all duration-300 cursor-pointer shadow-md"
              >
                {/* Left thumbnail & content */}
                <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden shrink-0 border border-[hsl(var(--stroke))] bg-black">
                    <img
                      src={entry.image}
                      alt={entry.title}
                      className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

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

                {/* Right Action */}
                <div className="flex items-center gap-3 self-end sm:self-center shrink-0 pr-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-[hsl(var(--muted))] group-hover:text-white transition-colors hidden md:inline-block">
                    Read Essay
                  </span>
                  <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 group-hover:bg-white group-hover:text-black flex items-center justify-center text-white/80 transition-all duration-300">
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Reader Modal */}
      <JournalModal journal={selectedJournal} onClose={() => setSelectedJournal(null)} />

      {/* Footer */}
      <div className="mt-20">
        <ContactFooter />
      </div>
    </div>
  );
};
