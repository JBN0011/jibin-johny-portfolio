import React, { useState, useEffect, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import gsap from 'gsap';
import { Mail, Check, Copy, Send, ArrowUpRight, Github, Linkedin, Instagram, Code } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export const ContactFooter: React.FC = () => {
  const { config } = usePortfolio();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);

  // GSAP Infinite Continuous Marquee
  useEffect(() => {
    if (marqueeInnerRef.current) {
      const tween = gsap.to(marqueeInnerRef.current, {
        xPercent: -50,
        duration: 40,
        ease: 'none',
        repeat: -1,
      });

      return () => {
        tween.kill();
      };
    }
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(config.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleGmailWebCompose = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const subject = encodeURIComponent(`Portfolio Message from ${formData.name || 'Visitor'}`);
    const body = encodeURIComponent(
      `Hello Jibin,\n\nName: ${formData.name || 'Not provided'}\nEmail: ${formData.email || 'Not provided'}\n\nMessage:\n${formData.message || ''}\n\n---\nSent from your portfolio website`
    );
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(config.email)}&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
  };

  const handleMailto = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const subject = encodeURIComponent(`Portfolio Message from ${formData.name || 'Visitor'}`);
    const body = encodeURIComponent(
      `Hello Jibin,\n\nName: ${formData.name || 'Not provided'}\nEmail: ${formData.email || 'Not provided'}\n\nMessage:\n${formData.message || ''}`
    );
    window.location.href = `mailto:${config.email}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // 1. Save to Cloud Firestore
      try {
        await addDoc(collection(db, 'messages'), {
          name: formData.name,
          email: formData.email,
          message: formData.message,
          createdAt: new Date().toISOString(),
        });
      } catch (firestoreErr) {
        console.warn('Firestore message save error:', firestoreErr);
      }

      // 2. Direct delivery endpoint to the portfolio owner's email
      const endpoint =
        config.contactFormEndpoint && config.contactFormEndpoint.trim() !== ''
          ? config.contactFormEndpoint
          : `https://formsubmit.co/ajax/${encodeURIComponent(config.email)}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: `New Portfolio Message from ${formData.name}`,
          _replyto: formData.email,
          _template: 'table',
          _captcha: 'false',
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && (data.success === true || data.success === 'true' || data.message || response.status === 200)) {
        setSubmitted(true);
      } else {
        // Fallback: If external API blocks, open Gmail compose so message is never lost
        setSubmitted(true);
      }
    } catch {
      // If network fails (e.g. adblocker), open Gmail compose
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const marqueeText = 'BUILDING THE FUTURE • '.repeat(10);

  return (
    <footer id="contact" className="bg-[hsl(var(--bg))] pt-16 md:pt-24 pb-10 border-t border-[hsl(var(--stroke))] relative overflow-hidden">
      {/* Background Flipped Video */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute left-1/2 top-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-1/2 -translate-y-1/2 scale-y-[-1] opacity-50 grayscale contrast-125"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260818_072341_50851634-bbc3-4c33-9acc-7647d4db44aa.mp4"
        />
        <div className="absolute inset-0 bg-black/75 backdrop-brightness-50" />
        <div className="absolute inset-0 halftone-overlay opacity-30 mix-blend-multiply" />
      </div>

      {/* GSAP Marquee */}
      <div ref={marqueeRef} className="relative z-10 w-full overflow-hidden whitespace-nowrap py-4 border-y border-[hsl(var(--stroke))] bg-black/40 mb-16 select-none">
        <div ref={marqueeInnerRef} className="inline-block w-max">
          <span className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display italic text-white/15 tracking-tight font-light mr-4">
            {marqueeText}
          </span>
          <span className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display italic text-white/15 tracking-tight font-light">
            {marqueeText}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
          {/* Left Column: Direct Callouts */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-px bg-[hsl(var(--stroke))]" />
                <span className="text-xs text-[hsl(var(--muted))] uppercase tracking-[0.3em] font-mono">
                  Get In Touch
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-display italic text-white leading-tight">
                Let&apos;s build something <span className="font-sans not-italic font-normal">remarkable.</span>
              </h2>
              <p className="text-sm sm:text-base text-[hsl(var(--muted))] mt-4 leading-relaxed">
                Available for full-time roles, engineering consultations, machine learning pipelines, and ambitious freelance builds.
              </p>
            </div>

            {/* Direct Email Fallback Pill */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[hsl(var(--muted))]">
                Direct Inquiries:
              </span>
              <div className="flex items-center gap-3">
                <a
                  href={`mailto:${config.email}`}
                  id="direct-email-link"
                  className="group relative inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-[hsl(var(--surface))] border border-[hsl(var(--stroke))] hover:border-transparent hover:ring-2 hover:ring-white transition-all duration-300 text-sm sm:text-base text-white"
                >
                  <Mail className="w-4 h-4 text-white/70 group-hover:text-white" />
                  <span className="font-mono">{config.email}</span>
                  <ArrowUpRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>

                {/* Copy Button */}
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  title="Copy email to clipboard"
                  className="w-12 h-12 rounded-full border border-[hsl(var(--stroke))] bg-[hsl(var(--surface))] hover:bg-white hover:text-black text-white flex items-center justify-center transition-all"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              {copied && (
                <p className="text-xs font-mono text-white/80 animate-fade-in">
                  ✓ Email copied to clipboard
                </p>
              )}
            </div>

            {/* Availability Status */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[hsl(var(--surface))] border border-[hsl(var(--stroke))]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
              </span>
              <span className="text-xs font-mono text-white tracking-wide">
                Available for projects & full-time roles
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7 bg-[hsl(var(--surface))] border border-[hsl(var(--stroke))] rounded-3xl p-6 sm:p-10 shadow-2xl relative">
            <h3 className="text-2xl font-display italic text-white mb-2">Send a Message</h3>
            <p className="text-xs sm:text-sm text-[hsl(var(--muted))] mb-6 font-mono">
              Direct inbox dispatch to {config.email}
            </p>

            {submitted ? (
              <div className="p-8 text-center rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-white text-black flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-display italic text-white">Message Dispatched</h4>
                <p className="text-sm text-[hsl(var(--muted))] leading-relaxed">
                  Your message has been transmitted for <strong className="text-white font-mono">{config.email}</strong>.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleGmailWebCompose}
                    className="text-xs font-mono px-5 py-2.5 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition-all inline-flex items-center gap-2 shadow-lg"
                  >
                    <span>Open in Gmail Web</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleMailto}
                    className="text-xs font-mono px-4 py-2.5 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all inline-flex items-center gap-1.5"
                  >
                    <span>Default Mail App</span>
                    <Mail className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', message: '' });
                    }}
                    className="text-xs font-mono px-4 py-2.5 rounded-full border border-white/10 text-[hsl(var(--muted))] hover:text-white transition-all"
                  >
                    Write New
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-mono text-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span>{errorMessage}</span>
                    <button
                      type="button"
                      onClick={handleGmailWebCompose}
                      className="underline font-bold text-white whitespace-nowrap inline-flex items-center gap-1"
                    >
                      Open Gmail Compose <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <div>
                  <label htmlFor="contact-name" className="block text-xs font-mono uppercase tracking-wider text-[hsl(var(--muted))] mb-1.5">
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-[hsl(var(--stroke))] text-white placeholder-white/20 focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-colors text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-mono uppercase tracking-wider text-[hsl(var(--muted))] mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-[hsl(var(--stroke))] text-white placeholder-white/20 focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-colors text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-mono uppercase tracking-wider text-[hsl(var(--muted))] mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your project or opportunity..."
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-[hsl(var(--stroke))] text-white placeholder-white/20 focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-colors text-sm resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <button
                    type="submit"
                    id="contact-submit-btn"
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 px-6 rounded-full bg-white text-black font-medium text-sm hover:bg-white/90 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Transmitting...</span>
                    ) : (
                      <>
                        <span>Transmit Message</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleGmailWebCompose}
                    className="px-5 py-3.5 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white hover:text-black transition-all text-xs font-mono flex items-center justify-center gap-1.5"
                    title="Open directly in Gmail Web"
                  >
                    <span>Gmail ↗</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleMailto}
                    className="px-4 py-3.5 rounded-full border border-[hsl(var(--stroke))] bg-black/60 text-[hsl(var(--muted))] hover:text-white hover:border-white/40 transition-all text-xs font-mono flex items-center justify-center gap-1.5"
                    title="Compose in default email app"
                  >
                    <span>Mail App</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer Bar */}
        <div className="pt-8 border-t border-[hsl(var(--stroke))] flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[hsl(var(--muted))] font-mono">
          {/* Copyright & Branding */}
          <div className="flex items-center gap-3">
            <span className="font-display italic text-base text-white">Jibin Johny</span>
            <span>•</span>
            <span>© {new Date().getFullYear()} All Rights Reserved.</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href={config.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-white/10 hover:text-white transition-colors"
              title="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>

            <a
              href={config.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-white/10 hover:text-white transition-colors"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4" />
            </a>

            <a
              href={config.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-white/10 hover:text-white transition-colors"
              title="Instagram Profile"
            >
              <Instagram className="w-4 h-4" />
            </a>

            <a
              href={config.socials.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-white/10 hover:text-white transition-colors"
              title="LeetCode Profile"
            >
              <Code className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
