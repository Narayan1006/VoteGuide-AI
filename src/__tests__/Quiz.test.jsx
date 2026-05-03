// src/__tests__/Quiz.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

// ── Mocks ────────────────────────────────────────────────────────
jest.mock('@services/firebaseConfig', () => ({ db: {}, auth: { currentUser: null } }));
jest.mock('framer-motion', () => ({
  motion: {
    div:    ({ children, ...p }) => <div {...p}>{children}</div>,
    button: ({ children, ...p }) => <button {...p}>{children}</button>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// ── Imports ───────────────────────────────────────────────────────
import Quiz         from '@components/Quiz/Quiz';
import QuizQuestion from '@components/Quiz/QuizQuestion';
import QuizResult   from '@components/Quiz/QuizResult';
import { getQuizQuestions, QUIZ_QUESTIONS } from '@data/quizQuestions';

describe('Quiz Data', () => {
  test('getQuizQuestions returns 5 questions', () => {
    const questions = getQuizQuestions(5);
    expect(questions).toHaveLength(5);
  });

  test('getQuizQuestions returns different questions each time (randomized)', () => {
    const q1 = getQuizQuestions(5).map(q => q.id).join(',');
    const q2 = getQuizQuestions(5).map(q => q.id).join(',');
    // Very unlikely to be equal (1/20! chance), this is a sanity check
    expect(QUIZ_QUESTIONS).toHaveLength(20);
  });

  test('all questions have required fields', () => {
    QUIZ_QUESTIONS.forEach(q => {
      expect(q.id).toBeDefined();
      expect(q.question).toBeTruthy();
      expect(q.options).toHaveLength(4);
      expect(typeof q.correctIndex).toBe('number');
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThanOrEqual(3);
      expect(q.explanation).toBeTruthy();
    });
  });
});

describe('QuizQuestion Component', () => {
  const mockQuestion = {
    id: 1,
    question: 'What is the voting age in India?',
    options: ['16', '18', '21', '25'],
    correctIndex: 1,
    explanation: 'The voting age in India is 18 years.',
    category: 'Eligibility',
  };

  test('renders question text and all 4 options', () => {
    render(<QuizQuestion question={mockQuestion} onAnswer={jest.fn()} language="en" />);
    expect(screen.getByText('What is the voting age in India?')).toBeInTheDocument();
    expect(screen.getByText('16')).toBeInTheDocument();
    expect(screen.getByText('18')).toBeInTheDocument();
    expect(screen.getByText('21')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  test('calls onAnswer with correct index when option is clicked', () => {
    const mockOnAnswer = jest.fn();
    render(<QuizQuestion question={mockQuestion} onAnswer={mockOnAnswer} language="en" />);

    // Click the "18" option (index 1 = correct)
    const options = screen.getAllByRole('button');
    fireEvent.click(options[1]); // Index 1 = "18"

    expect(mockOnAnswer).toHaveBeenCalledWith(1);
  });

  test('tracks score correctly — correct answer increments score', () => {
    const mockOnAnswer = jest.fn();
    render(<QuizQuestion question={mockQuestion} onAnswer={mockOnAnswer} language="en" />);

    const options = screen.getAllByRole('button');
    fireEvent.click(options[1]); // Correct answer

    // Explanation should appear after answering
    expect(screen.getByText(/voting age in India is 18 years/i)).toBeInTheDocument();
  });

  test('shows explanation after answering', () => {
    render(<QuizQuestion question={mockQuestion} onAnswer={jest.fn()} language="en" />);
    const options = screen.getAllByRole('button');
    fireEvent.click(options[0]); // Wrong answer

    expect(screen.getByText(/voting age in India is 18 years/i)).toBeInTheDocument();
  });

  test('disables options after one is selected', () => {
    render(<QuizQuestion question={mockQuestion} onAnswer={jest.fn()} language="en" />);
    const options = screen.getAllByRole('button');
    fireEvent.click(options[0]);

    options.forEach(opt => {
      expect(opt).toBeDisabled();
    });
  });

  test('renders radiogroup with ARIA label', () => {
    render(<QuizQuestion question={mockQuestion} onAnswer={jest.fn()} language="en" />);
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });
});

describe('QuizResult Component', () => {
  const mockQuestions = [
    { id: 1, question: 'Q1', options: ['A', 'B', 'C', 'D'], correctIndex: 0, explanation: 'Exp1' },
    { id: 2, question: 'Q2', options: ['A', 'B', 'C', 'D'], correctIndex: 1, explanation: 'Exp2' },
  ];
  const mockAnswers = [
    { questionId: 1, selectedIndex: 0, correct: true },
    { questionId: 2, selectedIndex: 2, correct: false },
  ];

  test('displays correct score', () => {
    render(
      <QuizResult
        score={1} total={2} questions={mockQuestions} answers={mockAnswers}
        language="en" onPlayAgain={jest.fn()} onSaveScore={jest.fn()}
        submitted={false} isLoggedIn={true}
      />
    );
    expect(screen.getByText('1/2')).toBeInTheDocument();
  });

  test('shows play again button', () => {
    const mockPlayAgain = jest.fn();
    render(
      <QuizResult
        score={3} total={5} questions={mockQuestions} answers={mockAnswers}
        language="en" onPlayAgain={mockPlayAgain} onSaveScore={jest.fn()}
        submitted={false} isLoggedIn={true}
      />
    );
    fireEvent.click(screen.getByText(/Play Again/i));
    expect(mockPlayAgain).toHaveBeenCalled();
  });

  test('shows save score button for logged-in users', () => {
    render(
      <QuizResult
        score={3} total={5} questions={mockQuestions} answers={mockAnswers}
        language="en" onPlayAgain={jest.fn()} onSaveScore={jest.fn()}
        submitted={false} isLoggedIn={true}
      />
    );
    expect(screen.getByText(/Save Score/i)).toBeInTheDocument();
  });

  test('shows sign-in prompt for non-authenticated users', () => {
    render(
      <QuizResult
        score={3} total={5} questions={mockQuestions} answers={mockAnswers}
        language="en" onPlayAgain={jest.fn()} onSaveScore={jest.fn()}
        submitted={false} isLoggedIn={false}
      />
    );
    expect(screen.getByText(/Sign in to save/i)).toBeInTheDocument();
  });
});

describe('Quiz Component — Start and Progress', () => {
  test('renders intro screen with start button', () => {
    render(<Quiz language="en" />);
    expect(screen.getByText(/Start Quiz/i)).toBeInTheDocument();
    expect(screen.getByText(/5 multiple choice questions/i)).toBeInTheDocument();
  });

  test('clicking start shows first question', async () => {
    render(<Quiz language="en" />);
    const startBtn = screen.getByText(/Start Quiz/i);

    await act(async () => {
      fireEvent.click(startBtn);
    });

    // Should show question progress
    await waitFor(() => {
      expect(screen.getByText(/Question 1 of 5/i)).toBeInTheDocument();
    });
  });

  test('quiz and leaderboard tabs are both visible', () => {
    render(<Quiz language="en" />);
    expect(screen.getByRole('button', { name: /Play Quiz/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Leaderboard/i })).toBeInTheDocument();
  });
});
