// src/components/ElectionTimeline/ElectionTimeline.jsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence }      from 'framer-motion';
import { ELECTION_STAGES }             from '@data/timelineData';
import { explainTimelineStage }        from '@services/geminiService';
import StageModal                      from './StageModal';

export default function ElectionTimeline({ language = 'en' }) {
  const [activeStage,   setActiveStage]   = useState(null);
  const [aiExplanation, setAiExplanation] = useState('');
  const [loadingAI,     setLoadingAI]     = useState(false);
  const [currentPhase]                    = useState(4); // Mock: currently in Campaigning phase
  const modalRef                          = useRef(null);

  // Trap focus in modal + close on Escape
  useEffect(() => {
    if (!activeStage) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    modalRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeStage]);

  const handleStageClick = async (stage) => {
    setActiveStage(stage);
    setAiExplanation('');
    setLoadingAI(true);

    try {
      const explanation = await explainTimelineStage(stage.aiPrompt, language);
      setAiExplanation(explanation);
    } catch {
      setAiExplanation(
        language === 'hi'
          ? '⚠️ AI स्पष्टीकरण लोड नहीं हो सका। कृपया पुनः प्रयास करें।'
          : '⚠️ Could not load AI explanation. Please try again.'
      );
    } finally {
      setLoadingAI(false);
    }
  };

  const handleCloseModal = () => {
    setActiveStage(null);
    setAiExplanation('');
  };

  return (
    <section aria-labelledby="timeline-heading" className="py-12">
      <div className="text-center mb-10">
        <h2 id="timeline-heading" className="section-title">
          🗳️ {language === 'hi' ? 'चुनाव प्रक्रिया' : 'Election Process Timeline'}
        </h2>
        <p className="section-subtitle">
          {language === 'hi'
            ? 'भारतीय चुनाव के 6 प्रमुख चरण — क्लिक करके विस्तार से जानें'
            : 'Click any stage to learn more with AI-powered explanations'}
        </p>

        {/* Progress bar */}
        <div
          className="max-w-2xl mx-auto mb-8"
          role="progressbar"
          aria-valuenow={currentPhase}
          aria-valuemin={1}
          aria-valuemax={6}
          aria-label={`Currently in phase ${currentPhase} of 6: ${ELECTION_STAGES[currentPhase - 1]?.title}`}
        >
          <div className="flex justify-between text-xs text-navy-400 mb-1">
            <span>{language === 'hi' ? 'वर्तमान चरण' : 'Current Phase'}:</span>
            <span className="text-saffron-400 font-semibold">
              {ELECTION_STAGES[currentPhase - 1]?.title}
            </span>
          </div>
          <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-saffron-500 to-saffron-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentPhase / 6) * 100}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Timeline grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4"
        role="list"
        aria-label="Election stages"
      >
        {ELECTION_STAGES.map((stage, idx) => (
          <motion.article
            key={stage.id}
            role="listitem"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
          >
            <button
              onClick={() => handleStageClick(stage)}
              className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-saffron-500/50 ${
                currentPhase === stage.id
                  ? `${stage.bgColor} ${stage.borderColor} shadow-glow-saffron`
                  : 'bg-navy-800/60 border-white/10 hover:border-white/30'
              }`}
              aria-label={`Stage ${stage.id}: ${stage.title}. ${stage.subtitle}. Click to learn more.`}
              aria-expanded="false"
            >
              {/* Stage number + icon */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-3xl transition-transform group-hover:scale-110 ${
                    currentPhase === stage.id ? 'animate-bounce-slow' : ''
                  }`}
                  aria-hidden="true"
                >
                  {stage.icon}
                </span>
                <span className={`badge ${stage.bgColor} ${stage.textColor} border ${stage.borderColor}`}>
                  {language === 'hi' ? `चरण ${stage.id}` : `Stage ${stage.id}`}
                </span>
              </div>

              {/* Title */}
              <h3 className={`text-lg font-bold text-white mb-1 group-hover:${stage.textColor} transition-colors`}>
                {stage.title}
              </h3>
              <p className={`text-sm font-medium ${stage.textColor} mb-2`}>{stage.subtitle}</p>
              <p className="text-navy-400 text-xs mb-3">{stage.date}</p>

              <p className="text-navy-300 text-sm line-clamp-2 mb-3">{stage.description}</p>

              {/* Current phase badge */}
              {currentPhase === stage.id && (
                <span className="badge bg-saffron-500/20 text-saffron-400 border border-saffron-500/40 text-xs">
                  ● {language === 'hi' ? 'वर्तमान चरण' : 'Current Phase'}
                </span>
              )}

              <div className={`text-xs ${stage.textColor} mt-2 group-hover:underline`}>
                {language === 'hi' ? '→ विस्तार से जानें' : '→ Learn more with AI'}
              </div>
            </button>
          </motion.article>
        ))}
      </div>

      {/* Stage Modal */}
      <AnimatePresence>
        {activeStage && (
          <StageModal
            ref={modalRef}
            stage={activeStage}
            aiExplanation={aiExplanation}
            isLoadingAI={loadingAI}
            language={language}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
