// src/pages/LocatorPage.jsx
import BoothLocator from '@components/BoothLocator/BoothLocator';
export default function LocatorPage({ language }) {
  return (
    <main id="main-content" tabIndex={-1} className="focus:outline-none">
      <BoothLocator language={language} />
    </main>
  );
}
