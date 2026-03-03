import {
  Alert,
  Anchor,
  Button,
  Checkbox,
  PasswordInput,
  Progress,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import {useForm} from '@mantine/form';
import {IconAlertCircle} from '@tabler/icons-react';
import {useState} from 'react';

interface SignUpFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onSignUp?: (email: string, password: string, name: string) => Promise<any>;
  onSignInClick?: () => void;
}

function calculatePasswordStrength(password: string): {
  strength: number;
  label: string;
  color: string;
} {
  if (!password) return {strength: 0, label: '', color: 'gray'};

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
    return {strength, label: 'Weak', color: 'red'};
  } else if (strength < 60) {
    return {strength, label: 'Medium', color: 'yellow'};
  } else {
    return {strength, label: 'Strong', color: 'green'};
  }
}

export function SignUpForm({
  onSuccess,
  onError,
  onSignUp,
  onSignInClick,
}: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState({
    strength: 0,
    label: '',
    color: 'gray',
  });

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
    validate: {
      name: (value) => {
        if (!value.trim()) {
          return 'Full name is required';
        }
        return null;
      },
      email: (value) => {
        if (!value.trim()) {
          return 'Email is required';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Invalid email format';
        }
        return null;
      },
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
      acceptTerms: (value) => {
        if (!value) {
          return 'You must accept the terms and conditions';
        }
        return null;
      },
    },
  });

  const handlePasswordChange = (value: string) => {
    form.setFieldValue('password', value);
    setPasswordStrength(calculatePasswordStrength(value));
  };

  const handleSubmit = async (values: typeof form.values) => {
    setIsLoading(true);
    setError(null);

    try {
      if (onSignUp) {
        await onSignUp(values.email, values.password, values.name);
      }

      form.reset();
      setPasswordStrength({strength: 0, label: '', color: 'gray'});

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Sign up failed';
      setError(errorMessage);

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack spacing="md">
        <TextInput
          label="Full Name"
          placeholder="John Doe"
          required
          disabled={isLoading}
          {...form.getInputProps('name')}
        />

        <TextInput
          label="Email"
          placeholder="your@email.com"
          required
          disabled={isLoading}
          {...form.getInputProps('email')}
        />

        <div>
          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            required
            disabled={isLoading}
            {...form.getInputProps('password')}
            onChange={(event) =>
              handlePasswordChange(event.currentTarget.value)
            }
          />
          {form.values.password && (
            <div style={{marginTop: 5}}>
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
          label="Confirm Password"
          placeholder="Confirm your password"
          required
          disabled={isLoading}
          {...form.getInputProps('confirmPassword')}
        />

        <Checkbox
          label="I accept the terms and conditions"
          disabled={isLoading}
          {...form.getInputProps('acceptTerms', {type: 'checkbox'})}
        />

        {error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            color="red"
            title="Sign Up Failed"
          >
            {error}
          </Alert>
        )}

        <Button
          type="submit"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </Button>

        <Text size="sm" align="center" color="dimmed">
          Already have an account?{' '}
          <Anchor
            component="button"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (onSignInClick) {
                onSignInClick();
              }
            }}
          >
            Sign In
          </Anchor>
        </Text>
      </Stack>
    </form>
  );
}
