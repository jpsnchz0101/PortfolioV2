import React, { useRef } from 'react';
import { motion, MotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { PROCESS_STEPS } from '../data/portfolioData';

const Step: React.FC<{ title: string; summary: string; index: number; progress: MotionValue<number> }> = ({
  title,
  summary,
  index,
  progress,
}) => {
  const at = index / PROCESS_STEPS.length;
  const opacity = useTransform(progress, [at - 0.02, at + 0.1], [0.28, 1]);
  const x = useTransform(progress, [at - 0.02, at + 0.1], [14, 0]);

  return (
    <motion.li style={{ opacity, x }} className="relative pl-8 sm:pl-12 pb-10 sm:pb-16 last:pb-2">
      <span className="absolute left-0 top-1 w-[15px] h-[15px] -translate-x-[7px] rotate-45 bg-[var(--accent-code)]" aria-hidden="true" />
      <span className="block text-xs font-bold text-[var(--accent-code)] mb-1.5">0{index + 1}</span>
      <h3
        style={{ fontVariationSettings: '"wdth" 92, "wght" 800' }}
        className="font-display text-[clamp(26px,4.4vw,52px)] text-[var(--text-primary)] mb-2"
      >
        {title}
      </h3>
      <p className="max-w-[520px] text-sm leading-relaxed text-[var(--text-secondary)]">{summary}</p>
    </motion.li>
  );
};

/** The process as a render queue: scrolling draws the line and runs the export bar. */
export const ProcessSection: React.FC = () => {
  const reduced = useReducedMotion();
  const listRef = useRef<HTMLOListElement | null>(null);
  const percentRef = useRef<HTMLSpanElement | null>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 75%', 'end 65%'] });
  const staticProgress = useTransform(scrollYProgress, () => 1);
  const progress = reduced ? staticProgress : scrollYProgress;
  const lineHeight = useTransform(progress, [0, 1], ['0%', '100%']);
  const barWidth = useTransform(progress, [0, 1], ['0%', '100%']);

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (percentRef.current) percentRef.current.textContent = `${Math.round(value * 100)}%`;
  });

  return (
    <section id="process" className="relative z-10 px-4 sm:px-8 py-16 sm:py-24 font-mono scroll-mt-14">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10 lg:gap-16">
        <div className="lg:sticky lg:top-24 self-start">
          <p className="text-[11px] text-[var(--text-secondary)] mb-2">
            <span className="text-[var(--accent-code)] font-bold">SEQ 04</span> / how it works
          </p>
          <h2
            style={{ fontVariationSettings: '"wdth" 88, "wght" 850' }}
            className="font-display text-[clamp(44px,8vw,112px)] text-[var(--text-primary)] mb-6"
          >
            No guessing.
          </h2>
          <div className="max-w-[360px]" aria-hidden="true">
            <div className="flex justify-between text-[11px] text-[var(--text-secondary)] mb-1.5 tabular-nums">
              <span>Exporting your project</span>
              <span ref={percentRef} className="font-bold text-[var(--accent-code)]">{reduced ? '100%' : '0%'}</span>
            </div>
            <div className="h-2 border border-[var(--border-hover)]">
              <motion.div style={{ width: barWidth }} className="h-full bg-[var(--accent-code)]" />
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-0 top-1 bottom-4 w-px bg-[var(--border-subtle)]" aria-hidden="true" />
          <motion.div style={{ height: lineHeight }} className="absolute left-0 top-1 w-px bg-[var(--accent-code)]" aria-hidden="true" />
          <ol ref={listRef} className="list-none">
            {PROCESS_STEPS.map((step, i) => (
              <Step key={step.title} title={step.title} summary={step.summary} index={i} progress={progress} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};
