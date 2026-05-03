// src/components/Quiz/Quiz.jsx
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence }           from 'framer-motion';
import { getQuizQuestions }                  from '@data/quizQuestions';
import { useFirestore }                      from '@hooks/useFirestore';
import { useAuth }                           from '@hooks/useAuth';
import QuizQuestion                          from './QuizQuestion';
import QuizResult                            from './QuizResult';
import Leaderboard                           from './Leaderboard';
import toast                                 from 'react-hot-toast';

export default function Quiz({ language = 'en' }) {
  const [questions,    setQuestions]    = useState([]);
  const [currentIdx,   setCurrentIdx]   = useState(0);
  const [score,        setScore]        = useState(0);
  const [answers,      setAnswers]      = useState([]);
  const [phase,        setPhase]        = useState('intro'); // intro | quiz | result | leaderboard
  const [startTime,    setStartTime]    = useState(null);
  const [submitted,    setSubmitted]    = useState(false);

  const { user } = useAuth();
  const { saveQuizScore, updateStreak } = useFirestore(user?.uid);

  const startQuiz = useCallback(() => {
    const qs = getQuizQuestions(5);
    setQuestions(qs);
    setCurrentIdx(0);
    setScore(0);
    setAnswers([]);
    setSubmitted(false);
    setPhase('quiz');
    setStartTime(Date.now());
  }, []);

  const handleAnswer = useCallback((selectedIndex) => {
    const question = questions[currentIdx];
    const correct  = selectedIndex === question.correctIndex;
    if (correct) setScore(s => s + 1);

    const answer = { questionId: question.id, selectedIndex, correct };
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentIdx + 1 >= questions.length) {
        setPhase('result');
      } else {
        setCurrentIdx(i => i + 1);
      }
    }, 1200);
  }, [questions, currentIdx, answers]);

  const handleSubmitScore = useCallback(async () => {
    if (submitted || !user) return;
    setSubmitted(true);
    const timeMs = Date.now() - startTime;
    try {
      await saveQuizScore(score, questions.length, timeMs);
      const newStreak = await updateStreak();
      toast.success(`Score saved! 🎉 Streak: ${newStreak} day${newStreak > 1 ? 's' : ''} 🔥`);
    } catch {
      toast.error('Failed to save score. Please try again.');
      setSubmitted(false);
    }
  }, [submitted, user, score, questions.length, startTime, saveQuizScore, updateStreak]);

  const t = (en, hi) => language === 'hi' ? hi : en;

  return (
    <section aria-labelledby="quiz-heading" className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 id="quiz-heading" className="section-title">
            🧠 {t('Election Knowledge Quiz', 'चुनाव ज्ञान क्विज़')}
          </h2>
          <p className="section-subtitle">
            {t('Test your knowledge about Indian elections', 'भारतीय चुनावों के बारे में अपना ज्ञान परखें')}
          </p>
        </div>

        {/* Tab between quiz and leaderboard */}
        <div className="flex justify-center gap-3 mb-8">
          {['quiz', 'leaderboard'].map(tab => (
            <button
              key={tab}
              onClick={() => setPhase(tab === 'quiz' ? (phase === 'result' ? 'result' : 'intro') : 'leaderboard')}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 ${
                (tab === 'quiz' && phase !== 'leaderboard') || (tab === 'leaderboard' && phase === 'leaderboard')
                  ? 'bg-saffron-500 text-white'
                  : 'bg-navy-800/60 text-navy-300 border border-white/10 hover:text-white'
              }`}
              aria-label={tab === 'quiz' ? t('Play Quiz', 'क्विज़ खेलें') : t('Leaderboard', 'लीडरबोर्ड')}
              aria-pressed={tab === 'leaderboard' ? phase === 'leaderboard' : phase !== 'leaderboard'}
            >
              {tab === 'quiz' ? `🧠 ${t('Quiz', 'क्विज़')}` : `🏆 ${t('Leaderboard', 'लीडरबोर्ड')}`}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Intro */}
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card p-8 text-center"
            >
              <div className="text-6xl mb-4" aria-hidden="true">🗳️</div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {t('Ready to test your election knowledge?', 'अपना चुनावी ज्ञान परखने के लिए तैयार हैं?')}
              </h3>
              <ul className="text-navy-300 text-sm space-y-2 mb-8 text-left max-w-xs mx-auto">
                <li>✦ {t('5 multiple choice questions', '5 बहुविकल्पीय प्रश्न')}</li>
                <li>✦ {t('Topics: EVM, NOTA, MCC, Eligibility, ECI', 'विषय: EVM, NOTA, MCC, पात्रता, ECI')}</li>
                <li>✦ {t('Save score to leaderboard', 'लीडरबोर्ड पर स्कोर सेव करें')}</li>
                {!user && <li className="text-yellow-400">⚠️ {t('Sign in to save your score', 'स्कोर सेव करने के लिए साइन इन करें')}</li>}
              </ul>
              <button
                onClick={startQuiz}
                className="btn-primary text-lg px-10 py-4 mx-auto"
                aria-label={t('Start the election knowledge quiz', 'चुनाव ज्ञान क्विज़ शुरू करें')}
              >
                🚀 {t('Start Quiz', 'क्विज़ शुरू करें')}
              </button>
            </motion.div>
          )}

          {/* Quiz in progress */}
          {phase === 'quiz' && questions.length > 0 && (
            <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-navy-400 mb-2">
                  <span>{t(`Question ${currentIdx + 1} of ${questions.length}`, `प्रश्न ${currentIdx + 1} / ${questions.length}`)}</span>
                  <span>{t(`Score: ${score}`, `स्कोर: ${score}`)}</span>
                </div>
                <div
                  className="h-2 bg-navy-700 rounded-full"
                  role="progressbar"
                  aria-valuenow={currentIdx + 1}
                  aria-valuemin={1}
                  aria-valuemax={questions.length}
                  aria-label={t(`Question ${currentIdx + 1} of ${questions.length}`, `प्रश्न ${currentIdx + 1} / ${questions.length}`)}
                >
                  <motion.div
                    className="h-full bg-saffron-500 rounded-full"
                    animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <QuizQuestion
                question={questions[currentIdx]}
                onAnswer={handleAnswer}
                language={language}
              />
            </motion.div>
          )}

          {/* Result */}
          {phase === 'result' && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <QuizResult
                score={score}
                total={questions.length}
                questions={questions}
                answers={answers}
                language={language}
                onPlayAgain={startQuiz}
                onSaveScore={handleSubmitScore}
                submitted={submitted}
                isLoggedIn={!!user}
              />
            </motion.div>
          )}

          {/* Leaderboard */}
          {phase === 'leaderboard' && (
            <motion.div key="leaderboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Leaderboard language={language} currentUserId={user?.uid} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
