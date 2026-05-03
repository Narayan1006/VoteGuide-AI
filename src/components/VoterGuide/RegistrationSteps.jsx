// src/components/VoterGuide/RegistrationSteps.jsx
const STEPS = [
  { step: 1, icon: '🌐', title: 'Visit ECI Portal', titleHi: 'ECI पोर्टल खोलें', detail: 'Go to voters.eci.gov.in or the Voter Helpline App.', detailHi: 'voters.eci.gov.in खोलें या Voter Helpline App डाउनलोड करें।' },
  { step: 2, icon: '📋', title: 'Fill Form 6', titleHi: 'Form 6 भरें', detail: 'For new registration, fill Form 6 with your details.', detailHi: 'नए पंजीकरण के लिए Form 6 भरें।' },
  { step: 3, icon: '📸', title: 'Upload Documents', titleHi: 'दस्तावेज़ अपलोड करें', detail: 'Upload: Aadhaar, address proof, passport photo.', detailHi: 'आधार कार्ड, पते का प्रमाण, पासपोर्ट साइज फोटो अपलोड करें।' },
  { step: 4, icon: '✅', title: 'Submit & Get Reference', titleHi: 'जमा करें', detail: 'Submit online and note your Application Reference Number (ARN).', detailHi: 'ऑनलाइन जमा करें और ARN नोट करें।' },
  { step: 5, icon: '🔍', title: 'BLO Verification', titleHi: 'BLO सत्यापन', detail: 'Booth Level Officer may verify your address. This is routine.', detailHi: 'BLO आपके पते पर सत्यापन के लिए आ सकते हैं।' },
  { step: 6, icon: '🗳️', title: 'Download e-EPIC', titleHi: 'e-EPIC डाउनलोड करें', detail: 'After approval (4-6 weeks), download your digital Voter ID (e-EPIC).', detailHi: 'स्वीकृति के बाद डिजिटल Voter ID (e-EPIC) डाउनलोड करें।' },
];

export default function RegistrationSteps({ language = 'en' }) {
  return (
    <div className="max-w-3xl" role="region" aria-label={language === 'hi' ? 'पंजीकरण चरण' : 'Registration steps'}>
      <h2 className="text-xl font-bold text-white mb-6">
        📝 {language === 'hi' ? 'मतदाता पंजीकरण कैसे करें' : 'How to Register as a Voter'}
      </h2>
      <ol className="space-y-4">
        {STEPS.map(s => (
          <li key={s.step} className="flex gap-4 card p-4">
            <div className="w-10 h-10 rounded-full bg-saffron-500/20 border border-saffron-500/40 flex items-center justify-center text-saffron-400 font-bold flex-shrink-0" aria-hidden="true">{s.step}</div>
            <div>
              <h3 className="text-white font-semibold mb-1"><span aria-hidden="true">{s.icon}</span> {language === 'hi' ? s.titleHi : s.title}</h3>
              <p className="text-navy-300 text-sm">{language === 'hi' ? s.detailHi : s.detail}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-6 p-4 bg-saffron-500/10 border border-saffron-500/30 rounded-xl">
        <p className="text-saffron-300 text-sm">📞 {language === 'hi' ? 'सहायता: Voter Helpline 1950' : 'Help: Voter Helpline 1950 (Mon-Sat 10AM-5PM)'}</p>
      </div>
    </div>
  );
}
