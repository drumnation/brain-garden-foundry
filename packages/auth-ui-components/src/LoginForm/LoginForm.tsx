import React, { useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Stack,
  Anchor,
  Alert,
  Group,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';

export interface LoginFormProps {
  onLogin?: (email: string, password: string) => Promise<{ success: boolean }>;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  onSuccess,
  onError,
  onForgotPassword,
  onSignUp,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => {
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Invalid email format';
        }
        return null;
      },
      password: (value) => {
        if (!value) return 'Password is required';
        return null;
      },
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setIsLoading(true);
    setError(null);

    try {
      if (onLogin) {
        const result = await onLogin(values.email, values.password);
        if (result.success) {
          onSuccess?.();
        }
      } else {
        // Default behavior if no onLogin provided
        console.log('Login attempt:', values);
        onSuccess?.();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper radius="md" p="xl" withBorder>
      <Title order={2} ta="center" mb="md">
        Welcome Back
      </Title>

      <Text c="dimmed" size="sm" ta="center" mb="xl">
        Sign in to your account to continue
      </Text>

      {error && (
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Login Failed"
          color="red"
          mb="md"
          withCloseButton
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Email"
            placeholder="your@email.com"
            required
            autoComplete="email"
            {...form.getInputProps('email')}
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            autoComplete="current-password"
            {...form.getInputProps('password')}
          />

          <Group justify="space-between" mb="xs">
            <Anchor
              component="button"
              type="button"
              c="dimmed"
              onClick={onForgotPassword}
              size="sm"
            >
              Forgot password?
            </Anchor>
          </Group>

          <Button
            fullWidth
            type="submit"
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </Stack>
      </form>

      <Text c="dimmed" size="sm" ta="center" mt="md">
        Don't have an account?{' '}
        <Anchor
          component="button"
          type="button"
          size="sm"
          onClick={onSignUp}
          fw={700}
        >
          Sign up
        </Anchor>
      </Text>
    </Paper>
  );
};