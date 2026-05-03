// src/components/Quiz/QuizQuestion.jsx
import { useState } from 'react';
import { motion }   from 'framer-motion';

export default function QuizQuestion({ question, onAnswer, language = 'en' }) {
  const [selected, setSelected] = useState(null);

  const handleSelect = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    onAnswer(idx);
  };

  const getOptionClass = (idx) => {
    if (selected === null) {
      return 'border-white/20 bg-navy-700/60 hover:border-saffron-400/60 hover:bg-saffron-500/10 text-navy-200 cursor-pointer';
    }
    if (idx === question.correctIndex) return 'border-emerald-500 bg-emerald-500/20 text-emerald-300';
    if (idx === selected && selected !== question.correctIndex) return 'border-red-500 bg-red-500/20 text-red-300';
    return 'border-white/10 bg-navy-800/40 text-navy-500';
  };

  return (
    <div className="card p-6" role="group" aria-labelledby="question-text">
      <p className="text-navy-400 text-xs mb-3 font-medium uppercase tracking-wider">
        {question.category}
      </p>
      <h3 id="question-text" className="text-white text-lg font-semibold mb-6 leading-relaxed">
        {question.question}
      </h3>

      <div className="space-y-3" role="radiogroup" aria-label={language === 'hi' ? 'उत्तर विकल्प' : 'Answer options'}>
        {question.options.map((option, idx) => (
          <motion.button
            key={idx}
            onClick={() => handleSelect(idx)}
            disabled={selected !== null}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-3 quiz-option focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 ${getOptionClass(idx)}`}
            aria-label={`Option ${idx + 1}: ${option}${selected !== null ? (idx === question.correctIndex ? ' (Correct)' : idx === selected ? ' (Incorrect)' : '') : ''}`}
            aria-pressed={selected === idx}
            whileHover={selected === null ? { x: 4 } : {}}
            whileTap={selected === null ? { scale: 0.98 } : {}}
          >
            <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${
              selected !== null && idx === question.correctIndex ? 'border-emerald-500 bg-emerald-500 text-white' :
              selected === idx && idx !== question.correctIndex ? 'border-red-500 bg-red-500 text-white' :
              'border-current'
            }`} aria-hidden="true">
              {selected !== null && idx === question.correctIndex ? '✓' :
               selected === idx && idx !== question.correctIndex ? '✗' :
               ['A', 'B', 'C', 'D'][idx]}
            </span>
            <span>{option}</span>
          </motion.button>
        ))}
      </div>

      {selected !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl"
          role="status"
          aria-live="polite"
        >
          <p className="text-blue-300 text-sm">
            💡 <strong>{language === 'hi' ? 'स्पष्टीकरण:' : 'Explanation:'}</strong> {question.explanation}
          </p>
        </motion.div>
      )}
    </div>
  );
}
