require('@testing-library/jest-dom');

// Mock Vite's import.meta.env for Jest
global.importMeta = { env: {} };
Object.defineProperty(global, 'import', {
  value: { meta: { env: { VITE_GOOGLE_MAPS_API_KEY: '', VITE_GEMINI_API_KEY: '' } } },
  writable: true,
  configurable: true,
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe()    { return null; }
  unobserve()  { return null; }
  disconnect() { return null; }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe()    { return null; }
  unobserve()  { return null; }
  disconnect() { return null; }
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media:   query,
    onchange: null,
    addListener:    jest.fn(),
    removeListener: jest.fn(),
    addEventListener:    jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition:      jest.fn(),
  clearWatch:         jest.fn(),
};
Object.defineProperty(navigator, 'geolocation', {
  value:    mockGeolocation,
  writable: true,
});

window.scrollTo = jest.fn();
