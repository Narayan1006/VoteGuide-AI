// src/components/ChatAssistant/TypingIndicator.jsx
export default function TypingIndicator() {
  return (
    <div
      className="flex items-start gap-2"
      role="status"
      aria-label="VoteGuide AI is typing"
      aria-live="polite"
    >
      <div
        className="w-7 h-7 rounded-full bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center text-xs flex-shrink-0"
        aria-hidden="true"
      >
        🗳️
      </div>
      <div className="bg-navy-700/80 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
        <span className="typing-dot" style={{ animationDelay: '0ms' }}    aria-hidden="true" />
        <span className="typing-dot" style={{ animationDelay: '200ms' }}  aria-hidden="true" />
        <span className="typing-dot" style={{ animationDelay: '400ms' }}  aria-hidden="true" />
        <span className="sr-only">VoteGuide AI is typing a response...</span>
      </div>
    </div>
  );
}
