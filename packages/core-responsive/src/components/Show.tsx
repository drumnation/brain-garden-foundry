import type {ReactNode} from 'react';
import type {Breakpoint} from '../breakpoints';
import {useBreakpoint} from '../hooks/useBreakpoint';

export interface ShowProps {
  /**
   * Breakpoint(s) at which to show children.
   * Can be a single breakpoint or array of breakpoints.
   */
  above?: Breakpoint | Breakpoint[];

  /**
   * Breakpoint(s) at which to show children.
   * Can be a single breakpoint or array of breakpoints.
   */
  below?: Breakpoint | Breakpoint[];

  /**
   * Exact breakpoint(s) at which to show children.
   * Can be a single breakpoint or array of breakpoints.
   */
  at?: Breakpoint | Breakpoint[];

  /**
   * Content to render when condition matches
   */
  children: ReactNode;

  /**
   * Optional fallback content when condition doesn't match
   */
  fallback?: ReactNode;
}

/**
 * Show component - Conditionally renders children based on current breakpoint
 *
 * @example
 * // Show only on mobile
 * <Show below="sm">Mobile content</Show>
 *
 * @example
 * // Show only on desktop
 * <Show above="md">Desktop content</Show>
 *
 * @example
 * // Show only at specific breakpoint
 * <Show at="lg">Large screen content</Show>
 *
 * @example
 * // Multiple breakpoints
 * <Show at={['xs', 'sm']}>Mobile and small tablet content</Show>
 *
 * @example
 * // With fallback
 * <Show above="md" fallback={<MobileNav />}>
 *   <DesktopNav />
 * </Show>
 */
export const Show = ({
  above,
  below,
  at,
  children,
  fallback = null,
}: ShowProps) => {
  const breakpoint = useBreakpoint();

  // Helper to normalize single value or array
  const toArray = <T,>(value: T | T[] | undefined): T[] => {
    if (value === undefined) return [];
    return Array.isArray(value) ? value : [value];
  };

  // Check if current breakpoint matches any condition
  const shouldShow = (): boolean => {
    // If 'at' is specified, check exact match
    if (at !== undefined) {
      const atBreakpoints = toArray(at);
      return atBreakpoints.some((bp) => breakpoint.is(bp));
    }

    // If 'above' is specified, check if current is at or above any
    if (above !== undefined) {
      const aboveBreakpoints = toArray(above);
      const matchesAbove = aboveBreakpoints.some((bp) =>
        breakpoint.isAtLeast(bp),
      );

      // If 'below' is also specified, must be in range
      if (below !== undefined) {
        const belowBreakpoints = toArray(below);
        const matchesBelow = belowBreakpoints.some((bp) =>
          breakpoint.isAtMost(bp),
        );
        return matchesAbove && matchesBelow;
      }

      return matchesAbove;
    }

    // If only 'below' is specified
    if (below !== undefined) {
      const belowBreakpoints = toArray(below);
      return belowBreakpoints.some((bp) => breakpoint.isAtMost(bp));
    }

    // No conditions specified, always show
    return true;
  };

  return shouldShow() ? children : fallback;
};
