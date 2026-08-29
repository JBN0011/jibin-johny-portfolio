import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectModal } from '../components/ProjectModal';
import { Project } from '../types';
import { ArrowLeft } from 'lucide-react';
import { ContactFooter } from '../components/ContactFooter';

export const WorkPage: React.FC = () => {
  const { projects } = usePortfolio();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = projects.filter((p) => {
    return selectedCategory === 'All' || p.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-[hsl(var(--bg))] text-[hsl(var(--text))] pt-28 pb-20">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Back navigation */}
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
              Archive & Systems
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-display italic text-white tracking-tight">
            All Works & Experiments
          </h1>

          <p className="text-sm md:text-base text-[hsl(var(--muted))] mt-3 max-w-2xl leading-relaxed">
            A comprehensive index of engineering repositories, full-stack systems, machine learning pipelines, and spatial interfaces.
          </p>
        </motion.div>

        {/* Category Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 border-b border-[hsl(var(--stroke))] custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-4 py-2 rounded-full font-mono whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-white text-black font-medium shadow-sm'
                  : 'bg-[hsl(var(--surface))] text-[hsl(var(--muted))] border border-[hsl(var(--stroke))] hover:text-white hover:border-white/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid: Responsive 2 or 3 columns */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[hsl(var(--stroke))] rounded-3xl">
            <p className="text-base text-[hsl(var(--muted))] font-mono">No matching projects found.</p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="mt-4 text-xs font-mono underline uppercase text-white hover:text-white/80"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                <ProjectCard
                  project={project}
                  onSelect={setSelectedProject}
                  aspectRatioClass="aspect-[4/3]"
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Project Modal */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />

      {/* Global Contact Footer */}
      <div className="mt-20">
        <ContactFooter />
      </div>
    </div>
  );
};
