import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const base = import.meta.env.BASE_URL || '/';
const cleanBase = base.endsWith('/') ? base : `${base}/`;
const MUSIC_SRC = `${cleanBase}audio/background.mp3`;
const STORAGE_KEY = 'jps_portfolio_music';

const VOLUME = 0.22; // The master is very loud, so this keeps it behind the page
const FADE_IN_SECONDS = 1.8;
const START_FADE_SECONDS = 0.05; // The track opens on a spoken line, so don't fade over it
const FADE_OUT_SECONDS = 0.7;
const OPEN_FREQUENCY = 20000;
// In-app browsers on phones can report no focus forever, so phones rely on visibility alone
const IS_TOUCH = window.matchMedia('(pointer: coarse)').matches;
const pageHasFocus = () => IS_TOUCH || document.hasFocus();
const MUFFLED_FREQUENCY = 500;

export type MusicStatus = 'idle' | 'playing' | 'ducked' | 'off';

interface MusicEngine {
  context: AudioContext;
  gain: GainNode;
  filter: BiquadFilterNode;
  analyser: AnalyserNode;
}

interface MusicContextType {
  status: MusicStatus;
  toggle: () => void;
  enter: (withSound: boolean) => void;
  getAnalyser: () => AnalyserNode | null;
  duck: () => () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

function rampTo(param: AudioParam, target: number, seconds: number, now: number) {
  param.cancelScheduledValues(now);
  param.setValueAtTime(param.value, now);
  param.linearRampToValueAtTime(target, now + seconds);
}

/**
 * Background music. Browsers only allow audio after a click, tap or key press,
 * so it starts on the first one. Uses Web Audio because iOS ignores audio.volume.
 */
export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const engineRef = useRef<MusicEngine | null>(null);
  const pauseTimerRef = useRef<number | undefined>(undefined);
  const duckCountRef = useRef<number>(0);
  const unlockedRef = useRef<boolean>(false);
  const enabledRef = useRef<boolean>(localStorage.getItem(STORAGE_KEY) !== 'off');
  const [status, setStatus] = useState<MusicStatus>(enabledRef.current ? 'idle' : 'off');

  const sync = useCallback(() => {
    const engine = engineRef.current;
    const audio = audioRef.current;
    window.clearTimeout(pauseTimerRef.current);

    if (!enabledRef.current) setStatus('off');
    if (!engine || !audio) return;

    const now = engine.context.currentTime;
    const audible = enabledRef.current && duckCountRef.current === 0 && !document.hidden && pageHasFocus();

    if (audible) {
      engine.context.resume();
      audio
        .play()
        .then(() => {
          unlockedRef.current = true;
        })
        .catch(() => {
          // Picked up again by the next click or key press
        });
      const fadeIn = audio.currentTime < 0.5 ? START_FADE_SECONDS : FADE_IN_SECONDS;
      rampTo(engine.gain.gain, VOLUME, fadeIn, now);
      rampTo(engine.filter.frequency, OPEN_FREQUENCY, fadeIn, now);
      setStatus('playing');
    } else {
      rampTo(engine.gain.gain, 0, FADE_OUT_SECONDS, now);
      rampTo(engine.filter.frequency, MUFFLED_FREQUENCY, FADE_OUT_SECONDS, now);
      pauseTimerRef.current = window.setTimeout(() => audio.pause(), FADE_OUT_SECONDS * 1000 + 80);
      if (enabledRef.current) setStatus('ducked');
    }
  }, []);

  const start = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!engineRef.current) {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const context = new AudioContextClass();
      const source = context.createMediaElementSource(audio);
      const filter = context.createBiquadFilter();
      const analyser = context.createAnalyser();
      const gain = context.createGain();
      filter.type = 'lowpass';
      filter.frequency.value = OPEN_FREQUENCY;
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.75;
      gain.gain.value = 0;
      source.connect(filter);
      filter.connect(analyser);
      analyser.connect(gain);
      gain.connect(context.destination);
      engineRef.current = { context, gain, filter, analyser };
    }

    // Must happen inside the click itself, even if a video is about to duck it
    engineRef.current.context.resume();
    audio
      .play()
      .then(() => {
        unlockedRef.current = true;
      })
      .catch(() => {
        if (!unlockedRef.current && duckCountRef.current === 0) setStatus(enabledRef.current ? 'idle' : 'off');
      });
    sync();
  }, [sync]);

  const toggle = useCallback(() => {
    // Before the first start, the button is an "on" switch rather than a mute
    if (enabledRef.current && !unlockedRef.current && audioRef.current?.paused) {
      start();
      return;
    }
    enabledRef.current = !enabledRef.current;
    localStorage.setItem(STORAGE_KEY, enabledRef.current ? 'on' : 'off');
    if (enabledRef.current) start();
    else sync();
  }, [start, sync]);

  // The choice made on the entry screen, which also counts as the first click
  const enter = useCallback(
    (withSound: boolean) => {
      enabledRef.current = withSound;
      localStorage.setItem(STORAGE_KEY, withSound ? 'on' : 'off');
      if (withSound) start();
      else sync();
    },
    [start, sync]
  );

  const duck = useCallback(() => {
    duckCountRef.current += 1;
    sync();
    return () => {
      duckCountRef.current -= 1;
      sync();
    };
  }, [sync]);

  const getAnalyser = useCallback(() => engineRef.current?.analyser ?? null, []);

  // First click, tap or key press starts the music
  useEffect(() => {
    const handleGesture = () => {
      if (enabledRef.current && !unlockedRef.current) start();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'm' && !e.metaKey && !e.ctrlKey && !e.altKey) toggle();
      else handleGesture();
    };

    // Stop when the visitor moves to another app or window. Embedded views can be
    // hidden without any visibility or blur event, so this also polls.
    let wasFocused = pageHasFocus();
    const checkFocus = () => {
      const focused = pageHasFocus();
      if (focused !== wasFocused) {
        wasFocused = focused;
        sync();
      }
    };
    const focusPoll = window.setInterval(checkFocus, 500);

    window.addEventListener('click', handleGesture);
    window.addEventListener('touchend', handleGesture);
    window.addEventListener('keydown', handleKey);
    window.addEventListener('blur', checkFocus);
    window.addEventListener('focus', checkFocus);
    document.addEventListener('visibilitychange', sync);
    return () => {
      window.clearInterval(focusPoll);
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('touchend', handleGesture);
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('blur', checkFocus);
      window.removeEventListener('focus', checkFocus);
      document.removeEventListener('visibilitychange', sync);
    };
  }, [start, sync, toggle]);

  const value = useMemo(() => ({ status, toggle, enter, getAnalyser, duck }), [status, toggle, enter, getAnalyser, duck]);

  return (
    <MusicContext.Provider value={value}>
      {children}
      <audio ref={audioRef} src={MUSIC_SRC} preload="none" loop />
    </MusicContext.Provider>
  );
};

export function useMusic(): MusicContextType {
  const context = useContext(MusicContext);
  if (!context) throw new Error('useMusic must be used within MusicProvider');
  return context;
}
