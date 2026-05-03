// src/hooks/useAuth.js
/**
 * @fileoverview Custom React hook for Firebase Google Sign-In authentication.
 * Manages auth state, creates/updates user profiles in Firestore on login,
 * and exposes sign-in and sign-out actions.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@services/firebaseConfig';
import toast from 'react-hot-toast';

/** @type {GoogleAuthProvider} Configured Google OAuth provider */
const provider = new GoogleAuthProvider();
provider.addScope('profile');
provider.addScope('email');

/**
 * Custom hook for managing Google Sign-In authentication state.
 *
 * @returns {{
 *   user: import('firebase/auth').User|null,
 *   loading: boolean,
 *   error: string|null,
 *   signInWithGoogle: () => Promise<import('firebase/auth').User>,
 *   signOut: () => Promise<void>,
 *   isAuthenticated: boolean,
 * }}
 */
export function useAuth() {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  /**
   * Subscribe to Firebase auth state changes.
   * Creates or updates user profile document in Firestore on first sign-in.
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userRef  = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            // First sign-in — create user profile
            await setDoc(userRef, {
              uid:          firebaseUser.uid,
              displayName:  firebaseUser.displayName,
              email:        firebaseUser.email,
              photoURL:     firebaseUser.photoURL,
              createdAt:    serverTimestamp(),
              lastLogin:    serverTimestamp(),
              streak:       0,
              totalScore:   0,
              quizzesTaken: 0,
            });
          } else {
            // Returning user — update last login only
            await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
          }
        } catch {
          // Profile update failure is non-critical — user is still authenticated
        }
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Initiates Google Sign-In via popup and shows a welcome toast.
   *
   * @returns {Promise<import('firebase/auth').User>} The authenticated Firebase user.
   * @throws {Error} If sign-in is cancelled or fails.
   */
  const signInWithGoogle = useCallback(async () => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, provider);
      toast.success(`Welcome, ${result.user.displayName?.split(' ')[0] || 'Voter'}! 🗳️`);
      return result.user;
    } catch (err) {
      const errorMessage = err.code === 'auth/popup-closed-by-user'
        ? 'Sign-in cancelled'
        : err.code === 'auth/network-request-failed'
          ? 'Network error. Please check your connection.'
          : 'Sign-in failed. Please try again.';

      setError(errorMessage);
      toast.error('Sign-in failed');
      throw err;
    }
  }, []);

  /**
   * Signs out the current user from Firebase Authentication.
   *
   * @returns {Promise<void>}
   * @throws {Error} If sign-out fails.
   */
  const signOutUser = useCallback(async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully');
    } catch (err) {
      toast.error('Sign-out failed');
      throw err;
    }
  }, []);

  return {
    user,
    loading,
    error,
    signInWithGoogle,
    signOut: signOutUser,
    isAuthenticated: !!user,
  };
}

export default useAuth;
