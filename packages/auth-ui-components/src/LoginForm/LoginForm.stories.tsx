import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import { MantineProvider } from '@mantine/core';
import { LoginForm } from './LoginForm';

const meta = {
  title: 'Auth/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <MantineProvider>
        <div style={{ width: '400px' }}>
          <Story />
        </div>
      </MantineProvider>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    onLogin: { action: 'login' },
    onSuccess: { action: 'success' },
    onError: { action: 'error' },
    onForgotPassword: { action: 'forgot-password' },
    onSignUp: { action: 'sign-up' },
  },
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {},
};

// Story with successful login
export const SuccessfulLogin: Story = {
  args: {
    onLogin: async (email, password) => {
      console.log('Login attempt:', { email, password });
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Fill in the form
    const emailInput = canvas.getByLabelText(/email/i);
    const passwordInput = canvas.getByLabelText(/password/i);

    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.type(passwordInput, 'Password123!');

    // Submit the form
    const submitButton = canvas.getByRole('button', { name: /sign in/i });
    await userEvent.click(submitButton);

    // Check that loading state appears
    await expect(canvas.getByText(/signing in/i)).toBeInTheDocument();

    // Wait for success
    await new Promise(resolve => setTimeout(resolve, 1500));
    expect(args.onSuccess).toHaveBeenCalled();
  },
};

// Story with failed login
export const FailedLogin: Story = {
  args: {
    onLogin: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      throw new Error('Invalid credentials');
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Fill in the form
    const emailInput = canvas.getByLabelText(/email/i);
    const passwordInput = canvas.getByLabelText(/password/i);

    await userEvent.type(emailInput, 'wrong@example.com');
    await userEvent.type(passwordInput, 'WrongPassword');

    // Submit the form
    const submitButton = canvas.getByRole('button', { name: /sign in/i });
    await userEvent.click(submitButton);

    // Wait for error message
    await new Promise(resolve => setTimeout(resolve, 1500));
    await expect(canvas.getByText(/invalid credentials/i)).toBeInTheDocument();
  },
};

// Story with validation errors
export const ValidationErrors: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Try to submit without filling form
    const submitButton = canvas.getByRole('button', { name: /sign in/i });
    await userEvent.click(submitButton);

    // Check validation messages
    await expect(canvas.getByText(/email is required/i)).toBeInTheDocument();
    await expect(canvas.getByText(/password is required/i)).toBeInTheDocument();

    // Try with invalid email
    const emailInput = canvas.getByLabelText(/email/i);
    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.click(submitButton);

    await expect(canvas.getByText(/invalid email format/i)).toBeInTheDocument();
  },
};

// Story with loading state
export const LoadingState: Story = {
  args: {
    onLogin: () => new Promise(() => {}), // Never resolves to show loading state
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Fill in the form
    const emailInput = canvas.getByLabelText(/email/i);
    const passwordInput = canvas.getByLabelText(/password/i);

    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.type(passwordInput, 'Password123!');

    // Submit the form
    const submitButton = canvas.getByRole('button', { name: /sign in/i });
    await userEvent.click(submitButton);

    // Check loading state
    await expect(canvas.getByText(/signing in/i)).toBeInTheDocument();
    await expect(submitButton).toBeDisabled();
  },
};

// Story showing password visibility toggle
export const PasswordVisibilityToggle: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const passwordInput = canvas.getByLabelText(/password/i) as HTMLInputElement;

    // Initially password should be hidden
    expect(passwordInput.type).toBe('password');

    // Click the visibility toggle
    const toggleButton = canvas.getByRole('button', { name: /show password/i });
    await userEvent.click(toggleButton);

    // Password should now be visible
    expect(passwordInput.type).toBe('text');

    // Click again to hide
    await userEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  },
};

// Story with all interactions
export const InteractiveDemo: Story = {
  args: {
    onLogin: async (email, password) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (email === 'demo@example.com' && password === 'Demo123!') {
        return { success: true };
      }
      throw new Error('Invalid credentials. Try demo@example.com / Demo123!');
    },
  },
};