import { useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Text,
  Anchor,
  Alert,
  Progress,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconCheck, IconMail } from '@tabler/icons-react';

interface PasswordResetFormProps {
  mode?: 'request' | 'confirm';
  userId?: string;
  secret?: string;
  onRequestReset?: (email: string) => Promise<any>;
  onConfirmReset?: (userId: string, secret: string, password: string) => Promise<any>;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onBackClick?: () => void;
}

function calculatePasswordStrength(password: string): {
  strength: number;
  label: string;
  color: string;
} {
  if (!password) return { strength: 0, label: '', color: 'gray' };

  let strength = 0;

  // Length check
  if (password.length >= 8) strength += 25;
  if (password.length >= 12) strength += 10;

  // Character variety checks
  if (/[a-z]/.test(password)) strength += 15;
  if (/[A-Z]/.test(password)) strength += 15;
  if (/[0-9]/.test(password)) strength += 20;
  if (/[^a-zA-Z0-9]/.test(password)) strength += 15;

  if (strength < 30) {
    return { strength, label: 'Weak', color: 'red' };
  } else if (strength < 60) {
    return { strength, label: 'Medium', color: 'yellow' };
  } else {
    return { strength, label: 'Strong', color: 'green' };
  }
}

export function PasswordResetForm({
  mode = 'request',
  userId,
  secret,
  onRequestReset,
  onConfirmReset,
  onSuccess,
  onError,
  onBackClick,
}: PasswordResetFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState({
    strength: 0,
    label: '',
    color: 'gray',
  });

  // Form for request mode (sending reset link)
  const requestForm = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: (value) => {
        if (!value.trim()) {
          return 'Email is required';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Invalid email format';
        }
        return null;
      },
    },
  });

  // Form for confirm mode (setting new password)
  const confirmForm = useForm({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validate: {
      password: (value) => {
        if (!value) {
          return 'Password is required';
        }
        if (value.length < 8) {
          return 'Password must be at least 8 characters';
        }
        return null;
      },
      confirmPassword: (value, values) => {
        if (!value) {
          return 'Please confirm your password';
        }
        if (value !== values.password) {
          return 'Passwords do not match';
        }
        return null;
      },
    },
  });

  const handlePasswordChange = (value: string) => {
    confirmForm.setFieldValue('password', value);
    setPasswordStrength(calculatePasswordStrength(value));
  };

  const handleRequestSubmit = async (values: typeof requestForm.values) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (onRequestReset) {
        await onRequestReset(values.email);
      }

      setSuccessMessage('Reset link sent! Check your email for instructions.');
      requestForm.reset();

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send reset link';
      setError(errorMessage);

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSubmit = async (values: typeof confirmForm.values) => {
    if (!userId || !secret) {
      setError('Missing reset parameters');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (onConfirmReset) {
        await onConfirmReset(userId, secret, values.password);
      }

      setSuccessMessage('Password reset successful! You can now login with your new password.');
      confirmForm.reset();
      setPasswordStrength({ strength: 0, label: '', color: 'gray' });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to reset password';
      setError(errorMessage);

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Request reset mode (send email)
  if (mode === 'request') {
    return (
      <form onSubmit={requestForm.onSubmit(handleRequestSubmit)}>
        <Stack spacing="md">
          <Text size="lg" weight={600} align="center">
            Reset Your Password
          </Text>

          <Text size="sm" color="dimmed" align="center">
            Enter your email address and we'll send you a link to reset your password.
          </Text>

          <TextInput
            label="Email"
            placeholder="your@email.com"
            icon={<IconMail size={18} />}
            required
            disabled={isLoading || !!successMessage}
            {...requestForm.getInputProps('email')}
          />

          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="red"
              title="Request Failed"
            >
              {error}
            </Alert>
          )}

          {successMessage && (
            <Alert
              icon={<IconCheck size={16} />}
              color="green"
              title="Success"
            >
              {successMessage}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            loading={isLoading}
            disabled={isLoading || !!successMessage}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>

          {onBackClick && (
            <Text size="sm" align="center" color="dimmed">
              Remember your password?{' '}
              <Anchor
                component="button"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onBackClick();
                }}
              >
                Back to Login
              </Anchor>
            </Text>
          )}
        </Stack>
      </form>
    );
  }

  // Confirm reset mode (set new password)
  return (
    <form onSubmit={confirmForm.onSubmit(handleConfirmSubmit)}>
      <Stack spacing="md">
        <Text size="lg" weight={600} align="center">
          Set New Password
        </Text>

        <Text size="sm" color="dimmed" align="center">
          Enter your new password below.
        </Text>

        <div>
          <PasswordInput
            label="New Password"
            placeholder="Enter new password"
            required
            disabled={isLoading || !!successMessage}
            {...confirmForm.getInputProps('password')}
            onChange={(event) => handlePasswordChange(event.currentTarget.value)}
          />
          {confirmForm.values.password && (
            <div style={{ marginTop: 5 }}>
              <Progress
                value={passwordStrength.strength}
                color={passwordStrength.color}
                size="xs"
                radius="xs"
              />
              <Text size="xs" color={passwordStrength.color} mt={2}>
                {passwordStrength.label}
              </Text>
            </div>
          )}
        </div>

        <PasswordInput
          label="Confirm New Password"
          placeholder="Confirm new password"
          required
          disabled={isLoading || !!successMessage}
          {...confirmForm.getInputProps('confirmPassword')}
        />

        {error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            color="red"
            title="Reset Failed"
          >
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert
            icon={<IconCheck size={16} />}
            color="green"
            title="Success"
          >
            {successMessage}
          </Alert>
        )}

        <Button
          type="submit"
          fullWidth
          loading={isLoading}
          disabled={isLoading || !!successMessage}
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </Button>

        {onBackClick && (
          <Text size="sm" align="center" color="dimmed">
            <Anchor
              component="button"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onBackClick();
              }}
            >
              Back to Login
            </Anchor>
          </Text>
        )}
      </Stack>
    </form>
  );
}