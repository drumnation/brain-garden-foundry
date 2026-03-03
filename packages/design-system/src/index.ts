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

// Re-export Mantine types
export type {
  MantineColor,
  MantineColorScheme,
  MantineSize,
  MantineSpacing,
  MantineTheme,
} from '@mantine/core';
// Re-export commonly used Mantine components and hooks
export {
  ActionIcon,
  // Feedback
  Alert,
  Badge,
  // Layout
  Box,
  // Buttons
  Button,
  // Data Display
  Card,
  Container,
  Flex,
  Grid,
  Group,
  Notification,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  // Inputs
  TextInput,
  ThemeIcon,
  // Typography
  Title,
  useMantineColorScheme,
  // Hooks
  useMantineTheme,
} from '@mantine/core';
export type {ThemeProviderProps} from './provider';
// Provider and theme exports
export {ColorSchemeScript, ThemeProvider, useTheme} from './provider';
export {theme} from './theme';
// Design token exports
export {colorRoles, colors} from './tokens/colors';
export {componentSpacing, spacing} from './tokens/spacing';
export {textStyles, typography} from './tokens/typography';
