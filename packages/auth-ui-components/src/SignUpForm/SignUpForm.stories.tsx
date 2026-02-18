import type {Meta, StoryObj} from '@storybook/react';
import {expect, userEvent, within} from '@storybook/test';
import {SignUpForm} from './SignUpForm';

const meta: Meta<typeof SignUpForm> = {
  title: 'Auth/SignUpForm',
  component: SignUpForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{width: '400px'}}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SignUpForm>;

// Default story
export const Default: Story = {
  args: {
    onSuccess: () => console.log('Sign up successful!'),
    onError: (error) => console.error('Sign up error:', error),
    onSignInClick: () => console.log('Navigate to sign in'),
  },
};

// With mock sign up handler
export const WithHandler: Story = {
  args: {
    onSignUp: async (email, password, name) => {
      console.log('Signing up:', {email, name});
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {success: true};
    },
    onSuccess: () => console.log('Success!'),
  },
};

// Interactive story - successful signup
export const SuccessfulSignUp: Story = {
  args: {
    onSignUp: async (email, password, name) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {success: true};
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // Fill in the form
    const nameInput = canvas.getByLabelText(/full name/i);
    const emailInput = canvas.getByLabelText(/email/i);
    const passwordInput = canvas.getByLabelText(/^password$/i);
    const confirmInput = canvas.getByLabelText(/confirm password/i);
    const termsCheckbox = canvas.getByRole('checkbox');

    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(emailInput, 'john.doe@example.com');
    await userEvent.type(passwordInput, 'SecurePassword123!');
    await userEvent.type(confirmInput, 'SecurePassword123!');
    await userEvent.click(termsCheckbox);

    // Check that password strength is shown
    await expect(canvas.getByText(/strong/i)).toBeInTheDocument();

    // Submit the form
    const submitButton = canvas.getByRole('button', {name: /sign up/i});
    await userEvent.click(submitButton);

    // Check loading state
    await expect(canvas.getByText(/creating account/i)).toBeInTheDocument();
  },
};

// Interactive story - validation errors
export const ValidationErrors: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // Try to submit empty form
    const submitButton = canvas.getByRole('button', {name: /sign up/i});
    await userEvent.click(submitButton);

    // Check for validation errors
    await expect(
      canvas.getByText(/full name is required/i),
    ).toBeInTheDocument();
    await expect(canvas.getByText(/email is required/i)).toBeInTheDocument();
    await expect(canvas.getByText(/password is required/i)).toBeInTheDocument();
    await expect(
      canvas.getByText(/you must accept the terms/i),
    ).toBeInTheDocument();
  },
};

// Email validation error
export const InvalidEmail: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const emailInput = canvas.getByLabelText(/email/i);
    await userEvent.type(emailInput, 'invalid-email');

    const submitButton = canvas.getByRole('button', {name: /sign up/i});
    await userEvent.click(submitButton);

    await expect(canvas.getByText(/invalid email format/i)).toBeInTheDocument();
  },
};

// Password mismatch
export const PasswordMismatch: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const passwordInput = canvas.getByLabelText(/^password$/i);
    const confirmInput = canvas.getByLabelText(/confirm password/i);

    await userEvent.type(passwordInput, 'Password123!');
    await userEvent.type(confirmInput, 'DifferentPassword!');

    const submitButton = canvas.getByRole('button', {name: /sign up/i});
    await userEvent.click(submitButton);

    await expect(
      canvas.getByText(/passwords do not match/i),
    ).toBeInTheDocument();
  },
};

// Weak password
export const WeakPassword: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const passwordInput = canvas.getByLabelText(/^password$/i);
    await userEvent.type(passwordInput, '123');

    await expect(canvas.getByText(/weak/i)).toBeInTheDocument();
  },
};

// API error
export const APIError: Story = {
  args: {
    onSignUp: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      throw new Error('Email already exists');
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // Fill in valid form
    const nameInput = canvas.getByLabelText(/full name/i);
    const emailInput = canvas.getByLabelText(/email/i);
    const passwordInput = canvas.getByLabelText(/^password$/i);
    const confirmInput = canvas.getByLabelText(/confirm password/i);
    const termsCheckbox = canvas.getByRole('checkbox');

    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(emailInput, 'existing@example.com');
    await userEvent.type(passwordInput, 'Password123!');
    await userEvent.type(confirmInput, 'Password123!');
    await userEvent.click(termsCheckbox);

    const submitButton = canvas.getByRole('button', {name: /sign up/i});
    await userEvent.click(submitButton);

    // Check for error message
    await new Promise((resolve) => setTimeout(resolve, 600));
    await expect(canvas.getByText(/email already exists/i)).toBeInTheDocument();
  },
};

// Mobile view
export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
