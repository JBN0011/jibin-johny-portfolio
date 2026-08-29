import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import { Project } from '../types';
import { ArrowUpRight } from 'lucide-react';

export const SelectedWorks: React.FC = () => {
  const { projects } = usePortfolio();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Take top 4 projects for the Bento Grid layout with 7/5/5/7 column spans
  const featuredProjects = projects.slice(0, 4);

  // Column spans pattern: 7, 5, 5, 7
  const getColSpan = (index: number) => {
    const spans = ['md:col-span-7', 'md:col-span-5', 'md:col-span-5', 'md:col-span-7'];
    return spans[index % spans.length];
  };

  return (
    <section id="work" className="bg-[hsl(var(--bg))] py-12 md:py-20 border-t border-[hsl(var(--stroke))]">
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
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-px bg-[hsl(var(--stroke))]" />
              <span className="text-xs text-[hsl(var(--muted))] uppercase tracking-[0.3em] font-mono">
                Selected Work
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl text-[hsl(var(--text))] tracking-tight">
              Featured <span className="font-display italic font-normal">projects</span>
            </h2>

            {/* Subtext */}
            <p className="text-sm md:text-base text-[hsl(var(--muted))] mt-3 max-w-lg">
              A selection of projects I&apos;ve worked on, from concept to launch.
            </p>
          </div>

          {/* Desktop "View all work" button */}
          <Link
            to="/work"
            id="selected-works-view-all-btn"
            className="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-mono px-5 py-3 rounded-full border border-[hsl(var(--stroke))] bg-[hsl(var(--surface))] text-white hover:bg-white hover:text-black transition-all duration-300 hover:scale-105"
          >
            <span>View all work</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
          {featuredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              className={getColSpan(idx)}
            >
              <ProjectCard project={project} onSelect={setSelectedProject} />
            </motion.div>
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-8 text-center md:hidden">
          <Link
            to="/work"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-mono px-6 py-3 rounded-full border border-[hsl(var(--stroke))] bg-[hsl(var(--surface))] text-white"
          >
            <span>View all work</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Project Modal */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
};
