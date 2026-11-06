import React, { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowUp, ArrowUpRight, Check, Copy, Mail } from 'lucide-react';
import { INSTAGRAM_DM_URL, PERSONAL_INFO, SERVICES } from '../data/portfolioData';

const IS_TOUCH = window.matchMedia('(pointer: coarse)').matches;

const CTA_LABELS: Record<string, string> = {
  editing: 'Email about video editing',
  social: 'Email about social media',
};

/** A big button that leans toward the pointer. */
const MagneticButton: React.FC<{ href: string; label: string; primary: boolean }> = ({ href, label, primary }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 16 });
  const springY = useSpring(y, { stiffness: 220, damping: 16 });

  const handleMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.22);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.32);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      href={href}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ x: springX, y: springY }}
      data-cursor="Open your email"
      className={`inline-flex items-center justify-center gap-3 w-full sm:w-auto px-6 sm:px-9 py-4 sm:py-5 font-mono font-bold text-sm sm:text-base transition-colors ${
        primary
          ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] hover:bg-black hover:text-white'
          : 'border-2 border-current hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]'
      }`}
    >
      <Mail className="w-5 h-5" aria-hidden="true" />
      <span>{label}</span>
    </motion.a>
  );
};

/** Finale: an iris wipe floods the screen with the accent colour and lands on the one action. */
export const CtaSection: React.FC = () => {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const instagram = PERSONAL_INFO.socials[1];

  // The wipe finishes before the section reaches the top, so #contact links land on a finished frame
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end end'] });
  const radius = useTransform(scrollYProgress, [0.08, 0.6], [0, 150]);
  const clipPath = useMotionTemplate`circle(${radius}% at 50% 50%)`;
  const headlineScale = useTransform(scrollYProgress, [0.2, 0.7], [1.5, 1]);
  const width = useTransform(scrollYProgress, [0.2, 0.75], [125, 84]);
  const fontVariation = useMotionTemplate`"wdth" ${width}, "wght" 900`;

  const handleCopyEmail = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(PERSONAL_INFO.email).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      });
    }
  };

  return (
    <section ref={sectionRef} id="contact" className={`relative z-10 ${reduced ? '' : 'h-[160vh]'}`}>
      <div className={`${reduced ? 'min-h-svh' : 'sticky top-0 h-svh'} overflow-hidden`}>
        <motion.div
          style={reduced ? undefined : { clipPath }}
          className="absolute inset-0 flex flex-col bg-[var(--accent-code)] text-[var(--accent-ink)] font-mono"
        >
          <div className="flex-1 min-h-0 flex flex-col items-center justify-center text-center px-4 pt-14">
            <p className="text-xs sm:text-sm mb-3 sm:mb-5">&gt; thanks for watching</p>
            <motion.h2
              style={reduced ? undefined : { scale: headlineScale, fontVariationSettings: IS_TOUCH ? '"wdth" 84, "wght" 900' : fontVariation }}
              className="font-display text-[min(19vw,25vh)] mb-5 sm:mb-8"
            >
              Got
              <br />
              footage?
            </motion.h2>
            <p className="max-w-[480px] text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8">
              Or a page that needs running. Pick the service you need, and the email opens with the few
              details I'll need to reply properly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
              {SERVICES.map((service, i) => (
                <MagneticButton key={service.id} href={service.mailto} label={CTA_LABELS[service.id]} primary={i === 0} />
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-5 text-xs">
              <button type="button" onClick={handleCopyEmail} className="flex items-center gap-1.5 underline-offset-2 hover:underline cursor-pointer">
                {copied ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
                <span>{copied ? 'Copied!' : PERSONAL_INFO.email}</span>
              </button>
              <a href={INSTAGRAM_DM_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 underline-offset-2 hover:underline">
                <span>DM {instagram.handle} on Instagram</span>
                <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
              </a>
            </div>
          </div>

          <footer className="flex items-center justify-between gap-4 px-4 sm:px-8 pt-4 pb-16 text-[11px]">
            <span>John Paulo Sanchez © 2026</span>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top of page"
              className="flex items-center gap-1.5 hover:underline cursor-pointer"
            >
              <ArrowUp className="w-3 h-3" aria-hidden="true" />
              <span>back to top</span>
            </button>
          </footer>
        </motion.div>
      </div>
    </section>
  );
};
