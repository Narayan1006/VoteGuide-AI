// src/components/VoterGuide/NOTAInfo.jsx
export default function NOTAInfo({ language = 'en' }) {
  const t = (en, hi) => language === 'hi' ? hi : en;
  return (
    <div className="max-w-3xl" role="region" aria-label={t('NOTA Information', 'NOTA जानकारी')}>
      <div className="card p-6 mb-6">
        <div className="text-5xl text-center mb-4" aria-hidden="true">🚫</div>
        <h2 className="text-2xl font-bold text-white text-center mb-4">
          {t('What is NOTA?', 'NOTA क्या है?')}
        </h2>
        <p className="text-navy-200 text-center text-lg font-medium mb-6">
          {t('"None Of The Above"', '"उपरोक्त में से कोई नहीं"')}
        </p>
        <div className="space-y-4 text-navy-300 text-sm">
          <p>{t(
            'NOTA was introduced in India following a 2013 Supreme Court order. It appears as the last option on the EVM ballot and allows voters to reject all candidates without abstaining.',
            'NOTA को 2013 के सर्वोच्च न्यायालय के आदेश के बाद भारत में लागू किया गया। यह EVM पर अंतिम विकल्प के रूप में दिखता है।'
          )}</p>
          <div className="bg-saffron-500/10 border border-saffron-500/30 rounded-xl p-4">
            <h3 className="text-saffron-300 font-semibold mb-2">
              {t('⚠️ Important: NOTA does NOT disqualify candidates', '⚠️ महत्वपूर्ण: NOTA उम्मीदवारों को अयोग्य नहीं ठहराता')}
            </h3>
            <p className="text-navy-300 text-sm">{t(
              'Even if NOTA gets the most votes, the candidate with the second highest votes wins. NOTA is a symbolic protest vote.',
              'यदि NOTA को सबसे अधिक वोट मिलें, तो दूसरे सबसे अधिक वोट पाने वाले उम्मीदवार को विजेता घोषित किया जाता है।'
            )}</p>
          </div>
          <ul className="space-y-2">
            {(language === 'hi' ? [
              'EVM पर NOTA बटन सबसे अंत में होता है',
              'NOTA वोट गिना जाता है लेकिन चुनाव परिणाम नहीं बदलता',
              'यह मतदान का एक लोकतांत्रिक अधिकार है',
              'NOTA चुनने के बाद भी ऊँगली पर स्याही लगाई जाती है',
            ] : [
              'NOTA button is the last option on the EVM',
              'NOTA votes are counted but don\'t change the election outcome',
              'It is a democratic right to express dissatisfaction',
              'Ink is applied to your finger even if you choose NOTA',
            ]).map((pt, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-saffron-400 flex-shrink-0" aria-hidden="true">•</span>
                {pt}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
