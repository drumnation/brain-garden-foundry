# @bg-kit/design-system

Brain Garden Design System built on Mantine with custom design tokens and automatic dark/light mode support.

## Features

- 🎨 **Comprehensive Design Tokens** - Colors, spacing, typography
- 🌗 **Dark/Light Mode** - Automatic theme switching with system preference detection
- 🎯 **Mantine Integration** - Full access to Mantine's component library
- 📦 **TypeScript** - Full type safety
- ♿ **Accessible** - WCAG-compliant components from Mantine
- 🚀 **Zero Configuration** - Works out of the box

## Installation

This is a monorepo package. It's already available in workspace:

```json
{
  "dependencies": {
    "@bg-kit/design-system": "workspace:*"
  }
}
```

## Usage

### Basic Setup

Wrap your application with `ThemeProvider`:

```tsx
import { ThemeProvider } from '@bg-kit/design-system';

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

### With Next.js or SSR

Add `ColorSchemeScript` to prevent flash of unstyled content:

```tsx
// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';
import { ColorSchemeScript } from '@bg-kit/design-system';

export default function Document() {
  return (
    <Html>
      <Head>
        <ColorSchemeScript />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

### Using Design Tokens

Import design tokens directly:

```tsx
import { colors, spacing, typography } from '@bg-kit/design-system';

const MyComponent = () => (
  <div
    style={{
      color: colors.primary[5],
      padding: spacing.md,
      fontFamily: typography.fontFamily.sans,
    }}
  >
    Custom styled content
  </div>
);
```

### Using Mantine Components

All Mantine components are re-exported:

```tsx
import { Button, Card, Text, Stack } from '@bg-kit/design-system';

function Example() {
  return (
    <Card>
      <Stack>
        <Text size="xl" fw={700}>
          Welcome
        </Text>
        <Text c="dimmed">This uses our design system theme</Text>
        <Button>Click Me</Button>
      </Stack>
    </Card>
  );
}
```

### Accessing Theme

Use the `useTheme` hook to access current color scheme:

```tsx
import { useTheme } from '@bg-kit/design-system';

function ThemeToggle() {
  const { colorScheme, isDark, isLight } = useTheme();

  return (
    <div>
      Current theme: {colorScheme}
      {isDark && <span>🌙 Dark mode</span>}
      {isLight && <span>☀️ Light mode</span>}
    </div>
  );
}
```

### Custom Theme Overrides

Override theme properties:

```tsx
<ThemeProvider
  themeOverrides={{
    primaryColor: 'blue',
    defaultRadius: 'lg',
  }}
>
  <YourApp />
</ThemeProvider>
```

## Design Tokens

### Colors

10-shade color palettes for:
- `primary` - Main brand color
- `gray` - Neutral grays
- `success` - Success states
- `warning` - Warning states
- `error` - Error states
- `info` - Informational states

Each color has shades from 0 (lightest) to 9 (darkest).

```tsx
import { colors } from '@bg-kit/design-system';

// Use specific shade
const mainColor = colors.primary[5]; // Default shade
const lightColor = colors.primary[1]; // Very light
const darkColor = colors.primary[8]; // Very dark
```

### Spacing

Based on 4px baseline grid:

```tsx
import { spacing } from '@bg-kit/design-system';

const sizes = {
  xs: spacing.xs,   // 8px
  sm: spacing.sm,   // 12px
  md: spacing.md,   // 16px
  lg: spacing.lg,   // 24px
  xl: spacing.xl,   // 32px
  '2xl': spacing['2xl'], // 48px
  '3xl': spacing['3xl'], // 64px
};
```

### Typography

rem-based font system:

```tsx
import { typography, textStyles } from '@bg-kit/design-system';

// Font families
const sansFont = typography.fontFamily.sans;
const monoFont = typography.fontFamily.mono;

// Font sizes
const size = typography.fontSize.md; // 1rem (16px)

// Text styles
const headingStyle = textStyles.h1;
const bodyStyle = textStyles.body;
```

## Available Components

All Mantine components are available. See [Mantine documentation](https://mantine.dev) for full API.

**Layout**: Box, Container, Stack, Group, Grid, SimpleGrid, Flex
**Typography**: Title, Text
**Buttons**: Button, ActionIcon
**Inputs**: TextInput, Textarea, Select
**Feedback**: Alert, Notification
**Data Display**: Card, Paper

## Development

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Type check
pnpm typecheck

# Lint
pnpm lint
```

## Architecture

This package follows a three-layer architecture:

1. **Design Tokens** (`src/tokens/`) - Raw design values
2. **Theme** (`src/theme/`) - Mantine theme configuration
3. **Provider** (`src/provider/`) - React context provider

```
@bg-kit/design-system
├── src/
│   ├── tokens/          # Design tokens (colors, spacing, typography)
│   ├── theme/           # Mantine theme configuration
│   ├── provider/        # ThemeProvider component
│   ├── test-setup.ts    # Test utilities
│   └── index.ts         # Main export
```

## TypeScript

Full TypeScript support with exported types:

```tsx
import type {
  ThemeProviderProps,
  MantineTheme,
  MantineColorScheme,
} from '@bg-kit/design-system';
```

## License

Private monorepo package.
