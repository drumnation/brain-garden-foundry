import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { PasswordResetForm } from './PasswordResetForm';

// Wrapper component for tests
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <MantineProvider>{children}</MantineProvider>;
}

describe('PasswordResetForm', () => {
  const mockOnSuccess = vi.fn();
  const mockOnError = vi.fn();
  const mockOnBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Request Reset Mode', () => {
    it('should render email input and submit button', () => {
      render(<PasswordResetForm />, { wrapper: TestWrapper });

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
    });

    it('should show back to login link', () => {
      render(<PasswordResetForm onBackClick={mockOnBack} />, { wrapper: TestWrapper });

      const backLink = screen.getByText(/back to login/i);
      expect(backLink).toBeInTheDocument();
    });

    it('should validate email format', async () => {
      render(<PasswordResetForm />, { wrapper: TestWrapper });

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /send reset link/i });

      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
      });
    });

    it('should call onRequestReset when form is valid', async () => {
      const mockRequestReset = vi.fn().mockResolvedValue({ success: true });

      render(
        <PasswordResetForm
          onRequestReset={mockRequestReset}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: TestWrapper }
      );

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /send reset link/i });

      fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockRequestReset).toHaveBeenCalledWith('user@example.com');
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });

    it('should show success message after reset link sent', async () => {
      const mockRequestReset = vi.fn().mockResolvedValue({ success: true });

      render(<PasswordResetForm onRequestReset={mockRequestReset} />, { wrapper: TestWrapper });

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /send reset link/i });

      fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/reset link sent/i)).toBeInTheDocument();
        expect(screen.getByText(/check your email/i)).toBeInTheDocument();
      });
    });

    it('should handle request reset error', async () => {
      const mockRequestReset = vi.fn().mockRejectedValue(new Error('User not found'));

      render(
        <PasswordResetForm
          onRequestReset={mockRequestReset}
          onError={mockOnError}
        />,
        { wrapper: TestWrapper }
      );

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /send reset link/i });

      fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith('User not found');
        expect(screen.getByText(/user not found/i)).toBeInTheDocument();
      });
    });

    it('should disable form during submission', async () => {
      const mockRequestReset = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)));

      render(<PasswordResetForm onRequestReset={mockRequestReset} />, { wrapper: TestWrapper });

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /send reset link/i });

      fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
        expect(screen.getByText(/sending/i)).toBeInTheDocument();
      });
    });
  });

  describe('Confirm Reset Mode', () => {
    const defaultProps = {
      mode: 'confirm' as const,
      userId: 'user123',
      secret: 'secret123',
    };

    it('should render new password and confirm password fields', () => {
      render(<PasswordResetForm {...defaultProps} />, { wrapper: TestWrapper });

      expect(screen.getByPlaceholderText(/enter new password/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/confirm new password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /reset password/i })).toBeInTheDocument();
    });

    it('should validate password strength', async () => {
      render(<PasswordResetForm {...defaultProps} />, { wrapper: TestWrapper });

      const passwordInput = screen.getByPlaceholderText(/enter new password/i);
      const submitButton = screen.getByRole('button', { name: /reset password/i });

      fireEvent.change(passwordInput, { target: { value: '123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
      });
    });

    it('should validate password match', async () => {
      render(<PasswordResetForm {...defaultProps} />, { wrapper: TestWrapper });

      const passwordInput = screen.getByPlaceholderText(/enter new password/i);
      const confirmInput = screen.getByPlaceholderText(/confirm new password/i);
      const submitButton = screen.getByRole('button', { name: /reset password/i });

      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.change(confirmInput, { target: { value: 'DifferentPassword!' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });
    });

    it('should call onConfirmReset when form is valid', async () => {
      const mockConfirmReset = vi.fn().mockResolvedValue({ success: true });

      render(
        <PasswordResetForm
          {...defaultProps}
          onConfirmReset={mockConfirmReset}
          onSuccess={mockOnSuccess}
        />,
        { wrapper: TestWrapper }
      );

      const passwordInput = screen.getByPlaceholderText(/enter new password/i);
      const confirmInput = screen.getByPlaceholderText(/confirm new password/i);
      const submitButton = screen.getByRole('button', { name: /reset password/i });

      fireEvent.change(passwordInput, { target: { value: 'NewPassword123!' } });
      fireEvent.change(confirmInput, { target: { value: 'NewPassword123!' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockConfirmReset).toHaveBeenCalledWith(
          'user123',
          'secret123',
          'NewPassword123!'
        );
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });

    it('should show success message after password reset', async () => {
      const mockConfirmReset = vi.fn().mockResolvedValue({ success: true });

      render(
        <PasswordResetForm
          {...defaultProps}
          onConfirmReset={mockConfirmReset}
        />,
        { wrapper: TestWrapper }
      );

      const passwordInput = screen.getByPlaceholderText(/enter new password/i);
      const confirmInput = screen.getByPlaceholderText(/confirm new password/i);
      const submitButton = screen.getByRole('button', { name: /reset password/i });

      fireEvent.change(passwordInput, { target: { value: 'NewPassword123!' } });
      fireEvent.change(confirmInput, { target: { value: 'NewPassword123!' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/password reset successful/i)).toBeInTheDocument();
        expect(screen.getByText(/you can now login/i)).toBeInTheDocument();
      });
    });

    it('should handle confirm reset error', async () => {
      const mockConfirmReset = vi.fn().mockRejectedValue(new Error('Invalid reset token'));

      render(
        <PasswordResetForm
          {...defaultProps}
          onConfirmReset={mockConfirmReset}
          onError={mockOnError}
        />,
        { wrapper: TestWrapper }
      );

      const passwordInput = screen.getByPlaceholderText(/enter new password/i);
      const confirmInput = screen.getByPlaceholderText(/confirm new password/i);
      const submitButton = screen.getByRole('button', { name: /reset password/i });

      fireEvent.change(passwordInput, { target: { value: 'NewPassword123!' } });
      fireEvent.change(confirmInput, { target: { value: 'NewPassword123!' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith('Invalid reset token');
        expect(screen.getByText(/invalid reset token/i)).toBeInTheDocument();
      });
    });

    it('should show password strength indicator', () => {
      render(<PasswordResetForm {...defaultProps} />, { wrapper: TestWrapper });

      const passwordInput = screen.getByPlaceholderText(/enter new password/i);

      // Weak password
      fireEvent.change(passwordInput, { target: { value: '123' } });
      expect(screen.getByText(/weak/i)).toBeInTheDocument();

      // Medium password
      fireEvent.change(passwordInput, { target: { value: 'Password' } });
      expect(screen.getByText(/medium/i)).toBeInTheDocument();

      // Strong password
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      expect(screen.getByText(/strong/i)).toBeInTheDocument();
    });
  });
});