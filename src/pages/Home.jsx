// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@hooks/useAuth';

const FEATURES = [
  { icon: '🤖', title: 'AI Chat Assistant', desc: 'Ask anything about elections in Hindi or English. Powered by Gemini 1.5 Flash.', link: null, badge: 'AI Powered' },
  { icon: '📅', title: 'Election Timeline', desc: 'Visual guide through all 6 stages of the Indian election process.', link: '/timeline', badge: 'Interactive' },
  { icon: '📖', title: 'Voter Guide', desc: 'Eligibility checker, registration steps, EVM guide, NOTA, and voting day checklist.', link: '/guide', badge: 'Complete Guide' },
  { icon: '📍', title: 'Find Your Booth', desc: 'Locate polling booths near you with Google Maps integration.', link: '/locator', badge: 'Maps' },
  { icon: '🧠', title: 'Knowledge Quiz', desc: 'Test your election knowledge with 5 MCQs and compete on the leaderboard.', link: '/quiz', badge: 'Win Points' },
  { icon: '♿', title: 'Accessible Design', desc: 'Font size controls, high contrast mode, full keyboard navigation, screen reader support.', link: null, badge: 'WCAG 2.1 AA' },
];

const STATS = [
  { value: '970M+', label: 'Registered Voters', icon: '👥' },
  { value: '1M+',   label: 'Polling Booths',    icon: '🗳️' },
  { value: '28',    label: 'States & 8 UTs',    icon: '🗺️' },
  { value: '543',   label: 'Lok Sabha Seats',   icon: '🏛️' },
];

export default function Home() {
  const { user, signInWithGoogle } = useAuth();

  return (
    <main id="main-content" tabIndex={-1} className="focus:outline-none">
      {/* Hero */}
      <section
        className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-4"
        aria-labelledby="hero-heading"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800" aria-hidden="true" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, #FF6B00 0%, transparent 50%), radial-gradient(circle at 75% 75%, #138808 0%, transparent 50%)',
        }} aria-hidden="true" />

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          {/* Tricolor bar */}
          <div className="tricolor-bar w-24 mx-auto mb-8" aria-hidden="true" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 badge bg-saffron-500/20 text-saffron-400 border border-saffron-500/40 mb-6 px-4 py-2">
              <span aria-hidden="true">🇮🇳</span>
              <span>India's AI-Powered Election Education Platform</span>
            </div>

            <h1 id="hero-heading" className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Vote<span className="gradient-text">Guide</span> AI
            </h1>

            <p className="text-xl md:text-2xl text-navy-300 mb-4 max-w-3xl mx-auto leading-relaxed">
              Your intelligent guide to understanding Indian elections.
            </p>
            <p className="text-lg text-navy-400 mb-10 font-hindi">
              भारतीय चुनावों को समझें — हिंदी और अंग्रेजी में
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/guide"
                className="btn-primary text-lg px-8 py-4"
                aria-label="Start learning about voter registration and the election process"
              >
                🗳️ Start Voter Guide
              </Link>
              {!user && (
                <button
                  onClick={signInWithGoogle}
                  className="btn-secondary text-lg px-8 py-4"
                  aria-label="Sign in with Google to track your quiz scores"
                >
                  🔑 Sign In with Google
                </button>
              )}
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            aria-hidden="true"
          >
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
              <div className="w-1 h-3 bg-saffron-400 rounded-full" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-navy-800/50" aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">India Election Statistics</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl mb-2" aria-hidden="true">{stat.icon}</div>
              <div className="text-3xl font-black gradient-text">{stat.value}</div>
              <div className="text-navy-400 text-sm mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4" aria-labelledby="features-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 id="features-heading" className="section-title">Everything You Need</h2>
            <p className="section-subtitle">All election resources in one place</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {feat.link ? (
                  <Link
                    to={feat.link}
                    className="card p-6 block hover:border-saffron-500/40 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
                    aria-label={`${feat.title}: ${feat.desc}`}
                  >
                    <FeatureCard feat={feat} />
                  </Link>
                ) : (
                  <div className="card p-6">
                    <FeatureCard feat={feat} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="py-20 px-4 text-center bg-gradient-to-br from-saffron-900/20 to-navy-900" aria-labelledby="cta-heading">
          <div className="max-w-2xl mx-auto">
            <div className="text-5xl mb-6" aria-hidden="true">🗳️</div>
            <h2 id="cta-heading" className="section-title">Ready to be an informed voter?</h2>
            <p className="section-subtitle">Sign in to track your quiz scores and save your progress.</p>
            <button
              onClick={signInWithGoogle}
              className="btn-primary text-lg px-10 py-4 mx-auto"
              aria-label="Sign in with Google to get started"
            >
              🔑 Get Started with Google
            </button>
          </div>
        </section>
      )}
    </main>
  );
}

function FeatureCard({ feat }) {
  return (
    <>
      <div className="flex items-start justify-between mb-4">
        <span className="text-4xl" aria-hidden="true">{feat.icon}</span>
        <span className="badge bg-saffron-500/15 text-saffron-400 border border-saffron-500/30 text-xs">
          {feat.badge}
        </span>
      </div>
      <h3 className="text-white font-bold text-lg mb-2 group-hover:text-saffron-400 transition-colors">
        {feat.title}
      </h3>
      <p className="text-navy-300 text-sm leading-relaxed">{feat.desc}</p>
      {feat.link && (
        <span className="text-saffron-400 text-sm mt-3 block group-hover:translate-x-1 transition-transform">
          Learn more →
        </span>
      )}
    </>
  );
}
