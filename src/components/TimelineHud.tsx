import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { Pause, Play } from 'lucide-react';
import { SEQUENCES } from '../data/portfolioData';

const PAGE_SECONDS = 60; // The page plays as a 60-second edit
const FPS = 30;

function formatTimecode(progress: number): string {
  const totalFrames = Math.round(progress * PAGE_SECONDS * FPS);
  const totalSeconds = Math.floor(totalFrames / FPS);
  const pad = (value: number) => String(value).padStart(2, '0');
  return `00:${pad(Math.floor(totalSeconds / 60))}:${pad(totalSeconds % 60)}:${pad(totalFrames % FPS)}`;
}

const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;

/**
 * Fixed edit timeline: each section is a clip and the playhead follows the page.
 * Drag to scrub, press play to watch the page, or use the J / K / L shuttle keys.
 */
export const TimelineHud: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const playheadLeft = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const timecodeRef = useRef<HTMLSpanElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [clipStarts, setClipStarts] = useState<number[]>(SEQUENCES.map((_, i) => i / SEQUENCES.length));
  const [activeClip, setActiveClip] = useState<number>(0);
  const [rate, setRate] = useState<number>(0);

  // Size each clip by how much of the page its section takes up
  useEffect(() => {
    const measure = () => {
      const max = maxScroll();
      if (max <= 0) return;
      setClipStarts(
        SEQUENCES.map(({ id }) => {
          const el = document.getElementById(id);
          return el ? Math.min(1, (el.getBoundingClientRect().top + window.scrollY) / max) : 0;
        })
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (timecodeRef.current) timecodeRef.current.textContent = formatTimecode(value);
    let current = 0;
    clipStarts.forEach((start, i) => {
      if (value >= start - 0.001) current = i;
    });
    setActiveClip(current);
  });

  // Page playback
  useEffect(() => {
    if (rate === 0) return;

    let raf = 0;
    let position = window.scrollY;
    let last = performance.now();
    const pixelsPerSecond = maxScroll() / PAGE_SECONDS;

    const tick = (now: number) => {
      position += rate * pixelsPerSecond * (Math.max(0, now - last) / 1000);
      last = now;
      window.scrollTo({ top: position, behavior: 'instant' });
      if ((rate > 0 && position >= maxScroll()) || (rate < 0 && position <= 0)) {
        setRate(0);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Any manual scroll hands control back to the visitor
    const stop = () => setRate(0);
    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchstart', stop, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchstart', stop);
    };
  }, [rate]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key.toLowerCase();
      if (key === 'k') setRate(0);
      if (key === 'l') setRate((r) => (r <= 0 ? 1 : Math.min(4, r * 2)));
      if (key === 'j') setRate((r) => (r >= 0 ? -1 : Math.max(-4, r * 2)));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const seekToPointer = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    window.scrollTo({ top: progress * maxScroll(), behavior: 'instant' });
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setRate(0);
    e.currentTarget.setPointerCapture(e.pointerId);
    seekToPointer(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) seekToPointer(e.clientX);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = maxScroll() * 0.02;
    if (e.key === 'ArrowRight') window.scrollBy({ top: step, behavior: 'instant' });
    if (e.key === 'ArrowLeft') window.scrollBy({ top: -step, behavior: 'instant' });
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 h-12 sm:h-13 flex items-center gap-2 sm:gap-3 px-2 sm:px-4 font-mono border-t border-[var(--border-subtle)] bg-[var(--bg-primary)]/90 backdrop-blur-md">
      <button
        type="button"
        onClick={() => setRate((r) => (r === 0 ? 1 : 0))}
        aria-label={rate === 0 ? 'Play this page like a video' : 'Pause page playback'}
        data-cursor={rate === 0 ? 'Play the page' : 'Pause'}
        className="flex-none w-8 h-8 flex items-center justify-center bg-[var(--accent-code)] text-[var(--accent-ink)] hover:opacity-85 transition-opacity cursor-pointer"
      >
        {rate === 0 ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
      </button>

      <span
        ref={timecodeRef}
        className="flex-none text-[11px] sm:text-xs tabular-nums font-semibold text-[var(--text-primary)]"
        aria-hidden="true"
      >
        00:00:00:00
      </span>

      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label="Page timeline. Use the left and right arrow keys to move through the page."
        aria-valuemin={0}
        aria-valuemax={SEQUENCES.length}
        aria-valuenow={activeClip + 1}
        aria-valuetext={SEQUENCES[activeClip].label}
        data-cursor="Drag to scrub"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onKeyDown={handleKeyDown}
        className="relative flex-1 min-w-0 h-8 flex gap-px touch-none cursor-ew-resize select-none"
      >
        {SEQUENCES.map((sequence, i) => {
          const end = i < SEQUENCES.length - 1 ? clipStarts[i + 1] : 1;
          const isActive = i === activeClip;
          return (
            <div
              key={sequence.id}
              style={{ flexGrow: Math.max(0.01, end - clipStarts[i]), flexBasis: 0 }}
              className={`relative min-w-0 overflow-hidden border transition-colors ${
                isActive
                  ? 'border-[var(--accent-code)] text-[var(--accent-code)] bg-[var(--bg-tertiary)]'
                  : 'border-[var(--border-subtle)] text-[var(--text-muted)] bg-[var(--bg-secondary)]'
              }`}
            >
              <span className="clip-texture absolute inset-x-0 bottom-0 h-2 opacity-40" aria-hidden="true" />
              <span className="absolute top-0.5 left-1 text-[9px] sm:text-[10px] whitespace-nowrap">
                <span className="md:hidden">{i + 1}</span>
                <span className="hidden md:inline">{sequence.label}</span>
              </span>
            </div>
          );
        })}

        <motion.div
          style={{ left: playheadLeft }}
          className="absolute -top-1 -bottom-1 w-0.5 -translate-x-1/2 bg-[var(--cut)] pointer-events-none"
          aria-hidden="true"
        >
          <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[var(--cut)] [clip-path:polygon(0_0,100%_0,100%_60%,50%_100%,0_60%)]" />
        </motion.div>
      </div>

      <span className="hidden lg:flex flex-none items-center gap-1 text-[10px] text-[var(--text-muted)]" aria-hidden="true">
        {rate !== 0 && Math.abs(rate) !== 1 ? (
          <span className="text-[var(--accent-code)] font-semibold">{rate}x</span>
        ) : (
          <>
            <kbd className="px-1 border border-[var(--border-subtle)]">J</kbd>
            <kbd className="px-1 border border-[var(--border-subtle)]">K</kbd>
            <kbd className="px-1 border border-[var(--border-subtle)]">L</kbd>
          </>
        )}
      </span>
    </div>
  );
};
