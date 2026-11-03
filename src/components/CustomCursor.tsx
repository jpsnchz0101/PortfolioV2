import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';

/** A follower ring that names what you can do. Mouse only, and the normal cursor stays visible. */
export const CustomCursor: React.FC = () => {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [label, setLabel] = useState<string | null>(null);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 38, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 500, damping: 38, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;
    setEnabled(true);

    const handleMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = (e.target as Element | null)?.closest?.('[data-cursor]');
      setLabel(target?.getAttribute('data-cursor') ?? null);
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => window.removeEventListener('pointermove', handleMove);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      style={{ x: springX, y: springY }}
      className="fixed top-0 left-0 z-[60] pointer-events-none font-mono"
      aria-hidden="true"
    >
      <motion.div
        animate={{ scale: label ? 0.4 : 1 }}
        className="absolute -left-3 -top-3 w-6 h-6 rounded-full border border-[var(--accent-code)]"
      />
      <AnimatePresence>
        {label && (
          <motion.span
            initial={{ opacity: 0, x: 4 }}
            animate={{ opacity: 1, x: 14 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="absolute top-3 left-0 px-2 py-1 whitespace-nowrap text-[10px] font-semibold uppercase tracking-wider bg-[var(--accent-code)] text-[var(--accent-ink)]"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
