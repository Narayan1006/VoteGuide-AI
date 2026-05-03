// src/pages/QuizPage.jsx
import Quiz from '@components/Quiz/Quiz';
export default function QuizPage({ language }) {
  return (
    <main id="main-content" tabIndex={-1} className="focus:outline-none">
      <Quiz language={language} />
    </main>
  );
}
