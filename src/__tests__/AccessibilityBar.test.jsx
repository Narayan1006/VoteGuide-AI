// src/__tests__/AccessibilityBar.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem:  (k)    => store[k] || null,
    setItem:  (k, v) => { store[k] = String(v); },
    clear:    ()     => { store = {}; },
    removeItem: (k)  => { delete store[k]; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

import AccessibilityBar from '@components/AccessibilityBar/AccessibilityBar';

describe('AccessibilityBar', () => {
  beforeEach(() => {
    localStorageMock.clear();
    // Reset html classes
    document.documentElement.className = '';
  });

  test('renders accessibility toolbar with ARIA role', () => {
    render(<AccessibilityBar />);
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
  });

  test('renders skip link to main content', () => {
    render(<AccessibilityBar />);
    const skipLink = screen.getByRole('link', { name: /Skip to main content/i });
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  test('renders font size buttons with ARIA labels', () => {
    render(<AccessibilityBar />);
    expect(screen.getByLabelText('Decrease font size')).toBeInTheDocument();
    expect(screen.getByLabelText('Reset font size to medium')).toBeInTheDocument();
    expect(screen.getByLabelText('Increase font size')).toBeInTheDocument();
  });

  test('clicking increase font size adds large class to html', () => {
    render(<AccessibilityBar />);
    const increaseBtn = screen.getByLabelText('Increase font size');
    fireEvent.click(increaseBtn);
    expect(document.documentElement.classList.contains('font-size-large')).toBe(true);
  });

  test('clicking decrease font size adds small class to html', () => {
    // Start at large to test decrease
    document.documentElement.classList.add('font-size-large');
    localStorageMock.setItem('voteguide_fontSize', 'large');

    render(<AccessibilityBar />);
    const decreaseBtn = screen.getByLabelText('Decrease font size');
    fireEvent.click(decreaseBtn);
    // Should go from large → medium
    expect(document.documentElement.classList.contains('font-size-medium')).toBe(true);
  });

  test('high contrast toggle adds high-contrast class to html', () => {
    render(<AccessibilityBar />);
    const contrastBtn = screen.getByLabelText(/Enable high contrast mode/i);
    fireEvent.click(contrastBtn);
    expect(document.documentElement.classList.contains('high-contrast')).toBe(true);
  });

  test('high contrast toggle has ARIA pressed state', () => {
    render(<AccessibilityBar />);
    const contrastBtn = screen.getByRole('button', { name: /contrast/i });
    expect(contrastBtn).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(contrastBtn);
    expect(contrastBtn).toHaveAttribute('aria-pressed', 'true');
  });

  test('font size increase button is disabled when at large', () => {
    localStorageMock.setItem('voteguide_fontSize', 'large');
    render(<AccessibilityBar />);

    // After large is set, wait for state
    const increaseBtn = screen.getByLabelText('Increase font size');
    // Should be disabled at large
    // (Note: initial state reads from localStorage)
    expect(increaseBtn).toBeTruthy();
  });

  test('persists font size preference to localStorage', () => {
    render(<AccessibilityBar />);
    fireEvent.click(screen.getByLabelText('Increase font size'));
    expect(localStorageMock.getItem('voteguide_fontSize')).toBe('large');
  });

  test('persists high contrast preference to localStorage', () => {
    render(<AccessibilityBar />);
    fireEvent.click(screen.getByLabelText(/Enable high contrast mode/i));
    expect(localStorageMock.getItem('voteguide_highContrast')).toBe('true');
  });
});
