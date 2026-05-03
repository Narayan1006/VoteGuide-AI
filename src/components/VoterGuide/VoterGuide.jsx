// src/components/VoterGuide/VoterGuide.jsx
/**
 * @fileoverview Tabbed Voter Guide container.
 * Houses 5 sub-components: EligibilityChecker, RegistrationSteps,
 * VotingDayChecklist, EVMDiagram, and NOTAInfo.
 */
import { useState }    from 'react';
import PropTypes        from 'prop-types';
import EligibilityChecker  from './EligibilityChecker';
import RegistrationSteps   from './RegistrationSteps';
import EVMDiagram          from './EVMDiagram';
import VotingDayChecklist  from './VotingDayChecklist';
import NOTAInfo            from './NOTAInfo';

const TABS = [
  { id: 'eligibility',   label: 'Eligibility',    icon: '✅', component: EligibilityChecker },
  { id: 'register',      label: 'How to Register', icon: '📝', component: RegistrationSteps },
  { id: 'voting-day',    label: 'Voting Day',      icon: '🗳️', component: VotingDayChecklist },
  { id: 'evm',           label: 'How EVM Works',   icon: '⚡', component: EVMDiagram },
  { id: 'nota',          label: 'What is NOTA',    icon: '🚫', component: NOTAInfo },
];

/**
 * Tabbed voter guide with sections for eligibility, registration,
 * voting day, EVM, and NOTA information.
 *
 * @param {Object}     props
 * @param {'en'|'hi'} [props.language='en'] - Display language.
 * @returns {JSX.Element}
 */
export default function VoterGuide({ language = 'en' }) {
  const [activeTab, setActiveTab] = useState('eligibility');

  const ActiveComponent = TABS.find(t => t.id === activeTab)?.component;

  return (
    <section aria-labelledby="voter-guide-heading" className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 id="voter-guide-heading" className="section-title">
            📖 {language === 'hi' ? 'मतदाता गाइड' : 'Voter Guide'}
          </h2>
          <p className="section-subtitle">
            {language === 'hi'
              ? 'मतदान से जुड़ी सभी जानकारी — एक ही जगह'
              : 'Everything you need to know about voting in India'}
          </p>
        </div>

        {/* Tab navigation */}
        <div
          role="tablist"
          aria-label={language === 'hi' ? 'मतदाता गाइड के विषय' : 'Voter guide topics'}
          className="flex flex-wrap gap-2 mb-8 justify-center"
        >
          {TABS.map(tab => (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 ${
                activeTab === tab.id
                  ? 'bg-saffron-500 text-white shadow-glow-saffron'
                  : 'bg-navy-800/60 text-navy-300 border border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              <span aria-hidden="true">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab panel */}
        <div
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          tabIndex={0}
          className="animate-fade-in focus:outline-none"
        >
          {ActiveComponent && <ActiveComponent language={language} />}
        </div>
      </div>
    </section>
  );
}

VoterGuide.propTypes = {
  language: PropTypes.oneOf(['en', 'hi']),
};
