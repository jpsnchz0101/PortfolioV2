import React, { useEffect, useRef } from 'react';
import { motion, MotionValue, useMotionTemplate, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

const base = import.meta.env.BASE_URL || '/';
const cleanBase = base.endsWith('/') ? base : `${base}/`;
const PHOTO_SRC = `${cleanBase}profile-800.jpg`;

const ASCII_RAMP = ' .:-=+*#%@';
const BIO = `I'm ${PERSONAL_INFO.name}, a video editor and social media manager from Manila, and a Computer Engineering student. I work remotely in CapCut, After Effects and Canva.`;

/** Draws the portrait as type, using the same ASCII treatment as the After Effects reel. */
function useAsciiPortrait(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const image = new Image();
    image.src = PHOTO_SRC;
    image.onload = () => {
      const size = 800;
      const columns = 72;
      const cell = size / columns;
      canvas.width = size;
      canvas.height = Math.round((size * image.height) / image.width);
      const rows = Math.round(canvas.height / cell);

      const sample = document.createElement('canvas');
      sample.width = columns;
      sample.height = rows;
      const sampleCtx = sample.getContext('2d', { willReadFrequently: true });
      if (!sampleCtx) return;
      sampleCtx.drawImage(image, 0, 0, columns, rows);
      const { data } = sampleCtx.getImageData(0, 0, columns, rows);

      ctx.fillStyle = '#cdd0d6';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#06241a';
      ctx.font = `700 ${cell * 1.15}px 'JetBrains Mono', monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
          const i = (y * columns + x) * 4;
          const luma = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255;
          const darkness = Math.max(0, Math.min(0.999, (0.8 - luma) / 0.72));
          const glyph = ASCII_RAMP[Math.floor(darkness * ASCII_RAMP.length)];
          if (glyph !== ' ') ctx.fillText(glyph, (x + 0.5) * cell, (y + 0.5) * cell);
        }
      }
    };
  }, [canvasRef]);
}

/** Scrolling wipes the ASCII render away to reveal the real photo, like a transition. */
const AsciiPortrait: React.FC = () => {
  const reduced = useReducedMotion();
  const frameRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useAsciiPortrait(canvasRef);

  const { scrollYProgress } = useScroll({ target: frameRef, offset: ['start 80%', 'center 45%'] });
  const remaining = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const clipPath = useMotionTemplate`inset(${remaining}% 0% 0% 0%)`;
  const lineTop = useMotionTemplate`${remaining}%`;

  return (
    <div
      ref={frameRef}
      className="relative w-full max-w-[220px] sm:max-w-[280px] aspect-[837/852] overflow-hidden border border-[var(--border-hover)] bg-[#cdd0d6]"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
      <motion.img
        src={PHOTO_SRC}
        alt={`Portrait of ${PERSONAL_INFO.name}`}
        style={reduced ? undefined : { clipPath }}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      {!reduced && (
        <motion.span style={{ top: lineTop }} className="absolute inset-x-0 h-0.5 bg-[var(--accent-glow)] shadow-[0_0_14px_var(--accent-glow)]" aria-hidden="true" />
      )}
    </div>
  );
};

const RevealWord: React.FC<{ word: string; index: number; total: number; progress: MotionValue<number> }> = ({ word, index, total, progress }) => {
  const opacity = useTransform(progress, [index / total, (index + 1) / total], [0.18, 1]);
  return <motion.span style={{ opacity }}>{word} </motion.span>;
};

export const AboutSection: React.FC = () => {
  const reduced = useReducedMotion();
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const { scrollYProgress } = useScroll({ target: textRef, offset: ['start 85%', 'end 55%'] });
  const words = BIO.split(' ');

  return (
    <section id="about" className="relative z-10 px-4 sm:px-8 py-16 sm:py-24 font-mono scroll-mt-14">
      <p className="text-[11px] text-[var(--text-secondary)] mb-8">
        <span className="text-[var(--accent-code)] font-bold">SEQ 05</span> / the editor
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-8 lg:gap-16 items-center">
        <AsciiPortrait />

        <div>
          <p
            ref={textRef}
            style={{ fontVariationSettings: '"wdth" 92, "wght" 700' }}
            className="font-display normal-case !leading-[1.08] text-[clamp(26px,3.9vw,54px)] text-[var(--text-primary)] mb-8"
          >
            {reduced
              ? BIO
              : words.map((word, i) => <RevealWord key={i} word={word} index={i} total={words.length} progress={scrollYProgress} />)}
          </p>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            I also build websites.{' '}
            <a
              href={PERSONAL_INFO.socials[0].url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="Open GitHub"
              className="inline-flex items-center gap-0.5 text-[var(--text-primary)] underline underline-offset-2 hover:text-[var(--accent-code)] transition-colors"
            >
              See my code on GitHub
              <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};
