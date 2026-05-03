// src/__mocks__/firebaseConfig.js
// Mock Firebase for all tests

export const db   = {};
export const auth = {
  currentUser: null,
  onAuthStateChanged: jest.fn(),
};
export const analytics = null;
export default {};
