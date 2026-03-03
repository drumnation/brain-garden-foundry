import {
  Button,
  Card,
  Group,
  Stack,
  Text,
  ThemeIcon,
} from '@bg-kit/design-system';
import type {ReactNode} from 'react';

export interface FeatureCardProps {
  /** Icon to display */
  icon: ReactNode;

  /** Feature title */
  title: string;

  /** Feature description */
  description: string;

  /** Optional action button text */
  actionLabel?: string;

  /** Optional action button click handler */
  onAction?: () => void;

  /** Color variant for the icon */
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info';
}

/**
 * FeatureCard Component
 *
 * A card component for displaying features with an icon, title, description,
 * and optional action button. Fully themed with the design system.
 *
 * @example
 * ```tsx
 * <FeatureCard
 *   icon={<IconRocket />}
 *   title="Fast Performance"
 *   description="Lightning-fast load times with optimized builds"
 *   actionLabel="Learn More"
 *   onAction={() => console.log('clicked')}
 *   variant="primary"
 * />
 * ```
 */
export function FeatureCard({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'primary',
}: FeatureCardProps) {
  return (
    <Card padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <ThemeIcon size={60} radius="md" variant="light" color={variant}>
          {icon}
        </ThemeIcon>

        <div>
          <Text size="lg" fw={600} mb="xs">
            {title}
          </Text>
          <Text size="sm" c="dimmed">
            {description}
          </Text>
        </div>

        {actionLabel && onAction && (
          <Group justify="flex-start" mt="md">
            <Button variant="light" color={variant} onClick={onAction}>
              {actionLabel}
            </Button>
          </Group>
        )}
      </Stack>
    </Card>
  );
}
