/**
 * Brain Garden Design System
 *
 * A comprehensive design system built on Mantine with custom tokens
 * and automatic dark/light mode support.
 *
 * @example
 * ```tsx
 * import { ThemeProvider, useTheme } from '@bg-kit/design-system';
 * import { colors, spacing, typography } from '@bg-kit/design-system/tokens';
 *
 * function App() {
 *   return (
 *     <ThemeProvider>
 *       <YourApp />
 *     </ThemeProvider>
 *   );
 * }
 * ```
 */

// Provider and theme exports
export { ThemeProvider, ColorSchemeScript, useTheme } from './provider';
export type { ThemeProviderProps } from './provider';
export { theme } from './theme';

// Design token exports
export { colors, colorRoles } from './tokens/colors';
export { spacing, componentSpacing } from './tokens/spacing';
export { typography, textStyles } from './tokens/typography';

// Re-export commonly used Mantine components and hooks
export {
  // Layout
  Box,
  Container,
  Stack,
  Group,
  Grid,
  SimpleGrid,
  Flex,
  // Typography
  Title,
  Text,
  // Buttons
  Button,
  ActionIcon,
  // Inputs
  TextInput,
  Textarea,
  Select,
  // Feedback
  Alert,
  Notification,
  // Data Display
  Card,
  Paper,
  Badge,
  ThemeIcon,
  // Hooks
  useMantineTheme,
  useMantineColorScheme,
} from '@mantine/core';

// Re-export Mantine types
export type {
  MantineTheme,
  MantineColorScheme,
  MantineColor,
  MantineSize,
  MantineSpacing,
} from '@mantine/core';
