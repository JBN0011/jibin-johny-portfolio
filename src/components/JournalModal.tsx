import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { JournalEntry } from '../types';
import { X, Clock, Calendar, Tag } from 'lucide-react';

interface JournalModalProps {
  journal: JournalEntry | null;
  onClose: () => void;
}

export const JournalModal: React.FC<JournalModalProps> = ({ journal, onClose }) => {
  if (!journal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl max-h-[88vh] bg-[hsl(var(--surface))] border border-[hsl(var(--stroke))] rounded-3xl overflow-y-auto shadow-2xl z-10 my-auto text-[hsl(var(--text))] custom-scrollbar"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-black transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Media Header */}
          <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-black">
            <img
              src={journal.image}
              alt={journal.title}
              className="w-full h-full object-cover grayscale contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--surface))] via-transparent to-black/40" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-3 text-xs font-mono text-[hsl(var(--muted))] mb-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {journal.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {journal.readTime}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display italic text-white leading-tight">
                {journal.title}
              </h2>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-6">
            <p className="text-base sm:text-lg text-white/80 italic font-display border-l-2 border-white/40 pl-4 py-1">
              {journal.summary}
            </p>

            <div className="prose prose-invert max-w-none text-white/90 font-body leading-relaxed space-y-4 text-sm sm:text-base">
              {journal.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('###')) {
                  return (
                    <h3 key={index} className="text-lg font-bold text-white mt-4 mb-2">
                      {paragraph.replace('###', '').trim()}
                    </h3>
                  );
                }
                return (
                  <p key={index} className="text-white/80 leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Tags */}
            {journal.tags && journal.tags.length > 0 && (
              <div className="pt-6 border-t border-[hsl(var(--stroke))] flex items-center gap-2 flex-wrap">
                <Tag className="w-3.5 h-3.5 text-[hsl(var(--muted))]" />
                {journal.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
