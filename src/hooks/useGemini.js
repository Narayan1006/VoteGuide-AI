// src/hooks/useGemini.js
import { useState, useCallback, useRef } from 'react';
import { sendMessage as geminiSend }     from '@services/geminiService';
import { useFirestore }                  from './useFirestore';

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

export function useGemini(userId = null) {
  const [messages,   setMessages]   = useState(INITIAL_MESSAGES);
  const [isLoading,  setIsLoading]  = useState(false);
  const [error,      setError]      = useState(null);
  const [language,   setLanguage]   = useState('en'); // 'en' | 'hi'
  const sessionId                   = useRef(`session_${Date.now()}`);

  const { saveConversation } = useFirestore(userId);

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
        .slice(-10) // Keep last 10 messages for context
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

      // Save conversation to Firestore if user is authenticated
      if (userId) {
        saveConversation(sessionId.current, finalMessages).catch(console.error);
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

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  }, []);

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
