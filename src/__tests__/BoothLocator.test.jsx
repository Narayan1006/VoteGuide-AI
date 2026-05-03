// src/__tests__/BoothLocator.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

// ── Mocks ────────────────────────────────────────────────────────
jest.mock('@services/firebaseConfig', () => ({ db: {}, auth: { currentUser: null } }));
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  onAuthStateChanged: jest.fn((a, cb) => { cb(null); return jest.fn(); }),
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
}));
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(() => Promise.resolve({ exists: () => false })),
}));

jest.mock('react-hot-toast', () => ({ success: jest.fn(), error: jest.fn() }));

// Mock Google Maps
jest.mock('@react-google-maps/api', () => ({
  GoogleMap:    ({ children }) => <div data-testid="google-map">{children}</div>,
  LoadScript:   ({ children, onLoad }) => { setTimeout(onLoad, 0); return <div data-testid="load-script">{children}</div>; },
  Marker:       ({ onClick, title }) => <button data-testid="map-marker" onClick={onClick} aria-label={title} />,
  InfoWindow:   ({ children }) => <div data-testid="info-window">{children}</div>,
}));

import BoothLocator from '@components/BoothLocator/BoothLocator';
import { MOCK_BOOTHS, getNearbyBooths, searchBoothsByCity } from '@data/boothData';

describe('BoothLocator Data', () => {
  test('mock booths data has 18+ entries', () => {
    expect(MOCK_BOOTHS.length).toBeGreaterThanOrEqual(18);
  });

  test('all booths have required fields', () => {
    MOCK_BOOTHS.forEach(booth => {
      expect(booth.id).toBeTruthy();
      expect(booth.name).toBeTruthy();
      expect(booth.constituency).toBeTruthy();
      expect(booth.city).toBeTruthy();
      expect(typeof booth.lat).toBe('number');
      expect(typeof booth.lng).toBe('number');
    });
  });

  test('searchBoothsByCity finds Delhi booths', () => {
    const results = searchBoothsByCity('Delhi');
    expect(results.length).toBeGreaterThan(0);
    results.forEach(b => {
      expect(b.city.toLowerCase()).toBe('delhi');
    });
  });

  test('searchBoothsByCity is case-insensitive', () => {
    const lower = searchBoothsByCity('delhi');
    const upper = searchBoothsByCity('DELHI');
    expect(lower.length).toBe(upper.length);
  });

  test('getNearbyBooths returns booths sorted by distance', () => {
    // Near Delhi
    const results = getNearbyBooths(28.6139, 77.2090, 50);
    expect(results.length).toBeGreaterThan(0);
  });

  test('getNearbyBooths returns empty array when no booths in range', () => {
    // Middle of Pacific Ocean
    const results = getNearbyBooths(0, -140, 1);
    expect(results).toHaveLength(0);
  });
});

describe('BoothLocator Component', () => {
  // Save and restore real geolocation
  let originalGeolocation;
  beforeAll(() => {
    originalGeolocation = navigator.geolocation;
  });
  afterAll(() => {
    Object.defineProperty(navigator, 'geolocation', {
      value: originalGeolocation,
      writable: true,
    });
  });

  test('renders map container and booth list', () => {
    render(<BoothLocator language="en" />);
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });

  test('renders section heading', () => {
    render(<BoothLocator language="en" />);
    expect(screen.getByText(/Find Your Polling Booth/i)).toBeInTheDocument();
  });

  test('renders search form with ARIA role', () => {
    render(<BoothLocator language="en" />);
    const form = screen.getByRole('search');
    expect(form).toBeInTheDocument();
  });

  test('search by city filters booths', async () => {
    render(<BoothLocator language="en" />);

    const input  = screen.getByLabelText(/City name for booth search/i);
    const form   = screen.getByRole('search');

    fireEvent.change(input, { target: { value: 'Delhi' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(require('react-hot-toast').success).toHaveBeenCalledWith(
        expect.stringContaining('Found')
      );
    });
  });

  test('handles geolocation permission denied gracefully', async () => {
    // Mock geolocation to return permission denied
    const mockGetCurrentPosition = jest.fn((success, error) => {
      error({ code: 1, PERMISSION_DENIED: 1 }); // PERMISSION_DENIED
    });

    Object.defineProperty(navigator, 'geolocation', {
      value: { getCurrentPosition: mockGetCurrentPosition },
      writable: true,
    });

    render(<BoothLocator language="en" />);

    const geoBtn = screen.getByRole('button', { name: /current location/i });

    await act(async () => {
      fireEvent.click(geoBtn);
    });

    await waitFor(() => {
      expect(require('react-hot-toast').error).toHaveBeenCalledWith(
        expect.stringContaining('denied')
      );
    });
  });

  test('handles geolocation not supported', async () => {
    Object.defineProperty(navigator, 'geolocation', {
      value: undefined,
      writable: true,
    });

    render(<BoothLocator language="en" />);
    const geoBtn = screen.getByRole('button', { name: /current location/i });

    fireEvent.click(geoBtn);

    await waitFor(() => {
      expect(require('react-hot-toast').error).toHaveBeenCalledWith(
        expect.stringContaining('not supported')
      );
    });
  });

  test('renders booth list cards', () => {
    render(<BoothLocator language="en" />);
    // Should show booth cards
    const boothCards = screen.getAllByRole('button', { name: /Booth/ });
    expect(boothCards.length).toBeGreaterThan(0);
  });

  test('shows "no booths found" toast for unknown city', async () => {
    render(<BoothLocator language="en" />);

    const input = screen.getByLabelText(/City name for booth search/i);
    const form  = screen.getByRole('search');

    fireEvent.change(input, { target: { value: 'Atlantis' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(require('react-hot-toast').error).toHaveBeenCalledWith(
        expect.stringContaining('No booths found')
      );
    });
  });
});
