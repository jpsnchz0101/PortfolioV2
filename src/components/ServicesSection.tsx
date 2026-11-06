import React, { useEffect, useRef, useState } from 'react';
import { motion, MotionValue, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { AUDIENCES, SAMPLE_MONTH, SERVICES } from '../data/portfolioData';

const base = import.meta.env.BASE_URL || '/';
const cleanBase = base.endsWith('/') ? base : `${base}/`;

const POST_STYLES = {
  reel: { label: 'Reel', short: 'R', className: 'bg-[var(--accent-code)] text-[var(--accent-ink)]' },
  carousel: { label: 'Carousel', short: 'C', className: 'bg-[var(--caption)] text-black' },
  story: { label: 'Story', short: 'S', className: 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-hover)]' },
  rest: { label: 'Rest', short: '', className: 'border border-dashed border-[var(--border-subtle)]' },
};

const CalendarCell: React.FC<{ type: keyof typeof POST_STYLES; index: number; progress: MotionValue<number> }> = ({
  type,
  index,
  progress,
}) => {
  const start = (index / SAMPLE_MONTH.length) * 0.82;
  const scale = useTransform(progress, [start, start + 0.14], [0.4, 1]);
  const opacity = useTransform(progress, [start, start + 0.1], [0, 1]);
  const style = POST_STYLES[type];

  return (
    <motion.span
      style={{ scale, opacity }}
      className={`aspect-square flex items-center justify-center text-[10px] sm:text-xs font-bold ${style.className}`}
    >
      {style.short}
    </motion.span>
  );
};

/** A sample month that schedules itself as you scroll past it. */
const SampleCalendar: React.FC = () => {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 95%', 'end 60%'] });
  const staticProgress = useTransform(scrollYProgress, () => 1);

  return (
    <div ref={ref} className="w-full max-w-[420px]">
      <p className="flex justify-between text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-2">
        <span>Sample month</span>
        <span>Example only</span>
      </p>
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5" role="img" aria-label="A sample posting calendar mixing reels, carousels, stories and rest days">
        {SAMPLE_MONTH.map((type, i) => (
          <CalendarCell key={i} type={type} index={i} progress={reduced ? staticProgress : scrollYProgress} />
        ))}
      </div>
      <p className="flex flex-wrap gap-x-3 gap-y-1 mt-3 text-[10px] text-[var(--text-muted)]" aria-hidden="true">
        {(['reel', 'carousel', 'story'] as const).map((type) => (
          <span key={type} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 ${POST_STYLES[type].className}`} />
            {POST_STYLES[type].label}
          </span>
        ))}
      </p>
    </div>
  );
};

/** A safe-zone view of a real reel: what an editor is thinking about on every frame. */
const SafeZonePhone: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [inView, setInView] = useState<boolean>(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (inView && !reduced) video.play().catch(() => undefined);
    else video.pause();
  }, [inView, reduced]);

  return (
    <div className="relative h-[clamp(320px,56vh,520px)] aspect-[9/16] rounded-2xl overflow-hidden border border-[var(--border-hover)] bg-[#0d1017]">
      <video
        ref={videoRef}
        src={`${cleanBase}video/3.mp4`}
        poster={`${cleanBase}video/posters/3_poster.jpg`}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Talking-head reel with animated captions"
      />
      {/* Safe-zone guides */}
      <div className="absolute inset-x-[6%] top-[9%] bottom-[20%] border border-dashed border-white/50 pointer-events-none" aria-hidden="true" />
      <span className="absolute top-[4%] left-[6%] text-[9px] uppercase tracking-wider text-white bg-black/60 px-1" aria-hidden="true">
        Hook: first 3s
      </span>
      <span className="absolute bottom-[14%] left-[6%] text-[9px] uppercase tracking-wider text-white bg-black/60 px-1" aria-hidden="true">
        Caption safe zone
      </span>
    </div>
  );
};

const Reveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-10% 0px' }}
    transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="relative z-10 px-4 sm:px-8 pt-16 sm:pt-24 pb-10 font-mono scroll-mt-14">
      <p className="text-[11px] text-[var(--text-secondary)] mb-2">
        <span className="text-[var(--accent-code)] font-bold">SEQ 03</span> / what i do
      </p>
      <h2
        style={{ fontVariationSettings: '"wdth" 88, "wght" 850' }}
        className="font-display text-[clamp(44px,10vw,128px)] text-[var(--text-primary)] mb-5"
      >
        Two services.
        <br />
        <span className="text-outline">Hire either one.</span>
      </h2>
      <p className="max-w-[560px] text-sm sm:text-base leading-relaxed text-[var(--text-secondary)] mb-10 sm:mb-16">
        Video editing and social media management are booked separately. You don't need one to hire me
        for the other.
      </p>

      <div className="space-y-14 sm:space-y-24">
        {SERVICES.map((service, i) => (
          <div
            key={service.id}
            className={`flex flex-col gap-8 lg:gap-16 lg:items-center lg:justify-between ${i % 2 ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
          >
            <Reveal className="lg:max-w-[560px]">
              <span className="block text-xs font-bold text-[var(--accent-code)] mb-3">Service 0{i + 1}</span>
              <h3
                style={{ fontVariationSettings: '"wdth" 92, "wght" 800' }}
                className="font-display text-[clamp(30px,5vw,60px)] text-[var(--text-primary)] mb-4"
              >
                {service.title}
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-[var(--text-secondary)] mb-5">{service.summary}</p>
              <ul className="space-y-2.5 list-none text-xs sm:text-sm text-[var(--text-secondary)] mb-6">
                {service.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2.5">
                    <span className="text-[var(--accent-code)]" aria-hidden="true">&gt;</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <a
                  href={service.mailto}
                  data-cursor="Open your email"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[var(--accent-code)] text-[var(--accent-ink)] text-xs sm:text-sm font-bold hover:opacity-85 transition-opacity"
                >
                  <span>{service.ctaLabel}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
                <span className="text-[11px] text-[var(--text-muted)]">{service.note}</span>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="flex justify-center lg:flex-1">
              {service.id === 'editing' ? <SafeZonePhone /> : <SampleCalendar />}
            </Reveal>
          </div>
        ))}
      </div>

      {/* Who it's for */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-14 sm:mt-24">
        {AUDIENCES.map((audience, i) => (
          <Reveal key={audience.label} delay={i * 0.08} className="p-5 sm:p-6 border border-dashed border-[var(--border-hover)] bg-[var(--bg-primary)]/60">
            <span
              style={{ fontVariationSettings: '"wdth" 92, "wght" 800' }}
              className="font-display block text-xl sm:text-2xl text-[var(--text-primary)] mb-2"
            >
              {audience.label}
            </span>
            <p className="text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">{audience.need}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
};
