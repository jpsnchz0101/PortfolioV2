import React from 'react';
import { motion } from 'motion/react';
import { TOOLKIT } from '../data/portfolioData';

const logoFiles: Record<string, string> = (import.meta as unknown as {
  glob: (pattern: string, options: { eager: boolean; query: string; import: string }) => Record<string, string>;
}).glob('../assets/tools/*.{svg,png}', { eager: true, query: '?url', import: 'default' });

const logoUrl = (file: string) => logoFiles[`../assets/tools/${file}`];

/** The tools as logo tiles, like apps on a dock. Names show on hover and to screen readers. */
export const ToolkitSection: React.FC = () => {
  return (
    <section id="kit" className="relative z-10 px-4 sm:px-8 py-16 sm:py-24 font-mono scroll-mt-14">
      <p className="text-[11px] text-[var(--text-secondary)] mb-2">
        <span className="text-[var(--accent-code)] font-bold">SEQ 05</span> / the kit
      </p>
      <h2
        style={{ fontVariationSettings: '"wdth" 88, "wght" 850' }}
        className="font-display text-[clamp(44px,8vw,112px)] text-[var(--text-primary)] mb-8 sm:mb-12"
      >
        The toolkit.
      </h2>

      <ul
        className="grid grid-cols-3 justify-items-center gap-4 w-fit mx-auto sm:mx-0 sm:flex sm:flex-wrap sm:gap-5 list-none"
        aria-label="Tools I use"
      >
        {TOOLKIT.map((tool, i) => (
          <motion.li
            key={tool.name}
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-8% 0px' }}
            transition={{ duration: 0.45, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <span
              title={tool.name}
              data-cursor={tool.name}
              className="flex items-center justify-center w-[76px] h-[76px] sm:w-24 sm:h-24 p-4 sm:p-5 rounded-2xl bg-white border border-[var(--border-subtle)] shadow-[0_6px_20px_rgba(0,0,0,0.18)] hover:-translate-y-1 hover:border-[var(--accent-code)] transition-[transform,border-color]"
            >
              <img
                src={logoUrl(tool.logo)}
                alt={tool.name}
                loading="lazy"
                className="w-full h-full object-contain rounded-xl"
              />
            </span>
          </motion.li>
        ))}
      </ul>
    </section>
  );
};
