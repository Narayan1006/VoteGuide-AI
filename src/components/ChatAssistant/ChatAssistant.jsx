// src/components/ChatAssistant/ChatAssistant.jsx
/**
 * @fileoverview Floating AI chat widget powered by Gemini 1.5 Flash.
 * Supports bilingual (Hindi/English) conversations, suggested questions,
 * DOMPurify input sanitization, keyboard accessibility, and Firestore history.
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence }                  from 'framer-motion';
import { useGemini }                                from '@hooks/useGemini';
import { useAuth }                                  from '@hooks/useAuth';
import ChatBubble                                   from './ChatBubble';
import TypingIndicator                              from './TypingIndicator';
import LanguageToggle                               from './LanguageToggle';
import DOMPurify                                    from 'dompurify';

/**
 * Self-contained floating chat assistant widget.
 * Manages its own open/close state and delegates AI calls to useGemini.
 *
 * @returns {JSX.Element} Floating button + animated chat panel
 */
export default function ChatAssistant() {
  const [isOpen,      setIsOpen]      = useState(false);
  const [inputValue,  setInputValue]  = useState('');
  const messagesEndRef                = useRef(null);
  const inputRef                      = useRef(null);
  const { user }                      = useAuth();

  const {
    messages,
    isLoading,
    error,
    language,
    sendMessage,
    toggleLanguage,
    clearChat,
  } = useGemini(user?.uid);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSend = useCallback(async () => {
    const sanitized = DOMPurify.sanitize(inputValue.trim(), {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });
    if (!sanitized || isLoading) return;
    setInputValue('');
    await sendMessage(sanitized);
  }, [inputValue, isLoading, sendMessage]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = language === 'hi'
    ? ['मतदाता पंजीकरण कैसे करें?', 'EVM क्या है?', 'NOTA का क्या अर्थ है?', 'मतदान के दिन क्या करें?']
    : ['How do I register to vote?', 'What is EVM?', 'What is NOTA?', 'What to do on voting day?'];

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-saffron-500 to-saffron-600 text-white shadow-glow-saffron flex items-center justify-center text-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-saffron-400"
        aria-label={isOpen ? 'Close VoteGuide AI chat' : 'Open VoteGuide AI chat assistant'}
        aria-expanded={isOpen}
        aria-controls="chat-panel"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
      >
        {isOpen ? '✕' : '🗳️'}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chat-panel"
            role="dialog"
            aria-modal="true"
            aria-label="VoteGuide AI Chat Assistant"
            aria-describedby="chat-description"
            className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-md h-[70vh] max-h-[600px] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            style={{ background: 'rgba(15, 27, 45, 0.98)' }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-navy-800 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center text-sm" aria-hidden="true">
                  🗳️
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">VoteGuide AI</p>
                  <p className="text-emerald-400 text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" aria-hidden="true" />
                    Online
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <LanguageToggle language={language} onToggle={toggleLanguage} />
                <button
                  onClick={clearChat}
                  className="text-navy-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
                  aria-label="Clear chat history"
                  title="Clear chat"
                >
                  🗑️
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-navy-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
                  aria-label="Close chat"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Hidden description for screen readers */}
            <p id="chat-description" className="sr-only">
              VoteGuide AI chat assistant. Ask questions about Indian elections in Hindi or English. Use Enter to send messages.
            </p>

            {/* Messages area */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-3"
              role="log"
              aria-label="Chat messages"
              aria-live="polite"
              aria-atomic="false"
              aria-relevant="additions"
            >
              {messages.map(msg => (
                <ChatBubble key={msg.id} message={msg} />
              ))}

              {isLoading && <TypingIndicator />}

              {/* Error message */}
              {error && !isLoading && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="text-center text-red-400 text-xs bg-red-500/10 rounded-xl p-2"
                >
                  {error}
                </div>
              )}

              {/* Suggested questions (show only when few messages) */}
              {messages.length <= 1 && !isLoading && (
                <div className="space-y-2 pt-2">
                  <p className="text-navy-400 text-xs text-center">
                    {language === 'hi' ? 'सुझाए गए प्रश्न:' : 'Try asking:'}
                  </p>
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="w-full text-left text-xs px-3 py-2 rounded-xl bg-navy-700/60 hover:bg-saffron-500/20 text-navy-300 hover:text-saffron-300 border border-white/10 hover:border-saffron-500/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
                      aria-label={`Ask: ${q}`}
                    >
                      💬 {q}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} aria-hidden="true" />
            </div>

            {/* Input area */}
            <div className="px-3 py-3 border-t border-white/10 bg-navy-800/50">
              <div className="flex items-end gap-2">
                <label htmlFor="chat-input" className="sr-only">
                  {language === 'hi' ? 'अपना प्रश्न यहाँ लिखें' : 'Type your question here'}
                </label>
                <textarea
                  id="chat-input"
                  ref={inputRef}
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    language === 'hi'
                      ? 'अपना प्रश्न यहाँ लिखें... (Enter = भेजें)'
                      : 'Ask about elections... (Enter to send)'
                  }
                  className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-saffron-500 focus:ring-2 focus:ring-saffron-500/30 max-h-24"
                  rows={1}
                  disabled={isLoading}
                  aria-label={language === 'hi' ? 'चैट संदेश इनपुट' : 'Chat message input'}
                  aria-disabled={isLoading}
                  maxLength={2000}
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-400"
                  aria-label="Send message"
                >
                  {isLoading
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                    : <span aria-hidden="true">➤</span>
                  }
                </button>
              </div>
              <p className="text-navy-500 text-xs mt-1.5 text-center">
                {language === 'hi'
                  ? 'VoteGuide AI द्वारा संचालित · Gemini 1.5 Flash'
                  : 'Powered by Gemini 1.5 Flash · ECI Guidelines'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
