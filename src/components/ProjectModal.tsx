import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../types';
import { X, ExternalLink, Github, Layers, Calendar, ArrowRight } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl bg-[hsl(var(--surface))] border border-[hsl(var(--stroke))] rounded-3xl overflow-hidden shadow-2xl z-10 my-auto text-[hsl(var(--text))]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-black transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Media Header */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-black">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover grayscale contrast-115"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--surface))] via-transparent to-black/30" />
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] font-mono text-[hsl(var(--muted))] bg-black/60 px-3 py-1 rounded-full border border-white/10">
                  {project.category}
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-display italic text-white mt-2">
                  {project.title}
                </h2>
              </div>
              <span className="text-sm font-mono text-[hsl(var(--muted))] hidden sm:block">
                {project.year}
              </span>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] font-mono text-[hsl(var(--muted))] mb-2">
                Project Overview
              </h3>
              <p className="text-base text-white/90 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Tech Stack */}
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] font-mono text-[hsl(var(--muted))] mb-3 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" />
                Technologies & Architecture
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="pt-4 border-t border-[hsl(var(--stroke))] flex items-center gap-4 flex-wrap">
              {project.projectUrl && (
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-white text-black font-medium text-sm hover:bg-white/90 transition-all hover:scale-105"
                >
                  <span>Launch Live Study</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 border border-white/20 bg-white/5 text-white font-medium text-sm hover:bg-white/10 transition-all"
                >
                  <Github className="w-4 h-4" />
                  <span>Source Repository</span>
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
