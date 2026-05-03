// src/components/common/LoadingSkeleton.jsx

export function CardSkeleton({ lines = 3 }) {
  return (
    <div
      className="card p-6 animate-pulse"
      role="status"
      aria-label="Loading content"
      aria-busy="true"
    >
      <div className="h-5 bg-navy-600 rounded-lg w-3/4 mb-4" />
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 bg-navy-700 rounded w-full mb-2"
          style={{ width: `${100 - i * 15}%` }}
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div className="space-y-4 p-4" role="status" aria-label="Loading chat" aria-busy="true">
      {[70, 85, 60].map((w, i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
          <div
            className="h-10 bg-navy-700 rounded-2xl animate-pulse"
            style={{ width: `${w}%` }}
          />
        </div>
      ))}
      <span className="sr-only">Loading chat...</span>
    </div>
  );
}

export function QuizSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading quiz" aria-busy="true">
      <div className="h-6 bg-navy-600 rounded w-2/3 animate-pulse" />
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-14 bg-navy-700 rounded-xl animate-pulse" />
      ))}
      <span className="sr-only">Loading quiz...</span>
    </div>
  );
}

export default CardSkeleton;
