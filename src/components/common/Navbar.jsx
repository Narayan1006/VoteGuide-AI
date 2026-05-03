// src/components/common/Navbar.jsx
/**
 * @fileoverview Sticky navigation bar with Google Sign-In, dark mode toggle,
 * mobile hamburger menu, and route-aware active link highlighting.
 */
import { useState }       from 'react';
import PropTypes           from 'prop-types';
import { NavLink, Link }  from 'react-router-dom';
import { useAuth }        from '@hooks/useAuth';

const NAV_LINKS = [
  { to: '/',          label: 'Home',     icon: '🏠' },
  { to: '/guide',     label: 'Voter Guide', icon: '📖' },
  { to: '/timeline',  label: 'Timeline', icon: '📅' },
  { to: '/locator',   label: 'Find Booth', icon: '📍' },
  { to: '/quiz',      label: 'Quiz',     icon: '🧠' },
];

function Navbar({ darkMode, onToggleDarkMode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signInWithGoogle, signOut, loading } = useAuth();

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? 'bg-saffron-500/20 text-saffron-400'
        : 'text-navy-300 hover:text-white hover:bg-white/10'
    }`;

  return (
    <nav
      className="sticky top-0 z-40 bg-navy-900/95 backdrop-blur-xl border-b border-white/10"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 rounded-lg"
            aria-label="VoteGuide AI Home"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center text-white font-bold text-lg shadow-glow-saffron">
              🗳️
            </div>
            <div>
              <span className="font-bold text-white text-lg leading-tight">VoteGuide</span>
              <span className="font-bold text-saffron-400 text-lg"> AI</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1" role="menubar" aria-label="Site navigation">
            {NAV_LINKS.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={navLinkClass}
                role="menuitem"
                aria-label={link.label}
              >
                <span aria-hidden="true">{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              onClick={onToggleDarkMode}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-pressed={darkMode}
            >
              <span aria-hidden="true">{darkMode ? '☀️' : '🌙'}</span>
            </button>

            {/* Auth button */}
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-navy-700 animate-pulse" aria-label="Loading user" />
            ) : user ? (
              <div className="flex items-center gap-2">
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt={`${user.displayName}'s profile`}
                    className="w-8 h-8 rounded-full border-2 border-saffron-500"
                    referrerPolicy="no-referrer"
                  />
                )}
                <button
                  onClick={signOut}
                  className="hidden sm:block text-xs text-navy-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
                  aria-label="Sign out"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="btn-primary py-1.5 px-4 text-sm"
                aria-label="Sign in with Google"
              >
                <span aria-hidden="true">🔑</span>
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span aria-hidden="true">{menuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden py-3 border-t border-white/10 animate-fade-in"
            role="menu"
            aria-label="Mobile navigation"
          >
            {NAV_LINKS.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-1 ${
                    isActive
                      ? 'bg-saffron-500/20 text-saffron-400'
                      : 'text-navy-300 hover:text-white hover:bg-white/10'
                  }`
                }
                role="menuitem"
                onClick={() => setMenuOpen(false)}
              >
                <span aria-hidden="true">{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  /** Whether dark mode is currently active */
  darkMode:        PropTypes.bool.isRequired,
  /** Callback to toggle between dark and light mode */
  onToggleDarkMode: PropTypes.func.isRequired,
};

export default Navbar;
