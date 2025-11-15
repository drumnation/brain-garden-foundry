import { createTheme, MantineColorsTuple } from '@mantine/core';
import { colors, spacing, typography } from '../tokens';

/**
 * Brain Garden Design System Theme
 *
 * Mantine theme configuration with custom design tokens.
 * Supports automatic dark/light mode switching.
 */
export const theme = createTheme({
  /**
   * Color system
   */
  colors: {
    primary: colors.primary as MantineColorsTuple,
    gray: colors.gray as MantineColorsTuple,
    success: colors.success as MantineColorsTuple,
    warning: colors.warning as MantineColorsTuple,
    error: colors.error as MantineColorsTuple,
    info: colors.info as MantineColorsTuple,
  },

  /**
   * Primary color (used for links, buttons, etc.)
   */
  primaryColor: 'primary',

  /**
   * Typography
   */
  fontFamily: typography.fontFamily.sans,
  fontFamilyMonospace: typography.fontFamily.mono,

  fontSizes: {
    xs: typography.fontSize.xs,
    sm: typography.fontSize.sm,
    md: typography.fontSize.md,
    lg: typography.fontSize.lg,
    xl: typography.fontSize.xl,
  },

  lineHeights: {
    xs: String(typography.lineHeight.tight),
    sm: String(typography.lineHeight.tight),
    md: String(typography.lineHeight.normal),
    lg: String(typography.lineHeight.normal),
    xl: String(typography.lineHeight.relaxed),
  },

  /**
   * Spacing system
   */
  spacing: {
    xs: spacing.xs,
    sm: spacing.sm,
    md: spacing.md,
    lg: spacing.lg,
    xl: spacing.xl,
  },

  /**
   * Border radius
   */
  radius: {
    xs: '0.125rem', // 2px
    sm: '0.25rem',  // 4px
    md: '0.5rem',   // 8px
    lg: '0.75rem',  // 12px
    xl: '1rem',     // 16px
  },

  /**
   * Default border radius for components
   */
  defaultRadius: 'md',

  /**
   * Shadow system
   */
  shadows: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },

  /**
   * Heading styles
   */
  headings: {
    fontFamily: typography.fontFamily.sans,
    fontWeight: String(typography.fontWeight.bold),
    sizes: {
      h1: {
        fontSize: typography.fontSize['4xl'],
        lineHeight: String(typography.lineHeight.tight),
      },
      h2: {
        fontSize: typography.fontSize['3xl'],
        lineHeight: String(typography.lineHeight.tight),
      },
      h3: {
        fontSize: typography.fontSize['2xl'],
        lineHeight: String(typography.lineHeight.tight),
      },
      h4: {
        fontSize: typography.fontSize.xl,
        lineHeight: String(typography.lineHeight.normal),
      },
      h5: {
        fontSize: typography.fontSize.lg,
        lineHeight: String(typography.lineHeight.normal),
      },
      h6: {
        fontSize: typography.fontSize.md,
        lineHeight: String(typography.lineHeight.normal),
      },
    },
  },

  /**
   * Component-specific overrides
   */
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    Input: {
      defaultProps: {
        radius: 'md',
      },
    },
    Card: {
      defaultProps: {
        radius: 'md',
        shadow: 'sm',
      },
    },
  },
});
