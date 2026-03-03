import {act, renderHook} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {useMediaQuery} from './useMediaQuery';

describe('useMediaQuery', () => {
  let listeners: Map<string, Set<(event: MediaQueryListEvent) => void>>;
  let matchMedia: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    listeners = new Map();

    matchMedia = vi.fn((query: string) => {
      const mql = {
        matches: false,
        media: query,
        addEventListener: vi.fn(
          (event: string, handler: (e: MediaQueryListEvent) => void) => {
            if (event === 'change') {
              if (!listeners.has(query)) {
                listeners.set(query, new Set());
              }
              listeners.get(query)?.add(handler);
            }
          },
        ),
        removeEventListener: vi.fn(
          (event: string, handler: (e: MediaQueryListEvent) => void) => {
            if (event === 'change' && listeners.has(query)) {
              listeners.get(query)?.delete(handler);
            }
          },
        ),
      };
      return mql as unknown as MediaQueryList;
    });

    window.matchMedia = matchMedia;
  });

  afterEach(() => {
    listeners.clear();
    vi.restoreAllMocks();
  });

  it('should return false initially when query does not match', () => {
    const {result} = renderHook(() => useMediaQuery('(max-width: 768px)'));
    expect(result.current).toBe(false);
  });

  it('should return true when query matches', () => {
    matchMedia.mockImplementation((query: string) => ({
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const {result} = renderHook(() => useMediaQuery('(min-width: 1024px)'));
    expect(result.current).toBe(true);
  });

  it('should update when media query changes', () => {
    const query = '(max-width: 768px)';
    const {result} = renderHook(() => useMediaQuery(query));

    expect(result.current).toBe(false);

    // Simulate media query change
    act(() => {
      const handlers = listeners.get(query);
      if (handlers) {
        handlers.forEach((handler) => {
          handler({matches: true} as MediaQueryListEvent);
        });
      }
    });

    expect(result.current).toBe(true);
  });

  it('should clean up event listener on unmount', () => {
    const query = '(max-width: 768px)';
    const removeListener = vi.fn();
    matchMedia.mockImplementation((q: string) => ({
      matches: false,
      media: q,
      addEventListener: vi.fn(),
      removeEventListener: removeListener,
    }));

    const {unmount} = renderHook(() => useMediaQuery(query));
    unmount();

    expect(removeListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('should work with orientation queries', () => {
    matchMedia.mockImplementation((query: string) => ({
      matches: query.includes('landscape'),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const {result: landscape} = renderHook(() =>
      useMediaQuery('(orientation: landscape)'),
    );
    const {result: portrait} = renderHook(() =>
      useMediaQuery('(orientation: portrait)'),
    );

    expect(landscape.current).toBe(true);
    expect(portrait.current).toBe(false);
  });

  it('should work with complex queries', () => {
    matchMedia.mockImplementation((query: string) => ({
      matches: query.includes('768px') && query.includes('1024px'),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const {result} = renderHook(() =>
      useMediaQuery('(min-width: 768px) and (max-width: 1024px)'),
    );

    expect(result.current).toBe(true);
  });
});
