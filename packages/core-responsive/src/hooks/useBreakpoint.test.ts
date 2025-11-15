import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBreakpoint } from './useBreakpoint';
import { breakpoints } from '../breakpoints';

describe('useBreakpoint', () => {
  beforeEach(() => {
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    // Mock window.addEventListener/removeEventListener
    vi.spyOn(window, 'addEventListener');
    vi.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('current breakpoint detection', () => {
    it('should detect xs breakpoint for narrow viewports', () => {
      Object.defineProperty(window, 'innerWidth', { value: 500, configurable: true });
      const { result } = renderHook(() => useBreakpoint());
      expect(result.current.current).toBe('xs');
    });

    it('should detect sm breakpoint for small tablet viewports', () => {
      Object.defineProperty(window, 'innerWidth', { value: 700, configurable: true });
      const { result } = renderHook(() => useBreakpoint());
      expect(result.current.current).toBe('sm');
    });

    it('should detect md breakpoint for tablet viewports', () => {
      Object.defineProperty(window, 'innerWidth', { value: 900, configurable: true });
      const { result } = renderHook(() => useBreakpoint());
      expect(result.current.current).toBe('md');
    });

    it('should detect lg breakpoint for desktop viewports', () => {
      Object.defineProperty(window, 'innerWidth', { value: 1200, configurable: true });
      const { result } = renderHook(() => useBreakpoint());
      expect(result.current.current).toBe('lg');
    });

    it('should detect xl breakpoint for large desktop viewports', () => {
      Object.defineProperty(window, 'innerWidth', { value: 1400, configurable: true });
      const { result } = renderHook(() => useBreakpoint());
      expect(result.current.current).toBe('xl');
    });

    it('should detect 2xl breakpoint for extra large desktop viewports', () => {
      Object.defineProperty(window, 'innerWidth', { value: 1600, configurable: true });
      const { result } = renderHook(() => useBreakpoint());
      expect(result.current.current).toBe('2xl');
    });
  });

  describe('isAtLeast', () => {
    it('should return true when viewport is at or above breakpoint', () => {
      Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true });
      const { result } = renderHook(() => useBreakpoint());

      expect(result.current.isAtLeast('xs')).toBe(true);
      expect(result.current.isAtLeast('sm')).toBe(true);
      expect(result.current.isAtLeast('md')).toBe(true);
      expect(result.current.isAtLeast('lg')).toBe(true);
      expect(result.current.isAtLeast('xl')).toBe(false);
      expect(result.current.isAtLeast('2xl')).toBe(false);
    });

    it('should return true for exact breakpoint match', () => {
      Object.defineProperty(window, 'innerWidth', { value: 768, configurable: true });
      const { result } = renderHook(() => useBreakpoint());

      expect(result.current.isAtLeast('md')).toBe(true);
    });
  });

  describe('isAtMost', () => {
    it('should return true when viewport is at or below breakpoint', () => {
      Object.defineProperty(window, 'innerWidth', { value: 768, configurable: true });
      const { result } = renderHook(() => useBreakpoint());

      expect(result.current.isAtMost('xs')).toBe(false);
      expect(result.current.isAtMost('sm')).toBe(false);
      expect(result.current.isAtMost('md')).toBe(true);
      expect(result.current.isAtMost('lg')).toBe(true);
      expect(result.current.isAtMost('xl')).toBe(true);
      expect(result.current.isAtMost('2xl')).toBe(true);
    });

    it('should return true for exact breakpoint match', () => {
      Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true });
      const { result } = renderHook(() => useBreakpoint());

      expect(result.current.isAtMost('lg')).toBe(true);
    });
  });

  describe('is', () => {
    it('should return true only for exact breakpoint match', () => {
      Object.defineProperty(window, 'innerWidth', { value: 768, configurable: true });
      const { result } = renderHook(() => useBreakpoint());

      expect(result.current.is('xs')).toBe(false);
      expect(result.current.is('sm')).toBe(false);
      expect(result.current.is('md')).toBe(true);
      expect(result.current.is('lg')).toBe(false);
      expect(result.current.is('xl')).toBe(false);
      expect(result.current.is('2xl')).toBe(false);
    });
  });

  describe('resize handling', () => {
    it('should update current breakpoint on resize', () => {
      Object.defineProperty(window, 'innerWidth', { value: 500, configurable: true });
      const { result, rerender } = renderHook(() => useBreakpoint());

      expect(result.current.current).toBe('xs');

      act(() => {
        Object.defineProperty(window, 'innerWidth', { value: 1200, configurable: true });
        window.dispatchEvent(new Event('resize'));
      });

      expect(result.current.current).toBe('lg');
    });

    it('should add resize event listener on mount', () => {
      renderHook(() => useBreakpoint());
      expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    });

    it('should remove resize event listener on unmount', () => {
      const { unmount } = renderHook(() => useBreakpoint());
      unmount();
      expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    });
  });

  describe('edge cases', () => {
    it('should handle boundary values correctly', () => {
      // Test exact breakpoint values
      Object.defineProperty(window, 'innerWidth', { value: breakpoints.md, configurable: true });
      const { result: mdResult } = renderHook(() => useBreakpoint());
      expect(mdResult.current.current).toBe('md');

      Object.defineProperty(window, 'innerWidth', { value: breakpoints.md - 1, configurable: true });
      const { result: belowMdResult } = renderHook(() => useBreakpoint());
      expect(belowMdResult.current.current).toBe('sm');
    });

    it('should handle very large viewport widths', () => {
      Object.defineProperty(window, 'innerWidth', { value: 5000, configurable: true });
      const { result } = renderHook(() => useBreakpoint());
      expect(result.current.current).toBe('2xl');
    });

    it('should handle very small viewport widths', () => {
      Object.defineProperty(window, 'innerWidth', { value: 100, configurable: true });
      const { result } = renderHook(() => useBreakpoint());
      expect(result.current.current).toBe('xs');
    });
  });
});
