// src/components/ChatAssistant/LanguageToggle.jsx
/**
 * @fileoverview Language toggle button for switching between English and Hindi
 * in the AI chat assistant.
 */
import PropTypes from 'prop-types';

/**
 * Toggle button that switches the chat response language between EN and HI.
 *
 * @param {Object}    props
 * @param {'en'|'hi'} props.language  - Currently active language.
 * @param {Function}  props.onToggle  - Callback to toggle the language.
 * @returns {JSX.Element}
 */
export default function LanguageToggle({ language, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-navy-700 hover:bg-navy-600 border border-white/10 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
      aria-label={`Switch to ${language === 'en' ? 'Hindi' : 'English'} language`}
      aria-pressed={language === 'hi'}
      title="Toggle language"
    >
      <span aria-hidden="true">🌐</span>
      <span className={language === 'en' ? 'text-saffron-400' : 'text-navy-400'}>EN</span>
      <span className="text-navy-500" aria-hidden="true">/</span>
      <span className={language === 'hi' ? 'text-saffron-400' : 'text-navy-400'}>हि</span>
    </button>
  );
}

LanguageToggle.propTypes = {
  language: PropTypes.oneOf(['en', 'hi']).isRequired,
  onToggle: PropTypes.func.isRequired,
};
