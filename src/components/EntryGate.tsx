import React, { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

const CLOSE_MS = 750;

/**
 * Opening slate. Browsers only allow sound after a click, tap or key press,
 * so entering the portfolio is the moment the music starts.
 */
export const EntryGate: React.FC = () => {
  const { enter } = useMusic();
  const [phase, setPhase] = useState<'open' | 'closing' | 'done'>('open');

  useEffect(() => {
    if (phase !== 'open') return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = previous;
    };
  }, [phase]);

  const handleEnter = (withSound: boolean) => {
    if (phase !== 'open') return;
    enter(withSound);
    setPhase('closing');
    // A timer, not an animation callback, so the page can never get stuck behind the slate
    window.setTimeout(() => setPhase('done'), CLOSE_MS + 50);
  };

  if (phase === 'done') return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Enter John Paulo Sanchez's portfolio"
      onClick={() => handleEnter(true)}
      style={{
        clipPath: phase === 'open' ? 'circle(150% at 50% 50%)' : 'circle(0% at 50% 50%)',
        transition: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'none'
          : `clip-path ${CLOSE_MS}ms cubic-bezier(0.76, 0, 0.24, 1)`,
        pointerEvents: phase === 'open' ? 'auto' : 'none',
      }}
      className="fixed inset-0 z-[55] flex flex-col bg-[var(--bg-primary)] font-mono cursor-pointer"
    >
      {/* Clapper stripes */}
      <div
        className="h-5 sm:h-7 flex-none"
        style={{
          background:
            'repeating-linear-gradient(115deg, var(--accent-code) 0 34px, var(--bg-primary) 34px 68px)',
        }}
        aria-hidden="true"
      />

      <div className="flex items-center justify-between px-4 sm:px-8 py-3 text-[11px] text-[var(--text-muted)]" aria-hidden="true">
        <span>
          <span className="text-[var(--accent-code)] font-bold">SEQ 00</span> / slate
        </span>
        <span className="tabular-nums">00:00:00:00</span>
      </div>

      <div className="flex-1 min-h-0 flex flex-col items-center justify-center text-center px-4">
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-3 sm:mb-5">
          Short-form editor &amp; social media manager
        </p>
        <p
          style={{ fontVariationSettings: '"wdth" 92, "wght" 850' }}
          className="font-display text-[min(15vw,19vh)] text-[var(--text-primary)] mb-7 sm:mb-10"
        >
          John Paulo
          <br />
          <span className="text-[var(--accent-code)]">Sanchez</span>
        </p>

        <button
          type="button"
          autoFocus
          onClick={(e) => {
            e.stopPropagation();
            handleEnter(true);
          }}
          data-cursor="Music on"
          className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 sm:px-12 py-4 bg-[var(--accent-code)] text-[var(--accent-ink)] font-bold text-sm sm:text-base hover:opacity-85 transition-opacity cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" aria-hidden="true" />
          <span>Enter with sound</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleEnter(false);
          }}
          className="mt-4 text-xs text-[var(--text-secondary)] underline underline-offset-2 hover:text-[var(--text-primary)] transition-colors cursor-pointer"
        >
          Enter without sound
        </button>
      </div>
    </div>
  );
};
