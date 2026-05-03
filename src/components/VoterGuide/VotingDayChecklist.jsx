// src/components/VoterGuide/VotingDayChecklist.jsx
const CHECKLIST = [
  { id: 'id', icon: '🪪', en: 'Carry valid ID: Voter ID card, Aadhaar, Passport, Driving Licence, or any ECI-approved document', hi: 'वैध पहचान पत्र लाएं: Voter ID, आधार, पासपोर्ट, ड्राइविंग लाइसेंस या कोई ECI-अनुमोदित दस्तावेज़' },
  { id: 'booth', icon: '📍', en: 'Know your polling booth number (check voters.eci.gov.in or SMS EPIC to 1950)', hi: 'अपना मतदान केंद्र नंबर जानें (voters.eci.gov.in या SMS EPIC to 1950)' },
  { id: 'time', icon: '⏰', en: 'Booths are open 7 AM to 6 PM — go early to avoid queues', hi: 'मतदान केंद्र 7 AM से 6 PM तक खुले हैं — लंबी कतार से बचने के लिए जल्दी जाएं' },
  { id: 'queue', icon: '🧍', en: 'Stand in queue patiently. You cannot be denied if you arrived before 6 PM.', hi: 'धैर्यपूर्वक कतार में खड़े रहें। 6 PM से पहले आने पर आपको वोट से नहीं रोका जा सकता।' },
  { id: 'verify', icon: '✅', en: 'Officer will verify your name in the electoral roll and mark your slip', hi: 'अधिकारी चुनावी सूची में आपका नाम सत्यापित करेगा और आपकी पर्ची पर निशान लगाएगा' },
  { id: 'ink', icon: '🖊️', en: 'Indelible ink will be applied to your left index finger — this prevents double voting', hi: 'बाईं तर्जनी पर अमिट स्याही लगाई जाएगी — यह दोहरे मतदान को रोकती है' },
  { id: 'vote', icon: '🗳️', en: 'Press the button next to your chosen candidate on the EVM. A beep confirms your vote.', hi: 'EVM पर अपने चुने हुए उम्मीदवार के बगल में बटन दबाएं। बीप की आवाज़ वोट की पुष्टि करती है।' },
  { id: 'vvpat', icon: '🧾', en: 'VVPAT will show a paper slip with your candidate\'s name for 7 seconds — verify it', hi: 'VVPAT 7 सेकंड के लिए आपके उम्मीदवार का नाम दिखाएगा — इसे सत्यापित करें' },
];

export default function VotingDayChecklist({ language = 'en' }) {
  return (
    <div className="max-w-3xl" role="region" aria-label={language === 'hi' ? 'मतदान दिवस चेकलिस्ट' : 'Voting day checklist'}>
      <h2 className="text-xl font-bold text-white mb-2">🗳️ {language === 'hi' ? 'मतदान के दिन क्या करें?' : 'What to Do on Voting Day'}</h2>
      <p className="text-navy-300 text-sm mb-6">{language === 'hi' ? 'मतदान केंद्र जाने से पहले यह सुनिश्चित करें:' : 'Follow this checklist on polling day:'}</p>

      <ul className="space-y-3" role="list" aria-label={language === 'hi' ? 'मतदान दिवस चेकलिस्ट' : 'Voting day checklist'}>
        {CHECKLIST.map((item, i) => (
          <li key={item.id} className="flex gap-4 card p-4">
            <span className="text-2xl flex-shrink-0" aria-hidden="true">{item.icon}</span>
            <div>
              <span className="text-navy-400 text-xs font-medium">{language === 'hi' ? `चरण ${i+1}` : `Step ${i+1}`}</span>
              <p className="text-navy-200 text-sm mt-0.5">{language === 'hi' ? item.hi : item.en}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
        <p className="text-emerald-300 text-sm">
          🎉 {language === 'hi'
            ? 'मतदान के बाद — आपने एक महत्वपूर्ण लोकतांत्रिक कर्तव्य निभाया है! अपनी स्याही वाली ऊँगली की फोटो सोशल मीडिया पर शेयर करें।'
            : 'After voting — you\'ve fulfilled your democratic duty! Share your inked finger on social media to inspire others.'}
        </p>
      </div>
    </div>
  );
}
