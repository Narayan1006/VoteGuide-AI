// src/components/AccessibilityBar/AccessibilityBar.jsx
/**
 * @fileoverview WCAG 2.1 AA accessibility controls toolbar.
 * Provides font size adjustment (small/medium/large), high contrast toggle,
 * and a skip-to-main-content link. State managed via useAccessibility hook.
 */
import { useAccessibility } from '@hooks/useAccessibility';

/**
 * Sticky accessibility toolbar rendered above the navbar.
 * Provides keyboard-accessible controls for font size and contrast.
 *
 * @returns {JSX.Element}
 */
export default function AccessibilityBar() {
  const {
    fontSize,
    highContrast,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    toggleHighContrast,
  } = useAccessibility();

  return (
    <div
      role="toolbar"
      aria-label="Accessibility controls"
      className="bg-navy-900/95 backdrop-blur border-b border-white/10 py-1.5 px-4 flex items-center justify-between text-sm z-50 no-print"
    >
      {/* Skip link — visually hidden until focused */}
      <a
        href="#main-content"
        className="skip-link"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>

      <div className="flex items-center gap-1 ml-auto">
        <span className="text-navy-400 text-xs mr-2 hidden sm:block" aria-hidden="true">
          Accessibility:
        </span>

        {/* Font size controls */}
        <div className="flex items-center gap-0.5" role="group" aria-label="Font size controls">
          <button
            onClick={decreaseFontSize}
            disabled={fontSize === 'small'}
            className="w-7 h-7 flex items-center justify-center rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
            aria-label="Decrease font size"
            title="Decrease font size"
          >
            <span className="text-xs font-bold" aria-hidden="true">A-</span>
          </button>

          <button
            onClick={resetFontSize}
            className="w-7 h-7 flex items-center justify-center rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
            aria-label="Reset font size to medium"
            title="Reset font size"
          >
            <span className="text-sm font-bold" aria-hidden="true">A</span>
          </button>

          <button
            onClick={increaseFontSize}
            disabled={fontSize === 'large'}
            className="w-7 h-7 flex items-center justify-center rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
            aria-label="Increase font size"
            title="Increase font size"
          >
            <span className="text-base font-bold" aria-hidden="true">A+</span>
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-4 bg-white/20 mx-1" aria-hidden="true" />

        {/* High contrast toggle */}
        <button
          onClick={toggleHighContrast}
          className={`px-2.5 py-1 rounded text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 ${
            highContrast
              ? 'bg-yellow-400 text-black'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
          aria-pressed={highContrast}
          aria-label={highContrast ? 'Disable high contrast mode' : 'Enable high contrast mode'}
          title="Toggle high contrast"
        >
          <span aria-hidden="true">◐</span>
          <span className="ml-1 hidden sm:inline">Contrast</span>
        </button>
      </div>
    </div>
  );
}
