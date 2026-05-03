// src/hooks/useFirestore.js
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

export function useFirestore(userId = null) {
  // ----------------------------------------------------------------
  // Save quiz score
  // ----------------------------------------------------------------
  const saveQuizScore = useCallback(async (score, totalQuestions, timeMs) => {
    if (!userId) return;

    try {
      // Save individual score
      const scoreRef = collection(db, 'quizScores', userId, 'scores');
      await addDoc(scoreRef, {
        score,
        totalQuestions,
        percentage:  Math.round((score / totalQuestions) * 100),
        timeMs,
        timestamp:   serverTimestamp(),
        date:        new Date().toDateString(),
      });

      // Update leaderboard
      const lbRef = doc(db, 'leaderboard', userId);
      const lbDoc = await getDoc(lbRef);

      if (!lbDoc.exists()) {
        const userRef  = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();

        await setDoc(lbRef, {
          userId,
          displayName:  userData?.displayName || 'Anonymous',
          photoURL:     userData?.photoURL    || null,
          highScore:    score,
          totalScore:   score,
          gamesPlayed:  1,
          lastPlayed:   serverTimestamp(),
        });
      } else {
        const existing = lbDoc.data();
        await updateDoc(lbRef, {
          highScore:   Math.max(existing.highScore || 0, score),
          totalScore:  (existing.totalScore || 0) + score,
          gamesPlayed: increment(1),
          lastPlayed:  serverTimestamp(),
        });
      }

      // Update user stats + streak
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        totalScore:   increment(score),
        quizzesTaken: increment(1),
        lastQuizDate: new Date().toDateString(),
      });

      return true;
    } catch (error) {
      console.error('Failed to save quiz score:', error);
      throw error;
    }
  }, [userId]);

  // ----------------------------------------------------------------
  // Get leaderboard (top 10)
  // ----------------------------------------------------------------
  const getLeaderboard = useCallback(async () => {
    try {
      const q   = query(
        collection(db, 'leaderboard'),
        orderBy('highScore', 'desc'),
        limit(10)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d, idx) => ({
        rank: idx + 1,
        ...d.data(),
      }));
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      return [];
    }
  }, []);

  // ----------------------------------------------------------------
  // Save conversation to Firestore
  // ----------------------------------------------------------------
  const saveConversation = useCallback(async (sessionId, messages) => {
    if (!userId || !sessionId) return;

    try {
      const convRef = doc(db, 'conversations', userId, 'sessions', sessionId);
      await setDoc(convRef, {
        sessionId,
        messages:  messages.map(m => ({
          id:        m.id,
          role:      m.role,
          content:   m.content,
          timestamp: m.timestamp,
        })),
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      console.error('Failed to save conversation:', error);
    }
  }, [userId]);

  // ----------------------------------------------------------------
  // Get user streak
  // ----------------------------------------------------------------
  const getUserStreak = useCallback(async () => {
    if (!userId) return 0;

    try {
      const userRef  = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return 0;

      const data         = userSnap.data();
      const lastQuizDate = data.lastQuizDate;
      const today        = new Date().toDateString();
      const yesterday    = new Date(Date.now() - 86400000).toDateString();

      if (lastQuizDate === today || lastQuizDate === yesterday) {
        return data.streak || 0;
      }

      // Streak broken — reset
      await updateDoc(userRef, { streak: 0 });
      return 0;
    } catch (error) {
      return 0;
    }
  }, [userId]);

  // ----------------------------------------------------------------
  // Update streak after completing quiz
  // ----------------------------------------------------------------
  const updateStreak = useCallback(async () => {
    if (!userId) return;

    try {
      const userRef  = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      const data     = userSnap.data() || {};
      const today    = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();

      if (data.lastQuizDate === today) {
        return data.streak || 1; // Already did quiz today
      }

      const newStreak = (data.lastQuizDate === yesterday)
        ? (data.streak || 0) + 1
        : 1;

      await updateDoc(userRef, {
        streak:      newStreak,
        lastQuizDate: today,
      });

      return newStreak;
    } catch (error) {
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
