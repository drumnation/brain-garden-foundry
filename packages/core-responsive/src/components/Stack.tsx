import type {CSSProperties, ReactNode} from 'react';
import type {Breakpoint} from '../breakpoints';
import {useBreakpoint} from '../hooks/useBreakpoint';

type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

export interface StackProps {
  /**
   * Children elements to stack
   */
  children: ReactNode;

  /**
   * Direction of the stack - can be responsive
   * @default 'vertical'
   */
  direction?: ResponsiveValue<'vertical' | 'horizontal'>;

  /**
   * Gap between items - can be responsive (in pixels)
   * @default 16
   */
  gap?: ResponsiveValue<number>;

  /**
   * Alignment of items along the cross axis - can be responsive
   */
  align?: ResponsiveValue<'start' | 'center' | 'end' | 'stretch'>;

  /**
   * Justification of items along the main axis - can be responsive
   */
  justify?: ResponsiveValue<
    | 'start'
    | 'center'
    | 'end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
  >;

  /**
   * Whether items should wrap - can be responsive
   */
  wrap?: ResponsiveValue<boolean>;

  /**
   * Additional CSS styles
   */
  style?: CSSProperties;

  /**
   * Additional className
   */
  className?: string;
}

/**
 * Stack component - Responsive flexbox layout for vertical or horizontal stacking
 *
 * @example
 * // Simple vertical stack
 * <Stack gap={16}>
 *   <Card />
 *   <Card />
 * </Stack>
 *
 * @example
 * // Responsive direction - vertical on mobile, horizontal on desktop
 * <Stack
 *   direction={{ xs: 'vertical', md: 'horizontal' }}
 *   gap={{ xs: 8, md: 16 }}
 * >
 *   <Item />
 *   <Item />
 * </Stack>
 *
 * @example
 * // Centered horizontal stack with wrapping
 * <Stack
 *   direction="horizontal"
 *   gap={12}
 *   align="center"
 *   justify="center"
 *   wrap
 * >
 *   <Button />
 *   <Button />
 *   <Button />
 * </Stack>
 */
export const Stack = ({
  children,
  direction = 'vertical',
  gap = 16,
  align,
  justify,
  wrap = false,
  style,
  className,
}: StackProps) => {
  const breakpoint = useBreakpoint();

  // Helper to resolve responsive values
  const resolveValue = <T,>(
    value: ResponsiveValue<T> | undefined,
    fallback: T,
  ): T => {
    if (value === undefined) {
      return fallback;
    }
    if (typeof value !== 'object' || value === null) {
      return value as T;
    }

    // Check if this object has any breakpoint keys - if not, it's a static value
    const responsiveValue = value as Partial<Record<Breakpoint, T>>;
    const breakpoints: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
    const hasBreakpointKeys = breakpoints.some((bp) => bp in responsiveValue);

    if (!hasBreakpointKeys) {
      // No breakpoint keys found, return as static value
      return value as T;
    }

    // Try to find value for current breakpoint or smaller
    const currentIndex = breakpoints.indexOf(breakpoint.current);

    // Search from current breakpoint down to smallest
    for (let i = currentIndex; i >= 0; i--) {
      const bp = breakpoints[i];
      if (bp && responsiveValue[bp] !== undefined) {
        return responsiveValue[bp] as T;
      }
    }

    return fallback;
  };

  const resolvedDirection = resolveValue(direction, 'vertical');
  const resolvedGap = resolveValue(gap, 16);
  const resolvedAlign = resolveValue(align, 'stretch');
  const resolvedJustify = resolveValue(justify, 'start');
  const resolvedWrap = resolveValue(wrap, false);

  const flexDirection = resolvedDirection === 'vertical' ? 'column' : 'row';
  const alignItems =
    resolvedAlign === 'start'
      ? 'flex-start'
      : resolvedAlign === 'end'
        ? 'flex-end'
        : resolvedAlign;
  const justifyContent =
    resolvedJustify === 'start'
      ? 'flex-start'
      : resolvedJustify === 'end'
        ? 'flex-end'
        : resolvedJustify;

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection,
        gap: `${resolvedGap}px`,
        alignItems,
        justifyContent,
        flexWrap: resolvedWrap ? 'wrap' : 'nowrap',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
