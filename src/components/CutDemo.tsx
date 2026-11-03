import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { Check } from 'lucide-react';
import { CUT_STAGES, CUT_WORDS } from '../data/portfolioData';

const ramp = (value: number, from: number, to: number) => Math.max(0, Math.min(1, (value - from) / (to - from)));

// Each word's rough spoken length, so the timeline blocks look like real clips
const wordWeight = (text: string) => 0.5 + text.length * 0.12;

const TOTAL_WEIGHT = CUT_WORDS.reduce((sum, word) => sum + wordWeight(word.text), 0);
const KEPT_WEIGHT = CUT_WORDS.filter((word) => !word.filler).reduce((sum, word) => sum + wordWeight(word.text), 0);
const RAW_SECONDS = 11;
const CUT_SECONDS = (RAW_SECONDS * KEPT_WEIGHT) / TOTAL_WEIGHT;

const SPOKEN_WORDS = CUT_WORDS.filter((word) => !word.filler);

const WAVE_BARS = Array.from({ length: 64 }, (_, i) =>
  Math.round(22 + Math.abs(Math.sin(i * 1.7) + Math.sin(i * 0.6) * 0.8) * 42)
);

const TrackLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="flex-none w-6 text-[9px] font-semibold text-[var(--text-muted)]">{children}</span>
);

/** Phone preview: goes from flat and uncaptioned to graded, punched-in and captioned. */
const PhonePreview: React.FC<{ captions: number; sound: number; ready: boolean }> = ({ captions, sound, ready }) => {
  const [wordIndex, setWordIndex] = useState<number>(0);
  const captionsOn = captions > 0.05;

  useEffect(() => {
    if (!captionsOn) return;
    const timer = window.setInterval(() => setWordIndex((i) => (i + 1) % SPOKEN_WORDS.length), 420);
    return () => window.clearInterval(timer);
  }, [captionsOn]);

  const word = SPOKEN_WORDS[wordIndex];
  const grade = Math.max(captions * 0.5, sound);

  return (
    <div className="relative h-full aspect-[9/16] rounded-[1.4rem] overflow-hidden border-2 border-[var(--border-hover)] bg-[#17191c] flex-none">
      {/* Graded backdrop */}
      <div
        className="absolute inset-0"
        style={{
          opacity: grade,
          background: 'radial-gradient(90% 60% at 30% 22%, #1f7a58 0%, transparent 70%), radial-gradient(80% 60% at 85% 70%, #6d3bd1 0%, transparent 70%), #0a0c10',
        }}
      />
      {/* Speaker silhouette */}
      <svg
        viewBox="0 0 90 160"
        className="absolute inset-0 w-full h-full"
        style={{ transform: `scale(${1 + sound * 0.2})`, transformOrigin: '50% 45%' }}
        aria-hidden="true"
      >
        <circle cx="45" cy="62" r="17" fill={grade > 0.3 ? '#05070a' : '#3c4046'} />
        <path d="M12 160c0-38 14-62 33-62s33 24 33 62z" fill={grade > 0.3 ? '#05070a' : '#3c4046'} />
      </svg>

      <span className="absolute top-2.5 left-2.5 flex items-center gap-1 px-1.5 py-0.5 bg-black/60 text-[8px] font-mono text-white">
        {ready ? (
          <>
            <Check className="w-2.5 h-2.5 text-[#3dffa2]" aria-hidden="true" /> FINAL
          </>
        ) : captionsOn ? (
          'EDIT'
        ) : (
          'RAW'
        )}
      </span>

      {/* Captions */}
      <div className="absolute inset-x-1 top-[60%] flex justify-center" style={{ opacity: captions }}>
        <motion.span
          key={wordIndex}
          initial={{ scale: 0.6, y: 6 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 600, damping: 22 }}
          style={{ fontVariationSettings: '"wdth" 80, "wght" 900', textShadow: '0 2px 0 #000, 0 0 14px rgba(0,0,0,.7)' }}
          className={`font-display text-center ${
            word.emphasis ? 'text-[var(--caption)] text-[clamp(20px,3.6vh,36px)]' : 'text-white text-[clamp(14px,2.4vh,22px)]'
          }`}
        >
          {word.text}
        </motion.span>
      </div>
    </div>
  );
};

/** Scroll scrubs through a real edit: raw clip, cut, captions, sound, final. */
export const CutDemo: React.FC = () => {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [scrubbed, setScrubbed] = useState<number>(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', (value) => setScrubbed(Math.round(value * 500) / 500));

  const p = reduced ? 1 : scrubbed;
  const flag = ramp(p, 0.04, 0.18);
  const cut = ramp(p, 0.22, 0.46);
  const captions = ramp(p, 0.48, 0.72);
  const sound = ramp(p, 0.74, 0.9);
  const ready = p > 0.92;

  const stageIndex = ready ? 4 : p > 0.74 ? 3 : p > 0.48 ? 2 : p > 0.22 ? 1 : 0;
  const stage = CUT_STAGES[stageIndex];

  const seconds = RAW_SECONDS - (RAW_SECONDS - CUT_SECONDS) * cut;
  const clipWidth = ((TOTAL_WEIGHT - (TOTAL_WEIGHT - KEPT_WEIGHT) * cut) / TOTAL_WEIGHT) * 100;

  const sfxMarkers = useMemo(() => [12, 46, 78], []);

  return (
    <section
      ref={sectionRef}
      id="cut"
      className={`relative z-10 font-mono ${reduced ? 'py-16' : 'h-[420vh]'}`}
      aria-label="A demonstration of how a clip gets edited"
    >
      <div className={`${reduced ? '' : 'sticky top-0 h-screen'} overflow-hidden flex flex-col justify-center gap-3 sm:gap-5 px-4 sm:px-8 pt-14 pb-16`}>
        {/* Heading */}
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
          <div>
            <p className="text-[11px] text-[var(--text-secondary)] mb-1.5">
              <span className="text-[var(--accent-code)] font-bold">SEQ 02</span> / the cut
            </p>
            <h2
              style={{ fontVariationSettings: '"wdth" 88, "wght" 850' }}
              className="font-display text-[min(9.5vw,clamp(30px,6.5vh,72px))] text-[var(--text-primary)]"
            >
              Watch a clip get edited.
            </h2>
          </div>
          <p className="text-[10px] text-[var(--text-muted)]">Demo script, written for this page.</p>
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-3 sm:gap-8 items-stretch min-h-0">
          {/* Phone */}
          <div className="h-[clamp(190px,32vh,300px)] sm:h-[clamp(190px,44vh,460px)]">
            <PhonePreview captions={captions} sound={sound} ready={ready} />
          </div>

          {/* Stage + transcript */}
          <div className="min-w-0 flex flex-col justify-center gap-2 sm:gap-4">
            <div className="flex gap-1" aria-hidden="true">
              {CUT_STAGES.map((item, i) => (
                <span
                  key={item.label}
                  className={`h-1 flex-1 transition-colors ${i <= stageIndex ? 'bg-[var(--accent-code)]' : 'bg-[var(--border-subtle)]'}`}
                />
              ))}
            </div>

            <div aria-live="polite">
              <h3
                style={{ fontVariationSettings: '"wdth" 100, "wght" 800' }}
                className="font-display text-[min(6vw,clamp(20px,4vh,44px))] text-[var(--accent-code)]"
              >
                {stage.label}
              </h3>
              <p className="text-[11px] sm:text-[13px] leading-snug text-[var(--text-secondary)] mt-1">{stage.note}</p>
            </div>

            <p className="text-[12px] sm:text-[clamp(14px,2.6vh,22px)] leading-relaxed text-[var(--text-primary)]">
              {CUT_WORDS.map((word, i) => {
                if (word.filler) {
                  if (cut >= 1) return null;
                  return (
                    <span
                      key={i}
                      className="inline-block overflow-hidden align-bottom whitespace-nowrap"
                      style={{
                        maxWidth: `${(1 - cut) * 8}em`,
                        opacity: 1 - cut,
                        color: flag > 0 ? 'var(--cut)' : undefined,
                        textDecoration: flag > 0.5 ? 'line-through' : undefined,
                      }}
                    >
                      {word.text}&nbsp;
                    </span>
                  );
                }
                return (
                  <span key={i} className={captions > 0.5 && word.emphasis ? 'font-bold text-[var(--accent-code)]' : ''}>
                    {word.text}{' '}
                  </span>
                );
              })}
            </p>

            <p className="flex items-baseline gap-2 text-[var(--text-muted)] text-[10px] sm:text-xs tabular-nums">
              <span className="text-[var(--text-primary)] font-bold text-sm sm:text-lg">{seconds.toFixed(1)}s</span>
              <span>clip length</span>
              {cut > 0 && <span className="text-[var(--cut)]">-{(RAW_SECONDS - seconds).toFixed(1)}s</span>}
            </p>
          </div>
        </div>

        {/* Tracks */}
        <div className="relative space-y-1 p-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)]" aria-hidden="true">
          {/* V1 */}
          <div className="flex items-center gap-2">
            <TrackLabel>V1</TrackLabel>
            <div className="flex-1 h-4 sm:h-6">
              <div className="h-full flex gap-px" style={{ width: `${clipWidth}%` }}>
                {CUT_WORDS.map((word, i) => {
                  const weight = wordWeight(word.text) * (word.filler ? 1 - cut : 1);
                  if (weight <= 0) return null;
                  return (
                    <span
                      key={i}
                      style={{ flexGrow: weight, flexBasis: 0, backgroundColor: word.filler && flag > 0 ? 'var(--cut)' : 'var(--accent-code)' }}
                      className="min-w-0"
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* CC */}
          <div className="flex items-center gap-2">
            <TrackLabel>CC</TrackLabel>
            <div className="flex-1 h-3 sm:h-4">
              <div className="h-full flex gap-px" style={{ width: `${clipWidth}%` }}>
                {SPOKEN_WORDS.map((word, i) => (
                  <span
                    key={i}
                    style={{
                      flexGrow: wordWeight(word.text),
                      flexBasis: 0,
                      opacity: ramp(captions, i / SPOKEN_WORDS.length, (i + 1) / SPOKEN_WORDS.length),
                    }}
                    className={word.emphasis ? 'bg-[var(--caption)]' : 'bg-[var(--text-muted)]'}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* A1: voice */}
          <div className="flex items-center gap-2">
            <TrackLabel>A1</TrackLabel>
            <div className="flex-1 h-4 sm:h-6">
              <div className="h-full flex items-center gap-px overflow-hidden" style={{ width: `${clipWidth}%` }}>
                {WAVE_BARS.map((height, i) => (
                  <span key={i} className="flex-1 min-w-px bg-[var(--text-muted)]" style={{ height: `${height}%` }} />
                ))}
              </div>
            </div>
          </div>

          {/* FX: music and hits */}
          <div className="flex items-center gap-2">
            <TrackLabel>FX</TrackLabel>
            <div className="relative flex-1 h-3 sm:h-4">
              <div
                className="absolute inset-y-0 left-0 bg-[var(--accent-cyan)]/40"
                style={{ width: `${clipWidth * ramp(sound, 0, 0.6)}%` }}
              />
              {sfxMarkers.map((position, i) => (
                <span
                  key={position}
                  className="absolute top-1/2 w-2 h-2 -ml-1 -mt-1 rotate-45 bg-[var(--caption)] transition-transform duration-200"
                  style={{
                    left: `${(position / 100) * clipWidth}%`,
                    transform: `rotate(45deg) scale(${sound > 0.4 + i * 0.2 ? 1 : 0})`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
