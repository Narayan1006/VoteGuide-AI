// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar           from '@components/common/Navbar';
import AccessibilityBar from '@components/AccessibilityBar/AccessibilityBar';
import ChatAssistant    from '@components/ChatAssistant/ChatAssistant';
import ErrorBoundary    from '@components/common/ErrorBoundary';

import Home             from '@pages/Home';
import GuidePage        from '@pages/GuidePage';
import TimelinePage     from '@pages/TimelinePage';
import LocatorPage      from '@pages/LocatorPage';
import QuizPage         from '@pages/QuizPage';

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
      html.classList.remove('light');
    } else {
      html.classList.remove('dark');
      html.classList.add('light');
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <div className={`min-h-screen ${darkMode ? 'bg-navy-950' : 'bg-slate-100'} transition-colors duration-300`}>
          {/* Accessibility bar at very top */}
          <AccessibilityBar />

          {/* Navigation */}
          <Navbar
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode(d => !d)}
          />

          {/* Page content */}
          <ErrorBoundary>
            <Routes>
              <Route path="/"         element={<Home />} />
              <Route path="/guide"    element={<GuidePage    language={language} />} />
              <Route path="/timeline" element={<TimelinePage language={language} />} />
              <Route path="/locator"  element={<LocatorPage  language={language} />} />
              <Route path="/quiz"     element={<QuizPage     language={language} />} />
              <Route path="*"         element={<NotFound />} />
            </Routes>
          </ErrorBoundary>

          {/* Floating AI Chat Assistant */}
          <ChatAssistant />

          {/* Toast notifications */}
          <Toaster
            position="bottom-left"
            toastOptions={{
              style: {
                background: '#162d5c',
                color: '#f8fafc',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
              },
              success: { iconTheme: { primary: '#FF6B00', secondary: '#fff' } },
              error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <main id="main-content" className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="text-8xl mb-6" aria-hidden="true">🗳️</div>
      <h1 className="text-4xl font-black text-white mb-4">404 — Page Not Found</h1>
      <p className="text-navy-300 mb-8">This page doesn't exist. Let's get you back on track.</p>
      <a href="/" className="btn-primary">🏠 Go Home</a>
    </main>
  );
}
