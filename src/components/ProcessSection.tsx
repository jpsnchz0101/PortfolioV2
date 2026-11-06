import React, { useRef, useState } from 'react';
import { motion, MotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { PROCESS_TRACKS, ProcessStep, ServiceId, WORK_PROMISES } from '../data/portfolioData';

const TRACK_IDS: ServiceId[] = ['editing', 'social'];

const Step: React.FC<ProcessStep & { index: number; count: number; progress: MotionValue<number> }> = ({
  title,
  when,
  summary,
  index,
  count,
  progress,
}) => {
  const at = index / count;
  const opacity = useTransform(progress, [at - 0.02, at + 0.1], [0.28, 1]);
  const x = useTransform(progress, [at - 0.02, at + 0.1], [14, 0]);

  return (
    <motion.li style={{ opacity, x }} className="relative pl-8 sm:pl-12 pb-9 sm:pb-12 last:pb-2">
      <span className="absolute left-0 top-1 w-[15px] h-[15px] -translate-x-[7px] rotate-45 bg-[var(--accent-code)]" aria-hidden="true" />
      <span className="flex flex-wrap items-center gap-2 mb-1.5">
        <span className="text-xs font-bold text-[var(--accent-code)]">0{index + 1}</span>
        <span className="px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider border border-[var(--accent-code)] text-[var(--accent-code)]">
          {when}
        </span>
      </span>
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

/** Each service's process as a render queue: scrolling draws the line and runs the progress bar. */
export const ProcessSection: React.FC = () => {
  const reduced = useReducedMotion();
  const [trackId, setTrackId] = useState<ServiceId>('editing');
  const track = PROCESS_TRACKS[trackId];
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
      <p className="text-[11px] text-[var(--text-secondary)] mb-2">
        <span className="text-[var(--accent-code)] font-bold">SEQ 04</span> / how i work
      </p>
      <h2
        style={{ fontVariationSettings: '"wdth" 88, "wght" 850' }}
        className="font-display text-[clamp(44px,8vw,112px)] text-[var(--text-primary)] mb-6 sm:mb-8"
      >
        No guessing.
      </h2>

      {/* Promises at a glance */}
      <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3 list-none mb-12 sm:mb-16">
        {WORK_PROMISES.map((promise, i) => (
          <motion.li
            key={promise.label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8% 0px' }}
            transition={{ duration: 0.45, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            className="p-4 sm:p-5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)]"
          >
            <span
              style={{ fontVariationSettings: '"wdth" 90, "wght" 850' }}
              className="font-display block text-[clamp(26px,4vw,44px)] text-[var(--accent-code)] mb-1"
            >
              {promise.value}
            </span>
            <span className="block text-[11px] sm:text-xs leading-snug text-[var(--text-secondary)]">{promise.label}</span>
          </motion.li>
        ))}
      </ul>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10 lg:gap-16">
        <div className="lg:sticky lg:top-24 self-start">

          {/* Service switch */}
          <div role="tablist" aria-label="Choose a service" className="inline-flex mb-6 border border-[var(--border-hover)]">
            {TRACK_IDS.map((id) => {
              const selected = id === trackId;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  id={`process-tab-${id}`}
                  aria-selected={selected}
                  aria-controls="process-steps"
                  onClick={() => setTrackId(id)}
                  className={`px-3 sm:px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                    selected
                      ? 'bg-[var(--accent-code)] text-[var(--accent-ink)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {PROCESS_TRACKS[id].label}
                </button>
              );
            })}
          </div>

          <div className="max-w-[360px]" aria-hidden="true">
            <div className="flex justify-between text-[11px] text-[var(--text-secondary)] mb-1.5 tabular-nums">
              <span>{track.barLabel}</span>
              <span ref={percentRef} className="font-bold text-[var(--accent-code)]">{reduced ? '100%' : '0%'}</span>
            </div>
            <div className="h-2 border border-[var(--border-hover)]">
              <motion.div style={{ width: barWidth }} className="h-full bg-[var(--accent-code)]" />
            </div>
          </div>
          <p className="max-w-[360px] mt-4 text-[11px] leading-relaxed text-[var(--text-muted)]">{track.note}</p>
        </div>

        <div className="relative">
          <div className="absolute left-0 top-1 bottom-4 w-px bg-[var(--border-subtle)]" aria-hidden="true" />
          <motion.div style={{ height: lineHeight }} className="absolute left-0 top-1 w-px bg-[var(--accent-code)]" aria-hidden="true" />
          <ol
            ref={listRef}
            id="process-steps"
            role="tabpanel"
            aria-labelledby={`process-tab-${trackId}`}
            className="list-none"
          >
            {track.steps.map((step, i) => (
              <Step
                key={`${trackId}-${step.title}`}
                title={step.title}
                when={step.when}
                summary={step.summary}
                index={i}
                count={track.steps.length}
                progress={progress}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};
