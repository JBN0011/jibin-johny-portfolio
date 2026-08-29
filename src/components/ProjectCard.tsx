import React from 'react';
import { Project } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  className?: string;
  aspectRatioClass?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSelect,
  className = '',
  aspectRatioClass = 'aspect-[16/11] sm:aspect-[16/10]',
}) => {
  return (
    <div
      onClick={() => onSelect(project)}
      className={`group relative bg-[hsl(var(--surface))] border border-[hsl(var(--stroke))] rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:border-white/40 shadow-lg ${className}`}
    >
      {/* Background Image Container */}
      <div className={`w-full ${aspectRatioClass} overflow-hidden relative`}>
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover grayscale contrast-110 brightness-90 group-hover:scale-105 group-hover:brightness-100 transition-all duration-700 ease-out"
        />

        {/* Halftone Pattern Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply"
          style={{
            backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
            backgroundSize: '4px 4px',
          }}
        />

        {/* Gradient shadow for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300" />

        {/* Subtle static card footer */}
        <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end transition-opacity duration-300 group-hover:opacity-0">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[hsl(var(--muted))]">
              {project.category}
            </span>
            <h3 className="text-xl sm:text-2xl font-display italic text-white tracking-tight">
              {project.title}
            </h3>
          </div>
          <span className="text-xs font-mono text-[hsl(var(--muted))]">
            {project.year}
          </span>
        </div>

        {/* Hover Backdrop Blur & Overlay */}
        <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 backdrop-blur-md transition-all duration-300 flex flex-col justify-between p-6 sm:p-8">
          {/* Top category & tags */}
          <div className="flex justify-between items-start">
            <span className="text-xs uppercase tracking-[0.2em] font-mono text-white/70 bg-white/10 px-3 py-1 rounded-full border border-white/10">
              {project.category}
            </span>
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          {/* Center Hover Label Pill */}
          <div className="flex flex-col items-center justify-center my-auto transform scale-95 group-hover:scale-100 transition-transform duration-300">
            <div className="relative p-[1.5px] rounded-full accent-gradient shadow-xl">
              <div className="px-5 sm:px-6 py-2.5 rounded-full bg-white text-black font-medium text-xs sm:text-sm flex items-center gap-2">
                <span>View —</span>
                <span className="font-display italic text-base sm:text-lg font-bold">
                  {project.title}
                </span>
              </div>
            </div>
            <p className="text-xs text-white/70 font-mono mt-3 max-w-xs text-center line-clamp-2">
              {project.description}
            </p>
          </div>

          {/* Bottom tag list */}
          <div className="flex flex-wrap gap-1.5 justify-center">
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] font-mono text-white/60 bg-black/50 px-2 py-0.5 rounded border border-white/10">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
