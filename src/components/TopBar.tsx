import React from 'react';

interface TopBarProps {
  focusMode: boolean;
  onToggleFocusMode: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  focusMode,
  onToggleFocusMode,
}) => {
  return (
    <header className="no-print sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--canvas)]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="font-mono text-lg font-semibold tracking-[0.14em] text-[var(--ink)] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--cyan)]"
        >
          DORMANT<span className="text-[var(--amber)]">.</span>
        </a>

        {/* Zone 2: 4 concise single-line navigation links */}
        {!focusMode ? (
          <nav
            aria-label="முதன்மை வழிகாட்டி"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--muted)]"
          >
            <a
              href="#synopsis"
              className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[var(--ink)] hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--cyan)]"
            >
              கதைச்சுருக்கம்
            </a>
            <a
              href="#characters"
              className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[var(--ink)] hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--cyan)]"
            >
              கதாபாத்திரங்கள்
            </a>
            <a
              href="#timeline"
              className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[var(--ink)] hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--cyan)]"
            >
              நேரக்கோட்டு
            </a>
            <a
              href="#script"
              className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[var(--ink)] hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--cyan)]"
            >
              திரைக்கதை
            </a>
            <a
              href="#feedback"
              className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[var(--ink)] hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--cyan)]"
            >
              கருத்துகள்
            </a>
          </nav>
        ) : (
          <div className="hidden md:block text-sm text-[var(--muted)] whitespace-nowrap">
            கவன வாசிப்பு முறை
          </div>
        )}

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onToggleFocusMode}
            className="min-h-10 cursor-pointer rounded-md border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--ink)] whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-[var(--cyan)] hover:text-[var(--cyan)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cyan)]"
          >
            {focusMode ? 'ஆய்வுக் காட்சி' : 'கவன வாசிப்பு'}
          </button>
        </div>
      </div>
    </header>
  );
};
