// src/components/VoterGuide/EVMDiagram.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';

const EVM_PARTS = [
  { id: 'cu', label: 'Control Unit (CU)', labelHi: 'नियंत्रण इकाई (CU)', icon: '🖥️', desc: 'Operated by the polling officer. Controls the BU and stores vote count securely.', descHi: 'मतदान अधिकारी द्वारा संचालित। BU को नियंत्रित करता है और मतों की गणना सुरक्षित रखता है।', color: 'border-blue-500 bg-blue-500/10' },
  { id: 'bu', label: 'Ballot Unit (BU)', labelHi: 'बैलट इकाई (BU)', icon: '🔲', desc: 'Has buttons for each candidate. Voter presses button to cast vote.', descHi: 'प्रत्येक उम्मीदवार के लिए बटन। मतदाता बटन दबाकर मत देता है।', color: 'border-green-500 bg-green-500/10' },
  { id: 'vvpat', label: 'VVPAT', labelHi: 'VVPAT', icon: '🧾', desc: 'Prints a paper slip showing who you voted for. Displayed for 7 seconds.', descHi: '7 सेकंड के लिए एक पर्ची दिखाता है जो बताती है आपने किसे वोट दिया।', color: 'border-yellow-500 bg-yellow-500/10' },
];

export default function EVMDiagram({ language = 'en' }) {
  const [active, setActive] = useState(null);

  return (
    <div className="max-w-3xl" role="region" aria-label={language === 'hi' ? 'EVM आरेख' : 'EVM Diagram'}>
      <h2 className="text-xl font-bold text-white mb-2">⚡ {language === 'hi' ? 'EVM कैसे काम करता है?' : 'How Does the EVM Work?'}</h2>
      <p className="text-navy-300 text-sm mb-8">{language === 'hi' ? 'EVM के तीन मुख्य भाग हैं। किसी पर क्लिक करें:' : 'The EVM has 3 main components. Click any to learn more:'}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {EVM_PARTS.map(part => (
          <motion.button
            key={part.id}
            onClick={() => setActive(active?.id === part.id ? null : part)}
            className={`card p-5 text-left border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 ${active?.id === part.id ? part.color : 'border-white/10'}`}
            aria-expanded={active?.id === part.id}
            aria-label={`${language === 'hi' ? part.labelHi : part.label} — ${language === 'hi' ? 'विस्तार के लिए क्लिक करें' : 'Click for details'}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-3xl mb-2" aria-hidden="true">{part.icon}</div>
            <h3 className="text-white font-semibold text-sm">{language === 'hi' ? part.labelHi : part.label}</h3>
          </motion.button>
        ))}
      </div>

      {active && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-5 rounded-2xl border-2 ${active.color} mb-6`}
          role="region"
          aria-label={`${active.label} details`}
          aria-live="polite"
        >
          <h3 className="text-white font-bold mb-2">{language === 'hi' ? active.labelHi : active.label}</h3>
          <p className="text-navy-200 text-sm">{language === 'hi' ? active.descHi : active.desc}</p>
        </motion.div>
      )}

      <div className="card p-5">
        <h3 className="text-white font-semibold mb-3">🔐 {language === 'hi' ? 'क्या EVM सुरक्षित है?' : 'Is the EVM Secure?'}</h3>
        <ul className="space-y-2 text-navy-300 text-sm">
          {(language === 'hi' ? [
            'EVM इंटरनेट से कनेक्ट नहीं होता — हैक नहीं हो सकता',
            'EVM standalone मशीन है — बाहरी नेटवर्क से अलग',
            'प्रत्येक वोट एन्क्रिप्टेड मेमोरी में सुरक्षित',
            'VVPAT पेपर ट्रेल से सत्यापन संभव',
          ] : [
            'EVM is NOT connected to internet — cannot be hacked remotely',
            'Standalone machine — isolated from external networks',
            'Each vote stored in encrypted memory',
            'VVPAT provides paper trail for verification',
          ]).map((pt, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-emerald-400 flex-shrink-0" aria-hidden="true">✓</span>
              {pt}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
