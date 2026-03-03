import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {LoginForm} from './LoginForm';

describe('LoginForm', () => {
  const mockOnSuccess = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render email and password inputs', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /sign in/i})).toBeInTheDocument();
  });

  it('should show forgot password link', () => {
    render(<LoginForm />);

    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
  });

  it('should show sign up link', () => {
    render(<LoginForm />);

    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  it('should validate email format', async () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', {name: /sign in/i});

    fireEvent.change(emailInput, {target: {value: 'invalid-email'}});
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  it('should validate password requirement', async () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', {name: /sign in/i});

    fireEvent.change(emailInput, {target: {value: 'test@example.com'}});
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('should call onSuccess when login succeeds', async () => {
    const mockLogin = vi.fn().mockResolvedValue({success: true});

    render(<LoginForm onSuccess={mockOnSuccess} onLogin={mockLogin} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', {name: /sign in/i});

    fireEvent.change(emailInput, {target: {value: 'test@example.com'}});
    fireEvent.change(passwordInput, {target: {value: 'Password123!'}});
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        'test@example.com',
        'Password123!',
      );
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('should call onError when login fails', async () => {
    const mockLogin = vi
      .fn()
      .mockRejectedValue(new Error('Invalid credentials'));

    render(<LoginForm onError={mockOnError} onLogin={mockLogin} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', {name: /sign in/i});

    fireEvent.change(emailInput, {target: {value: 'test@example.com'}});
    fireEvent.change(passwordInput, {target: {value: 'WrongPassword'}});
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockOnError).toHaveBeenCalledWith('Invalid credentials');
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('should disable form during submission', async () => {
    const mockLogin = vi.fn(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );

    render(<LoginForm onLogin={mockLogin} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', {name: /sign in/i});

    fireEvent.change(emailInput, {target: {value: 'test@example.com'}});
    fireEvent.change(passwordInput, {target: {value: 'Password123!'}});
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    });
  });

  it('should show password toggle button', () => {
    render(<LoginForm />);

    const toggleButton = screen.getByRole('button', {name: /show password/i});
    expect(toggleButton).toBeInTheDocument();

    const passwordInput = screen.getByLabelText(
      /password/i,
    ) as HTMLInputElement;
    expect(passwordInput.type).toBe('password');

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });
});
