import {MantineProvider} from '@mantine/core';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {SignUpForm} from './SignUpForm';

// Wrapper component for tests
function TestWrapper({children}: {children: React.ReactNode}) {
  return <MantineProvider>{children}</MantineProvider>;
}

describe('SignUpForm', () => {
  const mockOnSuccess = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all form fields', () => {
    render(<SignUpForm />, {wrapper: TestWrapper});

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter your password/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/confirm your password/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /sign up/i})).toBeInTheDocument();
  });

  it('should show login link', () => {
    render(<SignUpForm />, {wrapper: TestWrapper});

    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  it('should validate email format', async () => {
    render(<SignUpForm />, {wrapper: TestWrapper});

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', {name: /sign up/i});

    fireEvent.change(emailInput, {target: {value: 'invalid-email'}});
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  it('should validate password strength', async () => {
    render(<SignUpForm />, {wrapper: TestWrapper});

    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const submitButton = screen.getByRole('button', {name: /sign up/i});

    fireEvent.change(passwordInput, {target: {value: '123'}});
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/password must be at least 8 characters/i),
      ).toBeInTheDocument();
    });
  });

  it('should validate password match', async () => {
    render(<SignUpForm />, {wrapper: TestWrapper});

    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const confirmInput = screen.getByPlaceholderText(/confirm your password/i);
    const submitButton = screen.getByRole('button', {name: /sign up/i});

    fireEvent.change(passwordInput, {target: {value: 'Password123!'}});
    fireEvent.change(confirmInput, {target: {value: 'DifferentPassword!'}});
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('should validate terms acceptance', async () => {
    render(<SignUpForm />, {wrapper: TestWrapper});

    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const confirmInput = screen.getByPlaceholderText(/confirm your password/i);
    const submitButton = screen.getByRole('button', {name: /sign up/i});

    fireEvent.change(nameInput, {target: {value: 'Test User'}});
    fireEvent.change(emailInput, {target: {value: 'test@example.com'}});
    fireEvent.change(passwordInput, {target: {value: 'Password123!'}});
    fireEvent.change(confirmInput, {target: {value: 'Password123!'}});
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/you must accept the terms/i),
      ).toBeInTheDocument();
    });
  });

  it('should call onSuccess when signup succeeds', async () => {
    const mockSignUp = vi.fn().mockResolvedValue({success: true});

    render(<SignUpForm onSuccess={mockOnSuccess} onSignUp={mockSignUp} />, {
      wrapper: TestWrapper,
    });

    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const confirmInput = screen.getByPlaceholderText(/confirm your password/i);
    const termsCheckbox = screen.getByRole('checkbox', {name: /i accept/i});
    const submitButton = screen.getByRole('button', {name: /sign up/i});

    fireEvent.change(nameInput, {target: {value: 'Test User'}});
    fireEvent.change(emailInput, {target: {value: 'test@example.com'}});
    fireEvent.change(passwordInput, {target: {value: 'Password123!'}});
    fireEvent.change(confirmInput, {target: {value: 'Password123!'}});
    fireEvent.click(termsCheckbox);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith(
        'test@example.com',
        'Password123!',
        'Test User',
      );
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('should call onError when signup fails', async () => {
    const mockSignUp = vi
      .fn()
      .mockRejectedValue(new Error('Email already exists'));

    render(<SignUpForm onError={mockOnError} onSignUp={mockSignUp} />, {
      wrapper: TestWrapper,
    });

    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const confirmInput = screen.getByPlaceholderText(/confirm your password/i);
    const termsCheckbox = screen.getByRole('checkbox', {name: /i accept/i});
    const submitButton = screen.getByRole('button', {name: /sign up/i});

    fireEvent.change(nameInput, {target: {value: 'Test User'}});
    fireEvent.change(emailInput, {target: {value: 'test@example.com'}});
    fireEvent.change(passwordInput, {target: {value: 'Password123!'}});
    fireEvent.change(confirmInput, {target: {value: 'Password123!'}});
    fireEvent.click(termsCheckbox);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalled();
      expect(mockOnError).toHaveBeenCalledWith('Email already exists');
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
    });
  });

  it('should disable form during submission', async () => {
    const mockSignUp = vi.fn(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );

    render(<SignUpForm onSignUp={mockSignUp} />, {wrapper: TestWrapper});

    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const confirmInput = screen.getByPlaceholderText(/confirm your password/i);
    const termsCheckbox = screen.getByRole('checkbox', {name: /i accept/i});
    const submitButton = screen.getByRole('button', {name: /sign up/i});

    fireEvent.change(nameInput, {target: {value: 'Test User'}});
    fireEvent.change(emailInput, {target: {value: 'test@example.com'}});
    fireEvent.change(passwordInput, {target: {value: 'Password123!'}});
    fireEvent.change(confirmInput, {target: {value: 'Password123!'}});
    fireEvent.click(termsCheckbox);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(screen.getByText(/creating account/i)).toBeInTheDocument();
    });
  });

  it('should show password strength indicator', () => {
    render(<SignUpForm />, {wrapper: TestWrapper});

    const passwordInput = screen.getByPlaceholderText(/enter your password/i);

    // Weak password
    fireEvent.change(passwordInput, {target: {value: '123'}});
    expect(screen.getByText(/weak/i)).toBeInTheDocument();

    // Medium password
    fireEvent.change(passwordInput, {target: {value: 'Password'}});
    expect(screen.getByText(/medium/i)).toBeInTheDocument();

    // Strong password
    fireEvent.change(passwordInput, {target: {value: 'Password123!'}});
    expect(screen.getByText(/strong/i)).toBeInTheDocument();
  });
});
