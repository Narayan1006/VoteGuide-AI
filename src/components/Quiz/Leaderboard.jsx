// src/components/Quiz/Leaderboard.jsx
/**
 * @fileoverview Firestore-backed top-10 quiz leaderboard.
 * Fetches entries on mount, highlights the current user's entry,
 * and renders medal icons for the top 3 positions.
 */
import { useState, useEffect } from 'react';
import PropTypes               from 'prop-types';
import { useFirestore }        from '@hooks/useFirestore';

const MEDALS = ['🥇', '🥈', '🥉'];

/**
 * Displays the top 10 quiz leaderboard fetched from Firestore.
 * Highlights the current user's row and shows medal emojis for positions 1–3.
 *
 * @param {Object}       props
 * @param {'en'|'hi'}  [props.language='en']    - Display language for labels.
 * @param {string|null} [props.currentUserId]    - UID of the authenticated user (for highlighting).
 * @returns {JSX.Element}
 */
export default function Leaderboard({ language = 'en', currentUserId }) {
  const [entries,  setEntries]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const { getLeaderboard }      = useFirestore(currentUserId);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getLeaderboard()
      .then(data => { if (!cancelled) { setEntries(data); setLoading(false); } })
      .catch(err  => { if (!cancelled) { setError(err.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [getLeaderboard]);

  const t = (en, hi) => language === 'hi' ? hi : en;

  return (
    <div className="card p-6" role="region" aria-labelledby="leaderboard-heading">
      <h3 id="leaderboard-heading" className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        🏆 {t('Top 10 Leaderboard', 'शीर्ष 10 लीडरबोर्ड')}
      </h3>

      {loading ? (
        <div className="space-y-3" role="status" aria-label={t('Loading leaderboard', 'लीडरबोर्ड लोड हो रहा है')} aria-busy="true">
          {[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-navy-700 rounded-xl animate-pulse" />)}
          <span className="sr-only">{t('Loading...', 'लोड हो रहा है...')}</span>
        </div>
      ) : error ? (
        <p className="text-red-400 text-sm" role="alert">{t('Failed to load leaderboard.', 'लीडरबोर्ड लोड नहीं हो सका।')}</p>
      ) : entries.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-5xl mb-3" aria-hidden="true">🎯</p>
          <p className="text-navy-300">{t('No scores yet! Be the first to play.', 'अभी कोई स्कोर नहीं! पहले खेलें।')}</p>
        </div>
      ) : (
        <ol className="space-y-3" aria-label={t('Leaderboard entries', 'लीडरबोर्ड प्रविष्टियाँ')}>
          {entries.map((entry, i) => (
            <li
              key={entry.userId}
              className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${
                entry.userId === currentUserId
                  ? 'border-saffron-500 bg-saffron-500/10'
                  : 'border-white/10 bg-navy-800/40'
              }`}
              aria-label={`Rank ${i + 1}: ${entry.displayName}, high score ${entry.highScore}`}
            >
              <span className="text-2xl w-8 text-center flex-shrink-0" aria-hidden="true">
                {i < 3 ? MEDALS[i] : `${i + 1}.`}
              </span>
              {entry.photoURL ? (
                <img src={entry.photoURL} alt="" className="w-8 h-8 rounded-full flex-shrink-0" referrerPolicy="no-referrer" aria-hidden="true" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-navy-600 flex items-center justify-center text-xs flex-shrink-0" aria-hidden="true">
                  {entry.displayName?.charAt(0) || '?'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm truncate ${entry.userId === currentUserId ? 'text-saffron-300' : 'text-white'}`}>
                  {entry.displayName || 'Anonymous'}
                  {entry.userId === currentUserId && <span className="ml-2 text-xs text-saffron-500">(you)</span>}
                </p>
                <p className="text-navy-400 text-xs">{entry.gamesPlayed} {t('games', 'गेम')}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-saffron-400 font-bold">{entry.highScore}/5</p>
                <p className="text-navy-500 text-xs">{t('best', 'सर्वश्रेष्ठ')}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

Leaderboard.propTypes = {
  language:      PropTypes.oneOf(['en', 'hi']),
  currentUserId: PropTypes.string,
};
