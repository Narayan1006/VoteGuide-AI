// src/components/VoterGuide/EligibilityChecker.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EligibilityChecker({ language = 'en' }) {
  const [age,         setAge]         = useState('');
  const [isCitizen,   setIsCitizen]   = useState(null);
  const [result,      setResult]      = useState(null);
  const [errors,      setErrors]      = useState({});
  const [submitted,   setSubmitted]   = useState(false);

  const validate = () => {
    const newErrors = {};
    const parsedAge = parseInt(age, 10);

    if (!age || isNaN(parsedAge)) {
      newErrors.age = language === 'hi' ? 'कृपया अपनी आयु दर्ज करें।' : 'Please enter your age.';
    } else if (parsedAge < 0 || parsedAge > 120) {
      newErrors.age = language === 'hi' ? 'कृपया एक वैध आयु दर्ज करें।' : 'Please enter a valid age.';
    }

    if (isCitizen === null) {
      newErrors.citizen = language === 'hi'
        ? 'कृपया नागरिकता का चयन करें।'
        : 'Please select your citizenship status.';
    }

    return newErrors;
  };

  const handleCheck = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const parsedAge = parseInt(age, 10);
    const isEligible = parsedAge >= 18 && isCitizen === true;

    setResult({
      eligible:  isEligible,
      agePass:   parsedAge >= 18,
      citizenPass: isCitizen === true,
      age:       parsedAge,
    });
  };

  const handleReset = () => {
    setAge('');
    setIsCitizen(null);
    setResult(null);
    setErrors({});
    setSubmitted(false);
  };

  const t = (en, hi) => language === 'hi' ? hi : en;

  return (
    <div
      className="card p-6 max-w-lg"
      role="region"
      aria-label={t('Voter Eligibility Checker', 'मतदाता पात्रता जांचकर्ता')}
    >
      <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <span aria-hidden="true">✅</span>
        {t('Am I Eligible to Vote?', 'क्या मैं मतदान के योग्य हूँ?')}
      </h2>
      <p className="text-navy-300 text-sm mb-6">
        {t(
          'Check if you meet the basic eligibility requirements to vote in Indian elections.',
          'जानें कि क्या आप भारतीय चुनावों में मतदान के लिए बुनियादी पात्रता आवश्यकताओं को पूरा करते हैं।'
        )}
      </p>

      <form onSubmit={handleCheck} noValidate aria-label={t('Eligibility check form', 'पात्रता जांच फॉर्म')}>
        {/* Age input */}
        <div className="mb-4">
          <label
            htmlFor="age-input"
            className="block text-sm font-medium text-navy-200 mb-2"
          >
            {t('Your Age (years) *', 'आपकी आयु (वर्ष) *')}
          </label>
          <input
            id="age-input"
            type="number"
            min="0"
            max="120"
            value={age}
            onChange={e => { setAge(e.target.value); setResult(null); }}
            className={`input-field ${errors.age ? 'border-red-500 focus:border-red-500' : ''}`}
            placeholder={t('Enter your age', 'अपनी आयु दर्ज करें')}
            aria-required="true"
            aria-invalid={!!errors.age}
            aria-describedby={errors.age ? 'age-error' : undefined}
          />
          {errors.age && (
            <p id="age-error" role="alert" className="text-red-400 text-xs mt-1">
              {errors.age}
            </p>
          )}
        </div>

        {/* Citizenship */}
        <fieldset className="mb-6">
          <legend className="block text-sm font-medium text-navy-200 mb-3">
            {t('Are you an Indian citizen? *', 'क्या आप भारतीय नागरिक हैं? *')}
          </legend>
          <div className="flex gap-4">
            {[
              { value: true,  label: t('Yes', 'हाँ'), id: 'citizen-yes' },
              { value: false, label: t('No',  'नहीं'), id: 'citizen-no' },
            ].map(opt => (
              <label
                key={String(opt.value)}
                htmlFor={opt.id}
                className={`flex items-center gap-2 cursor-pointer px-4 py-3 rounded-xl border-2 flex-1 transition-all ${
                  isCitizen === opt.value
                    ? opt.value
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-red-500/20 border-red-500 text-red-300'
                    : 'bg-white/5 border-white/20 text-navy-300 hover:border-white/40'
                }`}
              >
                <input
                  id={opt.id}
                  type="radio"
                  name="citizenship"
                  value={String(opt.value)}
                  checked={isCitizen === opt.value}
                  onChange={() => { setIsCitizen(opt.value); setResult(null); }}
                  className="sr-only"
                  aria-required="true"
                />
                <span aria-hidden="true">{opt.value ? '🇮🇳' : '❌'}</span>
                <span className="font-medium">{opt.label}</span>
              </label>
            ))}
          </div>
          {errors.citizen && (
            <p role="alert" className="text-red-400 text-xs mt-2">{errors.citizen}</p>
          )}
        </fieldset>

        <button
          type="submit"
          className="btn-primary w-full justify-center"
          aria-label={t('Check eligibility', 'पात्रता जांचें')}
        >
          {t('Check Eligibility', 'पात्रता जांचें')} →
        </button>
      </form>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            role="alert"
            aria-live="polite"
            aria-atomic="true"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-6 p-5 rounded-2xl border-2 ${
              result.eligible
                ? 'bg-emerald-500/10 border-emerald-500'
                : 'bg-red-500/10 border-red-500'
            }`}
          >
            <div className="text-4xl text-center mb-3" aria-hidden="true">
              {result.eligible ? '🎉' : '❌'}
            </div>
            <h3 className={`text-lg font-bold text-center mb-4 ${result.eligible ? 'text-emerald-300' : 'text-red-300'}`}>
              {result.eligible
                ? t('You ARE eligible to vote! 🗳️', 'आप मतदान के योग्य हैं! 🗳️')
                : t('You are NOT eligible to vote yet.', 'आप अभी मतदान के योग्य नहीं हैं।')
              }
            </h3>

            <ul className="space-y-2 text-sm">
              <li className={`flex items-center gap-2 ${result.agePass ? 'text-emerald-400' : 'text-red-400'}`}>
                <span aria-hidden="true">{result.agePass ? '✓' : '✗'}</span>
                {t(`Age ${result.age} — must be 18+ `, `आयु ${result.age} — 18+ होना आवश्यक `)}
                {result.agePass
                  ? t('(Requirement met)', '(पूरी हुई)')
                  : t(`(Need ${18 - result.age} more year${18 - result.age > 1 ? 's' : ''})`, `(${18 - result.age} वर्ष और चाहिए)`)
                }
              </li>
              <li className={`flex items-center gap-2 ${result.citizenPass ? 'text-emerald-400' : 'text-red-400'}`}>
                <span aria-hidden="true">{result.citizenPass ? '✓' : '✗'}</span>
                {t('Indian Citizenship — ', 'भारतीय नागरिकता — ')}
                {result.citizenPass
                  ? t('(Requirement met)', '(पूरी हुई)')
                  : t('(Must be Indian citizen)', '(भारतीय नागरिक होना आवश्यक)')
                }
              </li>
            </ul>

            {result.eligible && (
              <div className="mt-4 p-3 bg-emerald-500/10 rounded-xl">
                <p className="text-emerald-300 text-sm">
                  🎯 {t(
                    'Great! Register at voters.eci.gov.in using Form 6. You need your Aadhaar card and address proof.',
                    'बढ़िया! voters.eci.gov.in पर Form 6 से पंजीकरण करें। आधार कार्ड और पता प्रमाण आवश्यक है।'
                  )}
                </p>
              </div>
            )}

            <button
              onClick={handleReset}
              className="btn-secondary w-full justify-center mt-4 text-sm"
              aria-label={t('Check again', 'फिर से जांचें')}
            >
              {t('Check Again', 'फिर से जांचें')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
