import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowUpRight, MessageSquare } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const Hero: React.FC = () => {
  const { config } = usePortfolio();
  const [roleIndex, setRoleIndex] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const profileContainerRef = useRef<HTMLDivElement>(null);

  // Cycle role every 2 seconds
  useEffect(() => {
    const roles = config.roles.length > 0 ? config.roles : ['Programmer', 'Analyst', 'Translator', 'Innovator'];
    const timer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [config.roles]);

  // GSAP ScrollTrigger to subtly scale down and fade profile photo on scroll
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (profileContainerRef.current && heroRef.current) {
        gsap.to(profileContainerRef.current, {
          scale: 0.85,
          opacity: 0.25,
          y: 60,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom 20%',
            scrub: 1,
          },
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const currentRoles = config.roles.length > 0 ? config.roles : ['Programmer', 'Analyst', 'Translator', 'Innovator'];
  const currentRole = currentRoles[roleIndex] || 'Programmer';

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const profileImageSrc =
    config.profilePhoto ||
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80';

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen w-full flex items-center justify-center px-6 sm:px-10 md:px-14 lg:px-20 pt-28 pb-24 overflow-hidden bg-black"
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute left-1/2 top-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-1/2 -translate-y-1/2 opacity-70 grayscale contrast-125"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260818_072341_50851634-bbc3-4c33-9acc-7647d4db44aa.mp4"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50 backdrop-brightness-75" />
        {/* Subtle halftone texture */}
        <div className="absolute inset-0 halftone-overlay opacity-30 mix-blend-multiply" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[hsl(var(--bg))] via-[hsl(var(--bg))]/80 to-transparent" />
      </div>

      {/* Hero Content: 2-Column Responsive Layout */}
      <div className="relative z-10 max-w-[1320px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Typography, Bio & Actions */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
          {/* Eyebrow */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            className="text-xs md:text-sm text-[hsl(var(--muted))] uppercase tracking-[0.3em] mb-4 font-mono font-medium"
          >
            {config.eyebrow}
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-display italic leading-[0.95] tracking-tight text-[hsl(var(--text))] mb-6 select-none"
          >
            {config.name}
          </motion.h1>

          {/* Role line */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="text-base sm:text-lg md:text-xl text-[hsl(var(--muted))] mb-6 flex items-center justify-center lg:justify-start gap-2 flex-wrap"
          >
            <span>A</span>
            <span
              key={roleIndex}
              className="font-display italic text-2xl sm:text-3xl md:text-4xl text-[hsl(var(--text))] animate-role-fade-in inline-block min-w-[140px] text-center lg:text-left"
            >
              {currentRole}
            </span>
            <span>lives in {config.location}.</span>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="text-sm md:text-base text-[hsl(var(--muted))] max-w-xl mb-10 leading-relaxed"
          >
            {config.bio}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            className="inline-flex items-center gap-4 flex-wrap justify-center lg:justify-start"
          >
            {/* See Works */}
            <Link
              to="/work"
              id="hero-see-works-btn"
              className="group relative inline-flex items-center gap-2 rounded-full text-sm font-medium px-7 py-3.5 bg-white text-black hover:bg-black hover:text-white transition-all duration-300 hover:scale-105 border border-white hover:border-transparent hover:ring-2 hover:ring-white/80 shadow-lg"
            >
              <span>See Works</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            {/* Reach out... */}
            <button
              id="hero-reach-out-btn"
              type="button"
              onClick={scrollToContact}
              className="group relative inline-flex items-center gap-2 rounded-full text-sm font-medium px-7 py-3.5 border-2 border-[hsl(var(--stroke))] bg-[hsl(var(--bg))] text-[hsl(var(--text))] hover:border-transparent hover:scale-105 transition-all duration-300 hover:ring-2 hover:ring-white/80"
            >
              <span>Reach out...</span>
              <MessageSquare className="w-4 h-4 opacity-70 group-hover:opacity-100" />
            </button>
          </motion.div>
        </div>

        {/* Right Column: Increased Size Round Profile Photo with GSAP ScrollTrigger & Fade In/Out Effect */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end items-center order-1 lg:order-2">
          <motion.div
            
            ref={profileContainerRef}
            className="relative group will-change-transform"
          >
            {/* Ambient subtle backdrop ring with synchronized fade in/out pulse */}
            <motion.div
              animate={{
                opacity: [0.75, 0.15, 0.75],
                scale: [1, 1.04, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -inset-4 rounded-full bg-gradient-to-tr from-white/25 via-white/10 to-transparent blur-2xl group-hover:opacity-100 pointer-events-none"
            />

            {/* Profile Avatar Card with Infinite Smooth Fade In & Fade Out Animation */}
            <motion.div
              animate={{
                opacity: [0.5, 0.3, 0.5],
                scale: [1, 0.985, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative p-1 rounded-full bg-gradient-to-b from-white/30 via-white/10 to-transparent shadow-2xl transition-transform duration-500 group-hover:!opacity-100"
            >
              <img
                src={profileImageSrc}
                alt={config.name}
                referrerPolicy="no-referrer"
                className="w-40 h-40 sm:w-56 sm:h-56 md:w-80 md:h-80 lg:w-[450px] lg:h-[450px] rounded-full object-cover border-2 border-[hsl(var(--stroke))] grayscale contrast-110 group-hover:contrast-125 transition-all duration-700 shadow-2xl"
              />
            </motion.div>

            {/* Live Status Badge */}
            <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 bg-black/90 border border-white/20 rounded-full px-3 py-1 sm:px-3.5 sm:py-1.5 flex items-center gap-2 shadow-2xl backdrop-blur-md z-10">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
              <span className="text-[11px] uppercase font-mono tracking-wider text-[hsl(var(--text))] font-medium">
                Available
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[10px] text-[hsl(var(--muted))] uppercase tracking-[0.25em] font-mono">
          SCROLL
        </span>
        <div className="relative w-px h-10 bg-[hsl(var(--stroke))] overflow-hidden">
          <div className="w-full h-1/2 bg-white animate-scroll-down" />
        </div>
      </motion.div>
    </section>
  );
};
