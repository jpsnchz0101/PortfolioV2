import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { MusicStatus, useMusic } from '../context/MusicContext';

const BAR_BINS = [1, 3, 6, 11];

const LABELS: Record<MusicStatus, string> = {
  idle: 'Turn on sound',
  playing: 'Sound on',
  ducked: 'Sound on',
  off: 'Sound off',
};

const REST_HEIGHT: Record<MusicStatus, number> = {
  idle: 0.35,
  playing: 0.6,
  ducked: 0.15,
  off: 0.15,
};

/** Sound switch. The bars are a small live meter of the track while it plays. */
export const SoundToggle: React.FC = () => {
  const { status, toggle, getAnalyser } = useMusic();
  const reduced = useReducedMotion();
  const barsRef = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const setBars = (height: (i: number) => number) => {
      barsRef.current.forEach((bar, i) => {
        if (bar) bar.style.transform = `scaleY(${height(i)})`;
      });
    };

    const analyser = getAnalyser();
    if (status !== 'playing' || reduced || !analyser) {
      setBars(() => REST_HEIGHT[status]);
      return;
    }

    const data = new Uint8Array(analyser.frequencyBinCount);
    let raf = 0;
    const tick = () => {
      analyser.getByteFrequencyData(data);
      setBars((i) => 0.15 + 0.85 * (data[BAR_BINS[i]] / 255));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [status, reduced, getAnalyser]);

  const isOn = status === 'playing' || status === 'ducked';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isOn}
      aria-label={isOn ? 'Mute background music' : 'Play background music'}
      data-music-status={status}
      data-cursor={isOn ? 'Mute (M)' : 'Sound on (M)'}
      title="Music: Playboi Carti, Magnolia"
      className={`relative h-8 flex items-center gap-2 px-2 border bg-[var(--bg-primary)]/90 text-[11px] font-mono transition-colors cursor-pointer ${
        status === 'idle'
          ? 'border-[var(--accent-code)] text-[var(--text-primary)]'
          : 'border-[var(--border-subtle)] hover:border-[var(--accent-code)] text-[var(--text-secondary)]'
      }`}
    >
      {status === 'idle' && (
        <span className="absolute -top-1 -right-1 w-2 h-2" aria-hidden="true">
          <span className="absolute inset-0 rounded-full bg-[var(--accent-code)] motion-safe:animate-ping" />
          <span className="absolute inset-0 rounded-full bg-[var(--accent-code)]" />
        </span>
      )}
      <span className="flex items-center gap-[2px] h-3.5 w-[18px]" aria-hidden="true">
        {BAR_BINS.map((bin, i) => (
          <span
            key={bin}
            ref={(el) => {
              barsRef.current[i] = el;
            }}
            className={`flex-1 h-full origin-center transition-colors ${isOn || status === 'idle' ? 'bg-[var(--accent-code)]' : 'bg-[var(--text-muted)]'}`}
          />
        ))}
      </span>
      <span className="hidden sm:inline whitespace-nowrap">{LABELS[status]}</span>
    </button>
  );
};
