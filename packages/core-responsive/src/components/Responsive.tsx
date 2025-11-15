import { type ReactNode, type CSSProperties } from 'react';
import { useBreakpoint } from '../hooks/useBreakpoint';
import type { Breakpoint } from '../breakpoints';

type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

export interface ResponsiveProps {
  /**
   * Content to render for different breakpoints
   */
  children?: ResponsiveValue<ReactNode>;

  /**
   * Additional CSS styles - can be responsive
   */
  style?: ResponsiveValue<CSSProperties>;

  /**
   * Additional className - can be responsive
   */
  className?: ResponsiveValue<string>;

  /**
   * HTML element to render as
   * @default 'div'
   */
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Responsive component - Generic responsive wrapper that adapts content, styles, and classes to current breakpoint
 *
 * @example
 * // Different content per breakpoint
 * <Responsive>
 *   {{
 *     xs: <MobileNav />,
 *     md: <DesktopNav />
 *   }}
 * </Responsive>
 *
 * @example
 * // Responsive styles
 * <Responsive
 *   style={{
 *     xs: { padding: '8px' },
 *     md: { padding: '16px' },
 *     lg: { padding: '24px' }
 *   }}
 * >
 *   <Content />
 * </Responsive>
 *
 * @example
 * // Responsive className
 * <Responsive
 *   className={{
 *     xs: 'mobile-layout',
 *     md: 'tablet-layout',
 *     lg: 'desktop-layout'
 *   }}
 * >
 *   <Content />
 * </Responsive>
 *
 * @example
 * // Custom element
 * <Responsive as="section" style={{ xs: { padding: '1rem' }, lg: { padding: '2rem' } }}>
 *   <Article />
 * </Responsive>
 */
export const Responsive = ({
  children,
  style,
  className,
  as: Component = 'div',
}: ResponsiveProps) => {
  const breakpoint = useBreakpoint();

  // Helper to resolve responsive values
  const resolveValue = <T,>(value: ResponsiveValue<T> | undefined): T | undefined => {
    if (value === undefined) return undefined;
    if (typeof value !== 'object' || value === null) {
      return value as T;
    }

    // Check if this is a React element or array (not a responsive object)
    // React elements have $$typeof property, arrays have numeric keys
    const isReactElement = '$$typeof' in value || Array.isArray(value);
    if (isReactElement) {
      return value as T;
    }

    // Check if this object has any breakpoint keys - if not, it's a static value
    const responsiveValue = value as Partial<Record<Breakpoint, T>>;
    const breakpoints: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
    const hasBreakpointKeys = breakpoints.some(bp => bp in responsiveValue);

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

    return undefined;
  };

  const resolvedChildren = resolveValue(children);
  const resolvedStyle = resolveValue(style);
  const resolvedClassName = resolveValue(className);

  // Handle edge case: empty object as children
  const finalChildren = resolvedChildren !== undefined &&
                       resolvedChildren !== null &&
                       typeof resolvedChildren === 'object' &&
                       !Array.isArray(resolvedChildren) &&
                       !('$$typeof' in resolvedChildren) &&
                       Object.keys(resolvedChildren).length === 0
    ? null
    : resolvedChildren;

  return (
    <Component style={resolvedStyle} className={resolvedClassName}>
      {finalChildren}
    </Component>
  );
};
