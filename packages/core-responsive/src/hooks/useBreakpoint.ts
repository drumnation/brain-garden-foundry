import {useEffect, useState} from 'react';
import {
  type Breakpoint,
  breakpoints,
  getCurrentBreakpoint,
} from '../breakpoints';

export interface UseBreakpointReturn {
  /** Current breakpoint */
  current: Breakpoint;
  /** Check if at least this breakpoint */
  isAtLeast: (bp: Breakpoint) => boolean;
  /** Check if at most this breakpoint */
  isAtMost: (bp: Breakpoint) => boolean;
  /** Check if exactly this breakpoint */
  is: (bp: Breakpoint) => boolean;
}

/**
 * Hook for current breakpoint detection
 *
 * @example
 * const { current, isAtLeast } = useBreakpoint();
 *
 * if (isAtLeast('md')) {
 *   // Desktop layout
 * } else {
 *   // Mobile layout
 * }
 */
export function useBreakpoint(): UseBreakpointReturn {
  const [current, setCurrent] = useState<Breakpoint>(() =>
    getCurrentBreakpoint(),
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setCurrent(getCurrentBreakpoint());
    };

    // Initial check
    handleResize();

    // Add listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isAtLeast = (bp: Breakpoint): boolean => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= breakpoints[bp];
  };

  const isAtMost = (bp: Breakpoint): boolean => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= breakpoints[bp];
  };

  const is = (bp: Breakpoint): boolean => {
    return current === bp;
  };

  return {
    current,
    isAtLeast,
    isAtMost,
    is,
  };
}
