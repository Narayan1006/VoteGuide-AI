// src/components/ChatAssistant/ChatBubble.jsx
import { memo } from 'react';

// Simple markdown-to-text formatter for bold and bullets
function formatContent(text) {
  if (!text) return '';
  // Convert **bold** to <strong>
  const withBold = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Convert newlines to <br>
  return withBold.replace(/\n/g, '<br />');
}

const ChatBubble = memo(function ChatBubble({ message }) {
  const isUser = message.role === 'user';
  const isError = message.isError;

  return (
    <div
      className={`flex ${isUser ? 'justify-end message-user' : 'justify-start message-ai'}`}
      role="listitem"
    >
      {/* AI avatar */}
      {!isUser && (
        <div
          className="w-7 h-7 rounded-full bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center text-xs flex-shrink-0 mt-1 mr-2"
          aria-hidden="true"
        >
          🗳️
        </div>
      )}

      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-saffron-500 text-white rounded-br-sm'
            : isError
            ? 'bg-red-900/40 text-red-300 border border-red-700/50 rounded-bl-sm'
            : 'bg-navy-700/80 text-navy-100 rounded-bl-sm'
        }`}
        aria-label={`${isUser ? 'You' : 'VoteGuide AI'}: ${message.content}`}
      >
        {isUser ? (
          <span>{message.content}</span>
        ) : (
          <span
            dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
          />
        )}

        <time
          className="text-xs opacity-50 mt-1 block text-right"
          dateTime={message.timestamp}
          aria-label={`Sent at ${new Date(message.timestamp).toLocaleTimeString()}`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour:   '2-digit',
            minute: '2-digit',
          })}
        </time>
      </div>

      {/* User avatar */}
      {isUser && (
        <div
          className="w-7 h-7 rounded-full bg-navy-600 flex items-center justify-center text-xs flex-shrink-0 mt-1 ml-2"
          aria-hidden="true"
        >
          👤
        </div>
      )}
    </div>
  );
});

export default ChatBubble;
