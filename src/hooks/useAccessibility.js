// src/hooks/useAccessibility.js
import { useState, useEffect, useCallback } from 'react';

const FONT_SIZES = ['small', 'medium', 'large'];
const LS_FONT    = 'voteguide_fontSize';
const LS_CONTRAST = 'voteguide_highContrast';

export function useAccessibility() {
  const [fontSize,     setFontSize]     = useState(() => localStorage.getItem(LS_FONT)     || 'medium');
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem(LS_CONTRAST) === 'true');

  // Apply font size class to <html>
  useEffect(() => {
    const html = document.documentElement;
    FONT_SIZES.forEach(s => html.classList.remove(`font-size-${s}`));
    html.classList.add(`font-size-${fontSize}`);
    localStorage.setItem(LS_FONT, fontSize);
  }, [fontSize]);

  // Apply high contrast class to <html>
  useEffect(() => {
    const html = document.documentElement;
    if (highContrast) {
      html.classList.add('high-contrast');
    } else {
      html.classList.remove('high-contrast');
    }
    localStorage.setItem(LS_CONTRAST, String(highContrast));
  }, [highContrast]);

  const increaseFontSize = useCallback(() => {
    setFontSize(prev => {
      const idx = FONT_SIZES.indexOf(prev);
      return FONT_SIZES[Math.min(idx + 1, FONT_SIZES.length - 1)];
    });
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSize(prev => {
      const idx = FONT_SIZES.indexOf(prev);
      return FONT_SIZES[Math.max(idx - 1, 0)];
    });
  }, []);

  const resetFontSize = useCallback(() => {
    setFontSize('medium');
  }, []);

  const toggleHighContrast = useCallback(() => {
    setHighContrast(prev => !prev);
  }, []);

  return {
    fontSize,
    highContrast,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    toggleHighContrast,
    setFontSize,
  };
}

export default useAccessibility;
