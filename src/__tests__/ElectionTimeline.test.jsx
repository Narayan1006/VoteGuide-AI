// src/__tests__/ElectionTimeline.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ── Mocks ────────────────────────────────────────────────────────
jest.mock('@services/firebaseConfig', () => ({ db: {}, auth: { currentUser: null } }));
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  onAuthStateChanged: jest.fn((auth, cb) => { cb(null); return jest.fn(); }),
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
}));
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(() => Promise.resolve({ exists: () => false })),
  setDoc: jest.fn(() => Promise.resolve()),
  serverTimestamp: jest.fn(),
}));

jest.mock('@services/geminiService', () => ({
  explainTimelineStage: jest.fn(() => Promise.resolve('AI explanation for this stage.')),
  sendMessage:   jest.fn(),
  rateLimiter:   { canMakeRequest: jest.fn(() => true) },
}));

jest.mock('framer-motion', () => ({
  motion: {
    div:    ({ children, ...p }) => <div {...p}>{children}</div>,
    button: ({ children, ...p }) => <button {...p}>{children}</button>,
    article: ({ children, ...p }) => <article {...p}>{children}</article>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// ── Imports ───────────────────────────────────────────────────────
import ElectionTimeline from '@components/ElectionTimeline/ElectionTimeline';
import { ELECTION_STAGES } from '@data/timelineData';

describe('ElectionTimeline', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Test 1: Renders all 6 stages ─────────────────────────────
  test('renders all 6 election stages', () => {
    render(<ElectionTimeline language="en" />);

    ELECTION_STAGES.forEach(stage => {
      expect(screen.getAllByText(stage.title).length).toBeGreaterThan(0);
    });
  });

  // ── Test 2: Renders timeline heading ─────────────────────────
  test('renders the timeline section heading', () => {
    render(<ElectionTimeline language="en" />);
    expect(screen.getByRole('heading', { name: /Election Process Timeline/i })).toBeInTheDocument();
  });

  // ── Test 3: Renders progress bar with ARIA ───────────────────
  test('renders progress bar with correct ARIA attributes', () => {
    render(<ElectionTimeline language="en" />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuemin', '1');
    expect(progressBar).toHaveAttribute('aria-valuemax', '6');
  });

  // ── Test 4: Clicking a stage opens modal ─────────────────────
  test('clicking a stage button opens the detail modal', async () => {
    const { explainTimelineStage } = require('@services/geminiService');
    explainTimelineStage.mockResolvedValueOnce('Detailed AI explanation here.');

    render(<ElectionTimeline language="en" />);

    // Click the first stage button
    const stageButtons = screen.getAllByRole('button', { name: /Stage/ });
    expect(stageButtons.length).toBeGreaterThan(0);

    await act(async () => {
      fireEvent.click(stageButtons[0]);
    });

    // Modal should appear
    await waitFor(() => {
      // Modal should be open - check for the dialog
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // The heading in the dialog should show the stage title
    expect(screen.getAllByText(/Election Announcement/i).length).toBeGreaterThan(0);
  });

  // ── Test 5: Modal closes when close button is clicked ────────
  test('modal closes when close button is clicked', async () => {
    const { explainTimelineStage } = require('@services/geminiService');
    explainTimelineStage.mockResolvedValueOnce('Some explanation.');

    render(<ElectionTimeline language="en" />);

    const stageButtons = screen.getAllByRole('button', { name: /Stage/ });
    await act(async () => {
      fireEvent.click(stageButtons[0]);
    });

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Click close button
    const closeBtn = screen.getByLabelText('Close modal');
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  // ── Test 6: Modal closes on Escape key ───────────────────────
  test('modal closes on Escape key press', async () => {
    const { explainTimelineStage } = require('@services/geminiService');
    explainTimelineStage.mockResolvedValueOnce('Some explanation.');

    render(<ElectionTimeline language="en" />);

    const stageButtons = screen.getAllByRole('button', { name: /Stage/ });
    await act(async () => {
      fireEvent.click(stageButtons[0]);
    });

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Press Escape
    await act(async () => {
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    });

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  // ── Test 7: Modal shows AI explanation loading state ─────────
  test('modal shows loading skeleton while AI explanation loads', async () => {
    let resolve;
    const { explainTimelineStage } = require('@services/geminiService');
    explainTimelineStage.mockReturnValueOnce(new Promise(r => { resolve = r; }));

    render(<ElectionTimeline language="en" />);

    const stageButtons = screen.getAllByRole('button', { name: /Stage/ });
    act(() => { fireEvent.click(stageButtons[0]); });

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Loading skeleton should be visible
    const loadingEl = screen.getByRole('status', { name: /Loading AI explanation/i });
    expect(loadingEl).toBeInTheDocument();

    // Resolve the promise
    resolve('AI explanation loaded!');
  });

  // ── Test 8: Hindi language mode ──────────────────────────────
  test('renders Hindi labels when language is set to hi', () => {
    render(<ElectionTimeline language="hi" />);
    expect(screen.getByText(/चुनाव प्रक्रिया/i)).toBeInTheDocument();
  });
});
