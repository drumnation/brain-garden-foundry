import type { Meta, StoryObj } from '@storybook/react';
import { PasswordResetForm } from './PasswordResetForm';
import { within, userEvent, expect } from '@storybook/test';

const meta: Meta<typeof PasswordResetForm> = {
  title: 'Auth/PasswordResetForm',
  component: PasswordResetForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PasswordResetForm>;

// Request reset mode stories
export const RequestReset: Story = {
  args: {
    mode: 'request',
    onSuccess: () => console.log('Reset link sent!'),
    onError: (error) => console.error('Error:', error),
    onBackClick: () => console.log('Navigate to login'),
  },
};

export const RequestWithHandler: Story = {
  args: {
    mode: 'request',
    onRequestReset: async (email) => {
      console.log('Requesting reset for:', email);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    },
  },
};

// Confirm reset mode stories
export const ConfirmReset: Story = {
  args: {
    mode: 'confirm',
    userId: 'user123',
    secret: 'secret123',
    onSuccess: () => console.log('Password reset successful!'),
    onError: (error) => console.error('Error:', error),
    onBackClick: () => console.log('Navigate to login'),
  },
};

export const ConfirmWithHandler: Story = {
  args: {
    mode: 'confirm',
    userId: 'user123',
    secret: 'secret123',
    onConfirmReset: async (userId, secret, password) => {
      console.log('Resetting password for:', userId);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    },
  },
};

// Interactive stories
export const RequestResetFlow: Story = {
  args: {
    mode: 'request',
    onRequestReset: async (email) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Fill in email
    const emailInput = canvas.getByLabelText(/email/i);
    await userEvent.type(emailInput, 'user@example.com');

    // Submit form
    const submitButton = canvas.getByRole('button', { name: /send reset link/i });
    await userEvent.click(submitButton);

    // Check loading state
    await expect(canvas.getByText(/sending/i)).toBeInTheDocument();

    // Check success message
    await new Promise((resolve) => setTimeout(resolve, 1100));
    await expect(canvas.getByText(/reset link sent/i)).toBeInTheDocument();
  },
};

export const RequestInvalidEmail: Story = {
  args: {
    mode: 'request',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Try invalid email
    const emailInput = canvas.getByLabelText(/email/i);
    await userEvent.type(emailInput, 'invalid-email');

    const submitButton = canvas.getByRole('button', { name: /send reset link/i });
    await userEvent.click(submitButton);

    // Check error message
    await expect(canvas.getByText(/invalid email format/i)).toBeInTheDocument();
  },
};

export const RequestAPIError: Story = {
  args: {
    mode: 'request',
    onRequestReset: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      throw new Error('User not found');
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Fill in email
    const emailInput = canvas.getByLabelText(/email/i);
    await userEvent.type(emailInput, 'nonexistent@example.com');

    // Submit
    const submitButton = canvas.getByRole('button', { name: /send reset link/i });
    await userEvent.click(submitButton);

    // Check error
    await new Promise((resolve) => setTimeout(resolve, 600));
    await expect(canvas.getByText(/user not found/i)).toBeInTheDocument();
  },
};

export const ConfirmResetFlow: Story = {
  args: {
    mode: 'confirm',
    userId: 'user123',
    secret: 'secret123',
    onConfirmReset: async (userId, secret, password) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Fill in passwords
    const passwordInput = canvas.getByPlaceholderText(/enter new password/i);
    const confirmInput = canvas.getByPlaceholderText(/confirm new password/i);

    await userEvent.type(passwordInput, 'NewPassword123!');
    await userEvent.type(confirmInput, 'NewPassword123!');

    // Check password strength
    await expect(canvas.getByText(/strong/i)).toBeInTheDocument();

    // Submit
    const submitButton = canvas.getByRole('button', { name: /reset password/i });
    await userEvent.click(submitButton);

    // Check loading
    await expect(canvas.getByText(/resetting/i)).toBeInTheDocument();

    // Check success
    await new Promise((resolve) => setTimeout(resolve, 1100));
    await expect(canvas.getByText(/password reset successful/i)).toBeInTheDocument();
  },
};

export const ConfirmPasswordMismatch: Story = {
  args: {
    mode: 'confirm',
    userId: 'user123',
    secret: 'secret123',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Fill in mismatched passwords
    const passwordInput = canvas.getByPlaceholderText(/enter new password/i);
    const confirmInput = canvas.getByPlaceholderText(/confirm new password/i);

    await userEvent.type(passwordInput, 'Password123!');
    await userEvent.type(confirmInput, 'DifferentPassword!');

    // Submit
    const submitButton = canvas.getByRole('button', { name: /reset password/i });
    await userEvent.click(submitButton);

    // Check error
    await expect(canvas.getByText(/passwords do not match/i)).toBeInTheDocument();
  },
};

export const WeakPasswordStrength: Story = {
  args: {
    mode: 'confirm',
    userId: 'user123',
    secret: 'secret123',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const passwordInput = canvas.getByPlaceholderText(/enter new password/i);

    // Test weak password
    await userEvent.type(passwordInput, '123');
    await expect(canvas.getByText(/weak/i)).toBeInTheDocument();

    // Clear and test medium password
    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, 'Password');
    await expect(canvas.getByText(/medium/i)).toBeInTheDocument();

    // Clear and test strong password
    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, 'Password123!');
    await expect(canvas.getByText(/strong/i)).toBeInTheDocument();
  },
};

export const ConfirmAPIError: Story = {
  args: {
    mode: 'confirm',
    userId: 'user123',
    secret: 'invalid-secret',
    onConfirmReset: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      throw new Error('Invalid reset token');
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Fill in passwords
    const passwordInput = canvas.getByPlaceholderText(/enter new password/i);
    const confirmInput = canvas.getByPlaceholderText(/confirm new password/i);

    await userEvent.type(passwordInput, 'NewPassword123!');
    await userEvent.type(confirmInput, 'NewPassword123!');

    // Submit
    const submitButton = canvas.getByRole('button', { name: /reset password/i });
    await userEvent.click(submitButton);

    // Check error
    await new Promise((resolve) => setTimeout(resolve, 600));
    await expect(canvas.getByText(/invalid reset token/i)).toBeInTheDocument();
  },
};

// Mobile view
export const MobileRequestView: Story = {
  args: {
    mode: 'request',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const MobileConfirmView: Story = {
  args: {
    mode: 'confirm',
    userId: 'user123',
    secret: 'secret123',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};