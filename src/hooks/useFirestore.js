// src/hooks/useFirestore.js
/**
 * @fileoverview Custom React hook for all Firestore database operations.
 * Handles quiz score persistence, leaderboard queries,
 * conversation history saving, and user streak tracking.
 */

import { useCallback } from 'react';
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  updateDoc,
  increment,
} from 'firebase/firestore';
import { db } from '@services/firebaseConfig';

/**
 * Custom hook for Firestore CRUD operations.
 *
 * @param {string|null} userId - Authenticated Firebase UID, or null for unauthenticated users.
 * @returns {{
 *   saveQuizScore: (score: number, total: number, timeMs: number) => Promise<boolean>,
 *   getLeaderboard: () => Promise<Array<Object>>,
 *   saveConversation: (sessionId: string, messages: Array<Object>) => Promise<void>,
 *   getUserStreak: () => Promise<number>,
 *   updateStreak: () => Promise<number>,
 * }}
 */
export function useFirestore(userId = null) {

  /**
   * Saves a completed quiz score and updates the global leaderboard.
   *
   * @param {number} score - Number of correct answers.
   * @param {number} totalQuestions - Total number of questions attempted.
   * @param {number} timeMs - Time taken in milliseconds.
   * @returns {Promise<boolean>} True if saved successfully.
   * @throws {Error} If the Firestore write fails.
   */
  const saveQuizScore = useCallback(async (score, totalQuestions, timeMs) => {
    if (!userId) return false;

    try {
      // Save individual score entry
      const scoreRef = collection(db, 'quizScores', userId, 'scores');
      await addDoc(scoreRef, {
        score,
        totalQuestions,
        percentage:  Math.round((score / totalQuestions) * 100),
        timeMs,
        timestamp:   serverTimestamp(),
        date:        new Date().toDateString(),
      });

      // Update global leaderboard entry
      const lbRef = doc(db, 'leaderboard', userId);
      const lbDoc = await getDoc(lbRef);

      if (!lbDoc.exists()) {
        // First submission — create leaderboard entry from user profile
        const userRef  = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data() || {};

        await setDoc(lbRef, {
          userId,
          displayName:  userData.displayName || 'Anonymous',
          photoURL:     userData.photoURL    || null,
          highScore:    score,
          totalScore:   score,
          gamesPlayed:  1,
          lastPlayed:   serverTimestamp(),
        });
      } else {
        // Subsequent submission — update aggregate stats
        const existing = lbDoc.data();
        await updateDoc(lbRef, {
          highScore:   Math.max(existing.highScore || 0, score),
          totalScore:  (existing.totalScore || 0) + score,
          gamesPlayed: increment(1),
          lastPlayed:  serverTimestamp(),
        });
      }

      // Update user-level aggregate stats
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        totalScore:   increment(score),
        quizzesTaken: increment(1),
        lastQuizDate: new Date().toDateString(),
      });

      return true;
    } catch (error) {
      throw new Error(`Failed to save quiz score: ${error.message}`);
    }
  }, [userId]);

  /**
   * Fetches the top 10 players from the global leaderboard.
   *
   * @returns {Promise<Array<{rank: number, userId: string, displayName: string, highScore: number}>>}
   *   Sorted leaderboard entries with rank added, or empty array on failure.
   */
  const getLeaderboard = useCallback(async () => {
    try {
      const q = query(
        collection(db, 'leaderboard'),
        orderBy('highScore', 'desc'),
        limit(10)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d, idx) => ({
        rank: idx + 1,
        ...d.data(),
      }));
    } catch {
      return [];
    }
  }, []);

  /**
   * Persists the current chat session messages to Firestore.
   * Only executes if the user is authenticated.
   *
   * @param {string} sessionId - Unique session identifier.
   * @param {Array<{id: string, role: string, content: string, timestamp: string}>} messages
   *   Array of chat messages to persist.
   * @returns {Promise<void>}
   */
  const saveConversation = useCallback(async (sessionId, messages) => {
    if (!userId || !sessionId) return;

    try {
      const convRef = doc(db, 'conversations', userId, 'sessions', sessionId);
      await setDoc(convRef, {
        sessionId,
        messages: messages.map(m => ({
          id:        m.id,
          role:      m.role,
          content:   m.content,
          timestamp: m.timestamp,
        })),
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      }, { merge: true });
    } catch {
      // Conversation persistence is non-critical — fail silently
    }
  }, [userId]);

  /**
   * Returns the user's current daily quiz streak.
   * Resets to 0 if the streak was broken (last quiz > 1 day ago).
   *
   * @returns {Promise<number>} Current streak count, or 0 if unauthenticated.
   */
  const getUserStreak = useCallback(async () => {
    if (!userId) return 0;

    try {
      const userRef  = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return 0;

      const data         = userSnap.data();
      const lastQuizDate = data.lastQuizDate;
      const today        = new Date().toDateString();
      const yesterday    = new Date(Date.now() - 86_400_000).toDateString();

      if (lastQuizDate === today || lastQuizDate === yesterday) {
        return data.streak || 0;
      }

      // Streak is broken — reset to zero
      await updateDoc(userRef, { streak: 0 });
      return 0;
    } catch {
      return 0;
    }
  }, [userId]);

  /**
   * Increments the user's daily quiz streak after completing a quiz session.
   * Streak resets to 1 if broken; increments by 1 if on consecutive days.
   *
   * @returns {Promise<number>} Updated streak count.
   */
  const updateStreak = useCallback(async () => {
    if (!userId) return 0;

    try {
      const userRef   = doc(db, 'users', userId);
      const userSnap  = await getDoc(userRef);
      const data      = userSnap.data() || {};
      const today     = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86_400_000).toDateString();

      if (data.lastQuizDate === today) {
        return data.streak || 1; // Already completed quiz today
      }

      const newStreak = (data.lastQuizDate === yesterday)
        ? (data.streak || 0) + 1
        : 1; // Streak reset

      await updateDoc(userRef, {
        streak:       newStreak,
        lastQuizDate: today,
      });

      return newStreak;
    } catch {
      return 1;
    }
  }, [userId]);

  return {
    saveQuizScore,
    getLeaderboard,
    saveConversation,
    getUserStreak,
    updateStreak,
  };
}

export default useFirestore;
