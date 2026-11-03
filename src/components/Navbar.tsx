import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { SoundToggle } from './SoundToggle';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 inset-x-0 z-40 font-mono pointer-events-none">
      <nav
        className="flex items-center justify-between gap-4 px-4 sm:px-8 py-3"
        aria-label="Main Navigation"
      >
        <a
          href="#work"
          className="pointer-events-auto flex items-center gap-2 px-2 py-1 bg-[var(--bg-primary)]/80 backdrop-blur-sm text-[var(--text-primary)]"
        >
          <span className="w-2 h-2 rounded-full bg-[var(--cut)] animate-pulse" aria-hidden="true" />
          <span className="font-semibold text-sm tracking-tight">jpsnchz</span>
        </a>

        <div className="pointer-events-auto flex items-center gap-2">
          <SoundToggle />
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="w-8 h-8 flex items-center justify-center border border-[var(--border-subtle)] bg-[var(--bg-primary)]/80 backdrop-blur-sm hover:border-[var(--accent-code)] text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>
          <a
            href="#contact"
            className="h-8 flex items-center px-3 bg-[var(--accent-code)] text-[var(--accent-ink)] text-xs font-semibold hover:opacity-85 transition-opacity whitespace-nowrap"
          >
            Work with me
          </a>
        </div>
      </nav>
    </header>
  );
};
