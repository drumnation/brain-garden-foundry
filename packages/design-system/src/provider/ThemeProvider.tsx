import {
  ColorSchemeScript,
  createTheme,
  type MantineColorScheme,
  MantineProvider,
} from '@mantine/core';
import {useColorScheme, useLocalStorage} from '@mantine/hooks';
import type {ReactNode} from 'react';
import {theme as baseTheme} from '../theme';

/**
 * Props for ThemeProvider component
 */
export interface ThemeProviderProps {
  /** Child components to render */
  children: ReactNode;

  /** Initial color scheme (defaults to 'auto' which detects system preference) */
  defaultColorScheme?: MantineColorScheme;

  /** Optional theme overrides */
  themeOverrides?: Parameters<typeof createTheme>[0];
}

/**
 * Theme Provider Component
 *
 * Wraps the application with Mantine's theme system and provides
 * automatic dark/light mode support with system preference detection.
 *
 * @example
 * ```tsx
 * import { ThemeProvider } from '@bg-kit/design-system';
 *
 * function App() {
 *   return (
 *     <ThemeProvider>
 *       <YourApp />
 *     </ThemeProvider>
 *   );
 * }
 * ```
 *
 * @example With custom default color scheme
 * ```tsx
 * <ThemeProvider defaultColorScheme="dark">
 *   <YourApp />
 * </ThemeProvider>
 * ```
 *
 * @example With theme overrides
 * ```tsx
 * <ThemeProvider themeOverrides={{ primaryColor: 'blue' }}>
 *   <YourApp />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({
  children,
  defaultColorScheme = 'auto',
  themeOverrides,
}: ThemeProviderProps) {
  // Persist color scheme preference in localStorage
  const [colorScheme, setColorScheme] = useLocalStorage<MantineColorScheme>({
    key: 'bg-color-scheme',
    defaultValue: defaultColorScheme,
    getInitialValueInEffect: true,
  });

  // Merge base theme with any overrides
  const finalTheme = themeOverrides
    ? createTheme({...baseTheme, ...themeOverrides})
    : baseTheme;

  return (
    <MantineProvider theme={finalTheme} defaultColorScheme={colorScheme}>
      {children}
    </MantineProvider>
  );
}

/**
 * Hook to access and control the current color scheme
 *
 * @example
 * ```tsx
 * import { useTheme } from '@bg-kit/design-system';
 *
 * function ThemeToggle() {
 *   const { colorScheme, toggleColorScheme } = useTheme();
 *
 *   return (
 *     <button onClick={toggleColorScheme}>
 *       Current: {colorScheme}
 *     </button>
 *   );
 * }
 * ```
 */
export function useTheme() {
  const colorScheme = useColorScheme();

  return {
    colorScheme,
    isDark: colorScheme === 'dark',
    isLight: colorScheme === 'light',
  };
}

/**
 * Export ColorSchemeScript for use in HTML head
 * This prevents flash of unstyled content on page load
 *
 * @example In your HTML or Next.js _document.tsx:
 * ```tsx
 * import { ColorSchemeScript } from '@bg-kit/design-system';
 *
 * export default function Document() {
 *   return (
 *     <html>
 *       <head>
 *         <ColorSchemeScript />
 *       </head>
 *       <body>
 *         <Main />
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export {ColorSchemeScript};
