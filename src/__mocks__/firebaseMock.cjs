// Firebase unified mock — handles all firebase/* imports
const mockServerTimestamp = () => new Date();
const mockIncrement = (n) => n;

const mockDoc = jest.fn(() => ({ id: 'mock-doc' }));
const mockCollection = jest.fn(() => ({ id: 'mock-col' }));
const mockGetDoc = jest.fn(() => Promise.resolve({
  exists: () => false,
  data:   () => ({ streak: 0, highScore: 0, totalScore: 0, gamesPlayed: 0, lastQuizDate: '' }),
}));
const mockSetDoc = jest.fn(() => Promise.resolve());
const mockUpdateDoc = jest.fn(() => Promise.resolve());
const mockAddDoc = jest.fn(() => Promise.resolve({ id: 'mock-id' }));
const mockGetDocs = jest.fn(() => Promise.resolve({ docs: [] }));
const mockQuery = jest.fn((ref) => ref);
const mockOrderBy = jest.fn();
const mockLimit = jest.fn();

// Auth mocks
class MockGoogleAuthProvider {
  constructor() {}
  addScope() { return this; }
}
MockGoogleAuthProvider.credential = jest.fn();

const mockOnAuthStateChanged = jest.fn((auth, cb) => {
  cb(null);
  return jest.fn();
});
const mockSignInWithPopup = jest.fn();
const mockSignOut = jest.fn(() => Promise.resolve());

// initializeApp
const mockInitializeApp = jest.fn(() => ({}));
const mockGetFirestore = jest.fn(() => ({}));
const mockGetAuth = jest.fn(() => ({ currentUser: null }));
const mockGetAnalytics = jest.fn();
const mockIsSupported = jest.fn(() => Promise.resolve(false));

module.exports = {
  // App
  initializeApp:         mockInitializeApp,
  // Firestore
  getFirestore:          mockGetFirestore,
  doc:                   mockDoc,
  collection:            mockCollection,
  getDoc:                mockGetDoc,
  setDoc:                mockSetDoc,
  updateDoc:             mockUpdateDoc,
  addDoc:                mockAddDoc,
  getDocs:               mockGetDocs,
  query:                 mockQuery,
  orderBy:               mockOrderBy,
  limit:                 mockLimit,
  serverTimestamp:       mockServerTimestamp,
  increment:             mockIncrement,
  runTransaction:        jest.fn((db, fn) => fn({ get: mockGetDoc, set: mockSetDoc })),
  // Auth
  getAuth:               mockGetAuth,
  onAuthStateChanged:    mockOnAuthStateChanged,
  signInWithPopup:       mockSignInWithPopup,
  signOut:               mockSignOut,
  GoogleAuthProvider:    MockGoogleAuthProvider,
  // Analytics
  getAnalytics:          mockGetAnalytics,
  isSupported:           mockIsSupported,
};
