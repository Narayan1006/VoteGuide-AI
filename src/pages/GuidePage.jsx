// src/pages/GuidePage.jsx
import VoterGuide from '@components/VoterGuide/VoterGuide';
export default function GuidePage({ language }) {
  return (
    <main id="main-content" tabIndex={-1} className="focus:outline-none">
      <VoterGuide language={language} />
    </main>
  );
}
