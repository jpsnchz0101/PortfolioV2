import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { MusicProvider } from './context/MusicContext';
import { SignalField } from './components/SignalField';
import { CustomCursor } from './components/CustomCursor';
import { TimelineHud } from './components/TimelineHud';
import { EntryGate } from './components/EntryGate';
import { Navbar } from './components/Navbar';
import { WorkHero } from './components/WorkHero';
import { CutDemo } from './components/CutDemo';
import { KineticMarquee } from './components/KineticMarquee';
import { ServicesSection } from './components/ServicesSection';
import { ProcessSection } from './components/ProcessSection';
import { ToolkitSection } from './components/ToolkitSection';
import { AboutSection } from './components/AboutSection';
import { CtaSection } from './components/CtaSection';

export function AppContent() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] relative selection:bg-[var(--accent-code)] selection:text-[var(--accent-ink)]">
      <EntryGate />
      <SignalField />
      <div className="film-grain" aria-hidden="true" />
      <CustomCursor />

      <Navbar />

      <main>
        <WorkHero />
        <CutDemo />
        <KineticMarquee />
        <ServicesSection />
        <ProcessSection />
        <ToolkitSection />
        <AboutSection />
        <CtaSection />
      </main>

      <TimelineHud />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MusicProvider>
        <AppContent />
      </MusicProvider>
    </ThemeProvider>
  );
}
