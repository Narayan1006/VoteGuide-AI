// src/components/ElectionTimeline/StageModal.jsx
/**
 * @fileoverview Accessible modal dialog for election timeline stage details.
 * Displays key points, dates, and a Gemini AI-generated explanation.
 * Traps focus via ref and supports Escape key dismissal.
 */
import { forwardRef } from 'react';
import PropTypes      from 'prop-types';
import { motion }     from 'framer-motion';

const StageModal = forwardRef(function StageModal(
  { stage, aiExplanation, isLoadingAI, language, onClose },
  ref
) {
  if (!stage) return null;

  return (
    /* Backdrop */
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="presentation"
      data-testid="modal-backdrop"
    >
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        tabIndex={-1}
        className="bg-navy-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl focus:outline-none"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1,   y: 0  }}
        exit={{ scale: 0.9,    y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* Header */}
        <div className={`p-6 ${stage.bgColor} border-b border-white/10 rounded-t-2xl`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-4xl mb-2" aria-hidden="true">{stage.icon}</div>
              <h2 id="modal-title" className="text-2xl font-bold text-white">
                {stage.title}
              </h2>
              <p className={`${stage.textColor} font-medium`}>{stage.subtitle}</p>
              <p className="text-navy-400 text-sm mt-1">{stage.date}</p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6" id="modal-description">
          {/* Description */}
          <p className="text-navy-200 mb-6 leading-relaxed">{stage.description}</p>

          {/* Key points */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">
              {language === 'hi' ? '📌 मुख्य बिंदु:' : '📌 Key Points:'}
            </h3>
            <ul className="space-y-2" aria-label="Key points">
              {stage.keyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-navy-200 text-sm">
                  <span className={`${stage.textColor} flex-shrink-0 mt-0.5`} aria-hidden="true">✓</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* AI Explanation section */}
          <div className={`rounded-xl p-4 ${stage.bgColor} border ${stage.borderColor}`}>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <span aria-hidden="true">🤖</span>
              {language === 'hi' ? 'AI से विस्तृत जानकारी:' : 'AI-Powered Explanation:'}
            </h3>

            {isLoadingAI ? (
              <div className="space-y-2" role="status" aria-label="Loading AI explanation" aria-busy="true">
                {[90, 80, 70, 60].map((w, i) => (
                  <div
                    key={i}
                    className="h-3 bg-white/20 rounded animate-pulse"
                    style={{ width: `${w}%` }}
                  />
                ))}
                <span className="sr-only">Loading AI explanation...</span>
              </div>
            ) : aiExplanation ? (
              <div
                className="text-navy-200 text-sm leading-relaxed whitespace-pre-line"
                aria-live="polite"
                dangerouslySetInnerHTML={{
                  __html: aiExplanation
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n/g, '<br />')
                }}
              />
            ) : (
              <p className="text-navy-400 text-sm italic">
                {language === 'hi' ? 'AI स्पष्टीकरण लोड हो रहा है...' : 'Loading AI explanation...'}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="btn-primary w-full justify-center"
            aria-label="Close stage details"
          >
            {language === 'hi' ? '✓ समझ गया' : '✓ Got it'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
});

StageModal.propTypes = {
  stage: PropTypes.shape({
    id:          PropTypes.number.isRequired,
    title:       PropTypes.string.isRequired,
    subtitle:    PropTypes.string.isRequired,
    date:        PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon:        PropTypes.string.isRequired,
    keyPoints:   PropTypes.arrayOf(PropTypes.string).isRequired,
    bgColor:     PropTypes.string.isRequired,
    textColor:   PropTypes.string.isRequired,
    borderColor: PropTypes.string.isRequired,
  }).isRequired,
  aiExplanation: PropTypes.string,
  isLoadingAI:   PropTypes.bool.isRequired,
  language:      PropTypes.oneOf(['en', 'hi']).isRequired,
  onClose:       PropTypes.func.isRequired,
};

export default StageModal;
