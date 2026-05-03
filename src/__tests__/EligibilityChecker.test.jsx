// src/__tests__/EligibilityChecker.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('framer-motion', () => ({
  motion: { div: ({ children, ...p }) => <div {...p}>{children}</div> },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

import EligibilityChecker from '@components/VoterGuide/EligibilityChecker';

describe('EligibilityChecker', () => {
  test('renders eligibility checker form', () => {
    render(<EligibilityChecker language="en" />);
    expect(screen.getByLabelText(/Your Age/i)).toBeInTheDocument();
    expect(screen.getByText(/Are you an Indian citizen/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Check Eligibility/i })).toBeInTheDocument();
  });

  test('shows validation errors on empty form submission', async () => {
    render(<EligibilityChecker language="en" />);
    fireEvent.click(screen.getByRole('button', { name: /Check Eligibility/i }));
    await waitFor(() => {
      expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
    });
  });

  test('fails eligibility for age under 18', async () => {
    const user = userEvent.setup();
    render(<EligibilityChecker language="en" />);
    await user.type(screen.getByLabelText(/Your Age/i), '16');
    fireEvent.click(screen.getByLabelText(/Yes/i));
    fireEvent.click(screen.getByRole('button', { name: /Check Eligibility/i }));
    await waitFor(() => {
      expect(screen.getByText(/NOT eligible/i)).toBeInTheDocument();
    });
  });

  test('passes eligibility for age 18 with citizenship', async () => {
    const user = userEvent.setup();
    render(<EligibilityChecker language="en" />);
    await user.type(screen.getByLabelText(/Your Age/i), '18');
    fireEvent.click(screen.getByLabelText(/Yes/i));
    fireEvent.click(screen.getByRole('button', { name: /Check Eligibility/i }));
    await waitFor(() => {
      expect(screen.getByText(/ARE eligible/i)).toBeInTheDocument();
    });
  });

  test('fails for non-citizens even with valid age', async () => {
    const user = userEvent.setup();
    render(<EligibilityChecker language="en" />);
    await user.type(screen.getByLabelText(/Your Age/i), '25');
    fireEvent.click(screen.getByLabelText(/No/i));
    fireEvent.click(screen.getByRole('button', { name: /Check Eligibility/i }));
    await waitFor(() => {
      expect(screen.getByText(/NOT eligible/i)).toBeInTheDocument();
    });
  });

  test('renders in Hindi when language is hi', () => {
    render(<EligibilityChecker language="hi" />);
    expect(screen.getByText(/क्या मैं मतदान के योग्य हूँ/i)).toBeInTheDocument();
  });

  test('age input has ARIA required attribute', () => {
    render(<EligibilityChecker language="en" />);
    expect(screen.getByLabelText(/Your Age/i)).toHaveAttribute('aria-required', 'true');
  });

  test('shows registration hint after eligible result', async () => {
    const user = userEvent.setup();
    render(<EligibilityChecker language="en" />);
    await user.type(screen.getByLabelText(/Your Age/i), '22');
    fireEvent.click(screen.getByLabelText(/Yes/i));
    fireEvent.click(screen.getByRole('button', { name: /Check Eligibility/i }));
    await waitFor(() => {
      expect(screen.getByText(/voters.eci.gov.in/i)).toBeInTheDocument();
    });
  });
});
