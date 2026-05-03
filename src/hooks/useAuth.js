// src/hooks/useAuth.js
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

const provider = new GoogleAuthProvider();
provider.addScope('profile');
provider.addScope('email');

export function useAuth() {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Create/update user profile in Firestore
        try {
          const userRef  = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            await setDoc(userRef, {
              uid:         firebaseUser.uid,
              displayName: firebaseUser.displayName,
              email:       firebaseUser.email,
              photoURL:    firebaseUser.photoURL,
              createdAt:   serverTimestamp(),
              lastLogin:   serverTimestamp(),
              streak:      0,
              totalScore:  0,
              quizzesTaken: 0,
            });
          } else {
            await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
          }
        } catch (err) {
          console.error('Failed to update user profile:', err);
        }
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, provider);
      toast.success(`Welcome, ${result.user.displayName?.split(' ')[0] || 'Voter'}! 🗳️`);
      return result.user;
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error. Please check your connection.');
      } else {
        setError('Sign-in failed. Please try again.');
      }
      toast.error('Sign-in failed');
      throw err;
    }
  }, []);

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
