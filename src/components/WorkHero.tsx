import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  motion,
  MotionValue,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react';
import { Volume2, X } from 'lucide-react';
import { HERO_ROTATING_WORDS, SHOWCASE_REELS, ShowcaseReel } from '../data/portfolioData';
import { useMusic } from '../context/MusicContext';

const base = import.meta.env.BASE_URL || '/';
const cleanBase = base.endsWith('/') ? base : `${base}/`;
const reelSrc = (reel: ShowcaseReel) => `${cleanBase}video/${reel.index}.mp4`;
const reelPoster = (reel: ShowcaseReel) => `${cleanBase}video/posters/${reel.index}_poster.jpg`;

const REEL_COUNT = SHOWCASE_REELS.length;
const MID = (REEL_COUNT - 1) / 2;

interface Stage {
  vw: number;
  vh: number;
  cardH: number;
  cardW: number;
  fanStep: number;
  stripScale: number;
  stripStep: number;
}

function measureStage(): Stage {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cardH = Math.max(240, Math.min(vh * 0.5, 520));
  const cardW = (cardH * 9) / 16;
  const fanStep = Math.min(cardW * 0.62, (vw - cardW - 24) / (REEL_COUNT - 1));
  const stripScale = Math.min(1.45, (vh * 0.72) / cardH, (vw * 0.74) / cardW);
  return { vw, vh, cardH, cardW, fanStep, stripScale, stripStep: cardW * stripScale * 0.86 + 20 };
}

/** Measures the stage. Ignores mobile address-bar height changes so the pin doesn't jump. */
function useStage(): Stage {
  const [stage, setStage] = useState<Stage>(measureStage);

  useEffect(() => {
    const handleResize = () => {
      setStage((prev) => (window.innerWidth === prev.vw && Math.abs(window.innerHeight - prev.vh) < 120 ? prev : measureStage()));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return stage;
}

/** Types through the rotating words. Shows the first word, static, for reduced motion. */
function useRotatingWord(words: string[], enabled: boolean): string {
  const [text, setText] = useState<string>(words[0]);

  useEffect(() => {
    if (!enabled) return;

    let wordIndex = 0;
    let charCount = words[0].length;
    let deleting = true;
    let timer: number;

    const tick = () => {
      const word = words[wordIndex];
      charCount += deleting ? -1 : 1;
      setText(word.slice(0, charCount));

      if (deleting && charCount === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        timer = window.setTimeout(tick, 200);
      } else if (!deleting && charCount === word.length) {
        deleting = true;
        timer = window.setTimeout(tick, 2200);
      } else {
        timer = window.setTimeout(tick, deleting ? 28 : 55);
      }
    };

    timer = window.setTimeout(tick, 2200);
    return () => window.clearTimeout(timer);
  }, [words, enabled]);

  return text;
}

const mix = (a: number, b: number, t: number) => a + (b - a) * t;

interface ReelVideoProps {
  reel: ShowcaseReel;
  shouldPlay: boolean;
}

const ReelCardFace: React.FC<ReelVideoProps> = ({ reel, shouldPlay }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (shouldPlay) {
      video.play().catch(() => {
        // Autoplay blocked: the poster stays up and the lightbox still works
      });
    } else {
      video.pause();
    }
  }, [shouldPlay]);

  return (
    <>
      <video
        ref={videoRef}
        src={reelSrc(reel)}
        poster={reelPoster(reel)}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        loop
        playsInline
        preload="metadata"
        tabIndex={-1}
      />
      <span className="absolute top-2.5 left-2.5 px-1.5 py-0.5 bg-black/70 backdrop-blur-sm border border-white/20 text-[9px] uppercase tracking-wider text-white">
        {reel.format}
      </span>
      <span className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/70 backdrop-blur-sm border border-white/20 text-white">
        <Volume2 className="w-3 h-3" aria-hidden="true" />
      </span>
      <span className="absolute inset-x-0 bottom-0 p-3 pt-10 bg-gradient-to-t from-black/95 via-black/70 to-transparent text-white">
        <span className="block text-xs font-bold tracking-tight line-clamp-1">{reel.title}</span>
        <span className="block text-[10px] leading-snug text-white/75 mt-0.5 line-clamp-2">{reel.caption}</span>
      </span>
    </>
  );
};

interface PinnedCardProps extends ReelVideoProps {
  index: number;
  stage: Stage;
  spread: MotionValue<number>;
  pan: MotionValue<number>;
  onOpen: (reel: ShowcaseReel) => void;
}

/** One reel. It sits in the fan at rest, then becomes a frame on the curved filmstrip. */
const PinnedCard: React.FC<PinnedCardProps> = ({ reel, index, stage, spread, pan, shouldPlay, onOpen }) => {
  const { vh, cardH, cardW, fanStep, stripScale, stripStep } = stage;
  const offset = index - MID;

  const x = useTransform<number, number>([spread, pan], ([t, p]) => {
    const fanX = offset * fanStep;
    const stripX = (index - p * (REEL_COUNT - 1)) * stripStep;
    return mix(fanX, stripX, t);
  });
  const y = useTransform(spread, (t: number) => {
    const fanY = vh - 52 - cardH / 2 - 10 + offset * offset * 5;
    return mix(fanY, vh / 2, t);
  });
  const rotateZ = useTransform(spread, (t: number) => (1 - t) * offset * 5);
  const rotateY = useTransform<number, number>([spread, x], ([t, currentX]) => {
    const distance = Math.max(-1.4, Math.min(1.4, currentX / stripStep));
    return t * distance * -24;
  });
  const scale = useTransform<number, number>([spread, x], ([t, currentX]) => {
    const fanScale = 1 - Math.abs(offset) * 0.025;
    const nearCenter = Math.min(1, Math.abs(currentX) / (stripStep * 1.2));
    return mix(fanScale, stripScale * (1 - 0.16 * nearCenter), t);
  });
  const zIndex = useTransform(x, (currentX) => Math.round(200 - Math.abs(currentX + 1) / 8));

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(reel)}
      aria-label={`Play ${reel.title} with sound`}
      data-cursor="Watch with sound"
      style={{ x, y, rotateZ, rotateY, scale, zIndex, width: cardW, height: cardH, marginLeft: -cardW / 2, marginTop: -cardH / 2 }}
      className="absolute top-0 left-1/2 rounded-2xl overflow-hidden border border-white/20 hover:border-[var(--accent-glow)] focus-visible:border-[var(--accent-glow)] bg-[#0d1017] text-left cursor-pointer shadow-[0_24px_60px_rgba(0,0,0,0.45)] transition-[border-color]"
    >
      <ReelCardFace reel={reel} shouldPlay={shouldPlay} />
    </motion.button>
  );
};

const HeroCopy: React.FC<{ rotatingWord: string }> = ({ rotatingWord }) => (
  <p className="font-mono text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)] max-w-[420px]">
    Hi, I'm John Paulo. I edit{' '}
    <span className="font-semibold text-[var(--accent-code)]">
      {rotatingWord}
      <span className="hero-caret">_</span>
    </span>
    <br />
    and run social pages for brands &amp; creators.
    <span className="block mt-1 text-[10px] sm:text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
      Reels / TikTok / YouTube Shorts
    </span>
  </p>
);

const Lightbox: React.FC<{ reel: ShowcaseReel; onClose: () => void }> = ({ reel, onClose }) => {
  const { duck } = useMusic();

  // Background music fades out while a reel plays with sound, then fades back in
  useEffect(() => duck(), [duck]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={reel.title}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative h-full max-h-[min(88svh,780px)] max-w-full aspect-[9/16] rounded-2xl overflow-hidden border border-white/25 bg-black"
      >
        <video
          src={reelSrc(reel)}
          poster={reelPoster(reel)}
          className="absolute inset-0 w-full h-full object-contain"
          autoPlay
          controls
          playsInline
          loop
        />
        <button
          type="button"
          onClick={onClose}
          autoFocus
          aria-label="Close video"
          className="absolute top-3 right-3 p-2 rounded-full bg-black/70 border border-white/25 hover:border-white/60 text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </motion.div>,
    document.body
  );
};

/** Reduced motion: no pinning, just the headline and a swipeable row of reels. */
const StaticHero: React.FC<{ onOpen: (reel: ShowcaseReel) => void }> = ({ onOpen }) => (
  <section id="work" className="relative z-10 pt-20 pb-12 px-4 sm:px-8">
    <h1 className="font-display text-[min(15.5vw,17vh)] text-[var(--text-primary)] mb-4">
      Stop the
      <br />
      <span className="text-[var(--accent-code)]">scroll.</span>
    </h1>
    <div className="mb-6">
      <HeroCopy rotatingWord={HERO_ROTATING_WORDS[0]} />
    </div>
    <div className="flex gap-3 overflow-x-auto snap-x pb-2">
      {SHOWCASE_REELS.map((reel) => (
        <button
          key={reel.index}
          type="button"
          onClick={() => onOpen(reel)}
          aria-label={`Play ${reel.title} with sound`}
          className="relative flex-none h-[56svh] aspect-[9/16] snap-start rounded-2xl overflow-hidden border border-white/20 bg-[#0d1017] text-left cursor-pointer"
        >
          <ReelCardFace reel={reel} shouldPlay={false} />
        </button>
      ))}
    </div>
  </section>
);

export const WorkHero: React.FC = () => {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const stage = useStage();
  const rotatingWord = useRotatingWord(HERO_ROTATING_WORDS, !reduced);
  const [activeReel, setActiveReel] = useState<ShowcaseReel | null>(null);
  const [focusIndex, setFocusIndex] = useState<number>(2);
  const [inView, setInView] = useState<boolean>(true);

  const { scrollYProgress, scrollY } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const spread = useTransform(progress, [0, 0.16], [0, 1]);
  const pan = useTransform(progress, [0.16, 0.94], [0, 1]);

  // The headline stretches with scroll speed: "SCROLL." literally reacts to scrolling
  const velocity = useVelocity(scrollY);
  const speed = useSpring(useTransform(velocity, (v) => Math.min(1, Math.abs(v) / 2200)), { stiffness: 160, damping: 26 });
  const baseWidth = stage.vw < 640 ? 74 : 92;
  const stretch = useTransform(speed, [0, 1], [baseWidth, stage.vw < 640 ? 96 : 125]);
  const fontVariation = useMotionTemplate`"wdth" ${stretch}, "wght" 850`;

  const headlineOpacity = useTransform(spread, [0, 0.65], [1, 0]);
  const headlineY = useTransform(spread, [0, 1], [0, -90]);
  const labelOpacity = useTransform(spread, [0.7, 1], [0, 1]);
  const ghostX = useTransform(pan, [0, 1], ['6%', '-46%']);

  // Only decode videos near the focused reel, and none off-screen
  useMotionValueEvent(pan, 'change', (value) => {
    const next = spread.get() < 0.6 ? 2 : Math.round(value * (REEL_COUNT - 1));
    setFocusIndex(next);
  });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const playRadius = stage.vw < 768 ? 1 : 2;

  if (reduced) {
    return (
      <>
        <StaticHero onOpen={setActiveReel} />
        {activeReel && <Lightbox reel={activeReel} onClose={() => setActiveReel(null)} />}
      </>
    );
  }

  return (
    <section ref={sectionRef} id="work" className="relative z-10 h-[420vh]" aria-label="Selected video work">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Ghost type that pans against the filmstrip */}
        <motion.div
          style={{ opacity: labelOpacity, x: ghostX, fontVariationSettings: '"wdth" 110, "wght" 850' }}
          className="font-display text-outline absolute top-1/2 -translate-y-1/2 left-0 text-[42vh] whitespace-nowrap select-none pointer-events-none"
          aria-hidden="true"
        >
          Selected cuts
        </motion.div>

        {/* Headline */}
        <motion.div style={{ opacity: headlineOpacity, y: headlineY }} className="absolute inset-x-0 top-14 px-4 sm:px-8 z-[5]">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
            <h1 className="text-[min(15.5vw,17vh)] font-display text-[var(--text-primary)]" aria-label="Stop the scroll.">
              {['Stop the', 'scroll.'].map((line, i) => (
                <span key={line} className="block overflow-hidden pb-[0.04em]" aria-hidden="true">
                  <motion.span
                    initial={{ y: '105%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.7, delay: 0.05 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                    style={{ fontVariationSettings: fontVariation, display: 'block' }}
                    className={i === 1 ? 'text-[var(--accent-code)]' : ''}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="lg:pt-3">
              <HeroCopy rotatingWord={rotatingWord} />
            </motion.div>
          </div>
        </motion.div>

        {/* Reels */}
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-10"
          style={{ perspective: 1400 }}
        >
          {SHOWCASE_REELS.map((reel, i) => (
            <PinnedCard
              key={reel.index}
              reel={reel}
              index={i}
              stage={stage}
              spread={spread}
              pan={pan}
              shouldPlay={inView && activeReel === null && Math.abs(i - focusIndex) <= playRadius}
              onOpen={setActiveReel}
            />
          ))}
        </motion.div>

        {/* Filmstrip labels */}
        <motion.div
          style={{ opacity: labelOpacity }}
          className="absolute top-14 inset-x-0 z-20 px-4 sm:px-8 flex items-center justify-between font-mono text-[11px] text-[var(--text-secondary)] pointer-events-none"
          aria-hidden="true"
        >
          <span>
            <span className="text-[var(--accent-code)] font-bold">SEQ 01</span> / selected cuts
          </span>
          <span className="tabular-nums">
            {String(focusIndex + 1).padStart(2, '0')} / {String(REEL_COUNT).padStart(2, '0')}
          </span>
        </motion.div>
      </div>

      {activeReel && <Lightbox reel={activeReel} onClose={() => setActiveReel(null)} />}
    </section>
  );
};
