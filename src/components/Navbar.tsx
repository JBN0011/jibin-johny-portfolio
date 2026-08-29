import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { FileDown, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { downloadResume } = usePortfolio();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSayHi = () => {
    if (location.pathname !== '/') {
      navigate('/#contact');
    } else {
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-2.5 sm:pt-4 md:pt-6 px-2 sm:px-4 pointer-events-none">
      <nav
        id="main-navbar"
        className={`pointer-events-auto inline-flex items-center rounded-full backdrop-blur-md border border-white/10 bg-[hsl(var(--surface))]/90 p-1 sm:p-1.5 md:p-2 transition-all duration-300 max-w-[calc(100vw-1rem)] sm:max-w-none shadow-lg ${
          scrolled ? 'shadow-2xl shadow-black/90 border-white/20 bg-black/95' : ''
        }`}
      >
        {/* Logo */}
        <NavLink
          to="/"
          aria-label="Home"
          className="group relative flex-shrink-0 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full p-[1px] accent-gradient transition-transform duration-300 hover:scale-105"
        >
          <div className="w-full h-full rounded-full bg-[hsl(var(--bg))] flex items-center justify-center transition-colors group-hover:bg-[hsl(var(--surface))]">
            <span className="font-display italic text-[11px] sm:text-xs md:text-[13px] tracking-tight text-[hsl(var(--text))] font-bold">
              JBN
            </span>
          </div>
        </NavLink>

        {/* Divider */}
        <div className="w-px h-3.5 sm:h-4 md:h-5 bg-[hsl(var(--stroke))] mx-0.5 sm:mx-1 hidden xs:block" />

        {/* Nav links */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-[11px] sm:text-xs md:text-sm rounded-full px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-white text-black font-medium shadow-sm'
                  : 'text-[hsl(var(--muted))] hover:text-white hover:bg-white/5'
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/work"
            className={({ isActive }) =>
              `text-[11px] sm:text-xs md:text-sm rounded-full px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-white text-black font-medium shadow-sm'
                  : 'text-[hsl(var(--muted))] hover:text-white hover:bg-white/5'
              }`
            }
          >
            Work
          </NavLink>

          <NavLink
            to="/writings"
            className={({ isActive }) =>
              `text-[11px] sm:text-xs md:text-sm rounded-full px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-white text-black font-medium shadow-sm'
                  : 'text-[hsl(var(--muted))] hover:text-white hover:bg-white/5'
              }`
            }
          >
            Writings
          </NavLink>

          <button
            id="navbar-resume-btn"
            type="button"
            onClick={downloadResume}
            title="Download / View Resume"
            className="text-[11px] sm:text-xs md:text-sm rounded-full px-1.5 sm:px-2.5 md:px-3.5 py-1 sm:py-1.5 md:py-2 text-[hsl(var(--muted))] hover:text-white hover:bg-white/5 transition-all duration-200 flex items-center gap-1 whitespace-nowrap"
          >
            <span>Resume</span>
            <FileDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-70 flex-shrink-0" />
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-3.5 sm:h-4 md:h-5 bg-[hsl(var(--stroke))] mx-0.5 sm:mx-1 flex-shrink-0" />

        {/* Say Hi Button with accent hover */}
        <button
          id="navbar-say-hi-btn"
          type="button"
          onClick={handleSayHi}
          className="relative group inline-flex items-center justify-center text-[11px] sm:text-xs md:text-sm rounded-full px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-white bg-white/10 hover:bg-white hover:text-black transition-all duration-300 font-medium overflow-hidden whitespace-nowrap flex-shrink-0"
        >
          <span className="relative z-10 flex items-center gap-1">
            Say hi
          </span>
        </button>
      </nav>
    </header>
  );
};
