// src/components/Quiz/QuizResult.jsx
import { motion } from 'framer-motion';

const MESSAGES = [
  { min: 5, icon: '🏆', en: 'Perfect Score! You\'re an election expert!', hi: 'परफेक्ट स्कोर! आप चुनाव विशेषज्ञ हैं!' },
  { min: 4, icon: '⭐', en: 'Excellent! Almost a perfect score!', hi: 'उत्कृष्ट! लगभग परफेक्ट!' },
  { min: 3, icon: '👍', en: 'Good job! Keep learning about elections!', hi: 'अच्छा प्रयास! चुनावों के बारे में और जानें!' },
  { min: 0, icon: '📚', en: 'Keep practicing! Visit the Voter Guide to learn more.', hi: 'अभ्यास जारी रखें! मतदाता गाइड देखें।' },
];

export default function QuizResult({ score, total, questions, answers, language, onPlayAgain, onSaveScore, submitted, isLoggedIn }) {
  const pct = Math.round((score / total) * 100);
  const msg = MESSAGES.find(m => score >= m.min) || MESSAGES[MESSAGES.length - 1];
  const t = (en, hi) => language === 'hi' ? hi : en;

  return (
    <div className="card p-8 text-center" role="region" aria-labelledby="result-heading">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="text-6xl mb-4"
        aria-hidden="true"
      >
        {msg.icon}
      </motion.div>

      <h3 id="result-heading" className="text-2xl font-bold text-white mb-2">
        {language === 'hi' ? msg.hi : msg.en}
      </h3>

      <div
        className="text-6xl font-black gradient-text my-6"
        aria-label={`Score: ${score} out of ${total}, ${pct} percent`}
      >
        {score}/{total}
      </div>

      <div
        className="w-full bg-navy-700 rounded-full h-3 mb-8"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${pct}% correct`}
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-saffron-500 to-saffron-400"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>

      {/* Answer review */}
      <div className="text-left space-y-3 mb-8">
        <h4 className="text-white font-semibold text-sm">{t('Review:', 'समीक्षा:')}</h4>
        {questions.map((q, i) => {
          const ans     = answers[i];
          const correct = ans?.correct;
          return (
            <div
              key={q.id}
              className={`p-3 rounded-xl border text-sm ${correct ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-red-500/40 bg-red-500/10'}`}
            >
              <p className={`font-medium ${correct ? 'text-emerald-300' : 'text-red-300'}`}>
                {correct ? '✓' : '✗'} {q.question}
              </p>
              {!correct && (
                <p className="text-navy-400 text-xs mt-1">
                  {t('Correct: ', 'सही: ')}{q.options[q.correctIndex]}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={onPlayAgain} className="btn-secondary" aria-label={t('Play again', 'फिर से खेलें')}>
          🔄 {t('Play Again', 'फिर से खेलें')}
        </button>
        {isLoggedIn ? (
          <button
            onClick={onSaveScore}
            disabled={submitted}
            className="btn-primary disabled:opacity-50"
            aria-label={submitted ? t('Score saved', 'स्कोर सेव हो गया') : t('Save score to leaderboard', 'लीडरबोर्ड पर सेव करें')}
            aria-busy={submitted}
          >
            {submitted ? `✅ ${t('Saved!', 'सेव हो गया!')}` : `💾 ${t('Save Score', 'स्कोर सेव करें')}`}
          </button>
        ) : (
          <p className="text-navy-400 text-xs flex items-center gap-1">
            🔑 {t('Sign in to save your score', 'स्कोर सेव करने के लिए साइन इन करें')}
          </p>
        )}
      </div>
    </div>
  );
}
