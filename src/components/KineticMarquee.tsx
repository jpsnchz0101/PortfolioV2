import React, { useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'motion/react';

const WORDS = ['Hook', 'Cut', 'Caption', 'Sound', 'Post', 'Repeat'];

/** Drifts on its own, speeds up and flips direction with the scroll, and skews with speed. */
export const KineticMarquee: React.FC = () => {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { stiffness: 120, damping: 40 });
  const skewX = useTransform(smooth, [-2500, 2500], [-14, 14], { clamp: true });
  const position = useMotionValue(0);
  const direction = useRef<number>(1);
  const x = useTransform(position, (value) => `${-(((value % 50) + 50) % 50)}%`);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    const v = smooth.get();
    if (v < -5) direction.current = -1;
    if (v > 5) direction.current = 1;
    position.set(position.get() + direction.current * (delta / 1000) * (1.6 + Math.min(10, Math.abs(v) / 240)));
  });

  const row = (
    <>
      {WORDS.map((word, i) => (
        <span key={word} className={`flex items-center gap-6 sm:gap-10 pr-6 sm:pr-10 ${i % 2 ? 'text-outline' : 'text-[var(--text-primary)]'}`}>
          {word}
          <span className="w-3 h-3 sm:w-5 sm:h-5 rotate-45 bg-[var(--accent-code)] flex-none" />
        </span>
      ))}
    </>
  );

  return (
    <div className="relative z-10 overflow-hidden py-8 sm:py-14 border-y border-[var(--border-subtle)] bg-[var(--bg-primary)]/70" aria-hidden="true">
      <motion.div
        style={{ x, skewX, fontVariationSettings: '"wdth" 96, "wght" 850' }}
        className="font-display flex w-max whitespace-nowrap text-[clamp(44px,10vw,132px)]"
      >
        <span className="flex w-1/2 justify-around">{row}</span>
        <span className="flex w-1/2 justify-around">{row}</span>
      </motion.div>
    </div>
  );
};
