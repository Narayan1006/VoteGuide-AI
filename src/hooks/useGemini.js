// src/hooks/useGemini.js
/**
 * @fileoverview Custom React hook for managing Gemini AI chat state.
 * Handles message history, language toggling, error states,
 * and optional Firestore conversation persistence.
 */

import { useState, useCallback, useRef } from 'react';
import { sendMessage as geminiSend }     from '@services/geminiService';
import { useFirestore }                  from './useFirestore';

/** @type {import('../types').ChatMessage[]} */
const INITIAL_MESSAGES = [
  {
    id:        'welcome',
    role:      'assistant',
    content:   '🙏 नमस्ते! I\'m **VoteGuide**, your election education assistant.\n\n' +
               'I can help you with:\n' +
               '• 📝 Voter registration & Voter ID\n' +
               '• 🗳️ How to vote on election day\n' +
               '• ⚡ How EVM works\n' +
               '• 📋 Model Code of Conduct\n' +
               '• 🔢 NOTA — what is it?\n' +
               '• 📅 Election timeline & process\n\n' +
               'Ask me anything in **Hindi** या **English**! 🇮🇳',
    timestamp: new Date().toISOString(),
  },
];

/**
 * Custom hook for Gemini AI chat management.
 *
 * @param {string|null} userId - Authenticated Firebase user ID, or null for anonymous sessions.
 * @returns {{
 *   messages: import('../types').ChatMessage[],
 *   isLoading: boolean,
 *   error: string|null,
 *   language: 'en'|'hi',
 *   sendMessage: (input: string) => Promise<void>,
 *   toggleLanguage: () => void,
 *   clearChat: () => void,
 *   setLanguage: (lang: 'en'|'hi') => void,
 * }}
 */
export function useGemini(userId = null) {
  const [messages,   setMessages]   = useState(INITIAL_MESSAGES);
  const [isLoading,  setIsLoading]  = useState(false);
  const [error,      setError]      = useState(null);
  const [language,   setLanguage]   = useState('en'); // 'en' | 'hi'
  const sessionId                   = useRef(`session_${Date.now()}`);

  const { saveConversation } = useFirestore(userId);

  /**
   * Sends a user message to Gemini and appends the AI response.
   * Saves the updated conversation to Firestore if user is authenticated.
   *
   * @param {string} userInput - The user's message text.
   * @returns {Promise<import('../types').ChatMessage|undefined>} The AI response message.
   */
  const sendMessage = useCallback(async (userInput) => {
    if (!userInput?.trim() || isLoading) return;

    setError(null);

    const userMsg = {
      id:        `user_${Date.now()}`,
      role:      'user',
      content:   userInput.trim(),
      timestamp: new Date().toISOString(),
    };

    // Optimistically add user message
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Build history (exclude welcome message from history sent to API)
      const historyForAPI = updatedMessages
        .filter(m => m.id !== 'welcome')
        .slice(-10) // Keep last 10 messages for context window
        .map(m => ({ role: m.role, content: m.content }));

      const aiResponse = await geminiSend(historyForAPI, userInput, language);

      const aiMsg = {
        id:        `ai_${Date.now()}`,
        role:      'assistant',
        content:   aiResponse.content,
        timestamp: aiResponse.timestamp,
      };

      const finalMessages = [...updatedMessages, aiMsg];
      setMessages(finalMessages);

      // Persist conversation to Firestore if user is authenticated
      if (userId) {
        saveConversation(sessionId.current, finalMessages).catch(() => {
          // Silently fail — conversation persistence is non-critical
        });
      }

      return aiMsg;
    } catch (err) {
      const errorMsg = {
        id:        `error_${Date.now()}`,
        role:      'assistant',
        content:   language === 'hi'
          ? `❌ क्षमा करें, कुछ गलत हुआ: ${err.message}`
          : `❌ Sorry, something went wrong: ${err.message}`,
        isError:   true,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMsg]);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, language, userId, saveConversation]);

  /**
   * Toggles the response language between English and Hindi.
   */
  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  }, []);

  /**
   * Resets the conversation to the initial welcome message.
   */
  const clearChat = useCallback(() => {
    setMessages(INITIAL_MESSAGES);
    sessionId.current = `session_${Date.now()}`;
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    language,
    sendMessage,
    toggleLanguage,
    clearChat,
    setLanguage,
  };
}

export default useGemini;
