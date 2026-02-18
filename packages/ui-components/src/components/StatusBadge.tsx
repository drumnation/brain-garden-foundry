import {Badge} from '@bg-kit/design-system';
import type {ReactNode} from 'react';

export interface StatusBadgeProps {
  /** Status variant */
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral';

  /** Badge label */
  children: ReactNode;

  /** Optional icon */
  leftSection?: ReactNode;

  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const statusColorMap = {
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
  neutral: 'gray',
} as const;

/**
 * StatusBadge Component
 *
 * A badge component for displaying status with semantic colors
 * from the design system.
 *
 * @example
 * ```tsx
 * <StatusBadge status="success">Active</StatusBadge>
 * <StatusBadge status="warning" size="lg">Pending</StatusBadge>
 * <StatusBadge status="error" leftSection={<Icon />}>Failed</StatusBadge>
 * ```
 */
export function StatusBadge({
  status,
  children,
  leftSection,
  size = 'md',
}: StatusBadgeProps) {
  return (
    <Badge
      color={statusColorMap[status]}
      variant="light"
      size={size}
      leftSection={leftSection}
    >
      {children}
    </Badge>
  );
}
