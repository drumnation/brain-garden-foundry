/**
 * Design tokens: Spacing
 *
 * Consistent spacing scale based on 4px baseline grid.
 */

export const spacing = {
  xs: '0.5rem', // 8px
  sm: '0.75rem', // 12px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '3rem', // 48px
  '3xl': '4rem', // 64px
} as const;

/**
 * Component-specific spacing
 */
export const componentSpacing = {
  // Padding
  padding: {
    input: spacing.sm,
    button: `${spacing.sm} ${spacing.md}`,
    card: spacing.md,
    section: spacing.xl,
  },

  // Gaps
  gap: {
    tight: spacing.xs,
    normal: spacing.sm,
    loose: spacing.md,
    relaxed: spacing.lg,
  },

  // Margins
  margin: {
    section: spacing['2xl'],
    element: spacing.md,
  },
} as const;
