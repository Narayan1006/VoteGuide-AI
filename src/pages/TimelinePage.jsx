// src/pages/TimelinePage.jsx
import ElectionTimeline from '@components/ElectionTimeline/ElectionTimeline';
export default function TimelinePage({ language }) {
  return (
    <main id="main-content" tabIndex={-1} className="focus:outline-none">
      <ElectionTimeline language={language} />
    </main>
  );
}
