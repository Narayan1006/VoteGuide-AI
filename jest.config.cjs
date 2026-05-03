/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.cjs'],
  transform: {
    '^.+\\.[jt]sx?$': '<rootDir>/jest-transform.cjs',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg|webp)$': '<rootDir>/src/__mocks__/fileMock.js',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@hooks/(.*)$':      '<rootDir>/src/hooks/$1',
    '^@services/(.*)$':   '<rootDir>/src/services/$1',
    '^@pages/(.*)$':      '<rootDir>/src/pages/$1',
    '^@data/(.*)$':       '<rootDir>/src/data/$1',
    // Mock heavy Firebase/Google modules to avoid babel traversal issues
    '^firebase/(.*)$':              '<rootDir>/src/__mocks__/firebaseMock.cjs',
    '^@google/generative-ai$':      '<rootDir>/src/__mocks__/geminiMock.cjs',
    '^@react-google-maps/api$':     '<rootDir>/src/__mocks__/mapsMock.cjs',
    '^dompurify$':                  '<rootDir>/src/__mocks__/dompurifyMock.cjs',
    '^react-hot-toast$':            '<rootDir>/src/__mocks__/toastMock.cjs',
  },
  testMatch: [
    '<rootDir>/src/__tests__/**/*.{test,spec}.{js,jsx}',
  ],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/setupTests.*',
    '!src/__mocks__/**',
    '!**/node_modules/**',
  ],
  coverageReporters: ['text', 'lcov'],
  transformIgnorePatterns: [
    '/node_modules/(?!(framer-motion)/)',
  ],
  globals: {
    'import.meta': { env: { VITE_GOOGLE_MAPS_API_KEY: '', VITE_GEMINI_API_KEY: '', VITE_FIREBASE_API_KEY: '' } },
  },
};
