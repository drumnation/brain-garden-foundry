import {render, screen} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import * as breakpointHook from '../hooks/useBreakpoint';
import {Show} from './Show';

describe('Show Component', () => {
  const mockUseBreakpoint = vi.spyOn(breakpointHook, 'useBreakpoint');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('above prop', () => {
    it('should show children when current breakpoint is above specified breakpoint', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'lg',
        is: () => false,
        isAtLeast: (bp) => bp === 'md',
        isAtMost: () => false,
      });

      render(<Show above="md">Desktop content</Show>);
      expect(screen.getByText('Desktop content')).toBeInTheDocument();
    });

    it('should show fallback when current breakpoint is below specified breakpoint', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'xs',
        is: () => false,
        isAtLeast: () => false,
        isAtMost: () => true,
      });

      render(
        <Show above="md" fallback={<div>Mobile fallback</div>}>
          Desktop content
        </Show>,
      );

      expect(screen.queryByText('Desktop content')).not.toBeInTheDocument();
      expect(screen.getByText('Mobile fallback')).toBeInTheDocument();
    });

    it('should handle array of breakpoints for above', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'lg',
        is: () => false,
        isAtLeast: (bp) => bp === 'md' || bp === 'lg',
        isAtMost: () => false,
      });

      render(<Show above={['md', 'lg']}>Content</Show>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('below prop', () => {
    it('should show children when current breakpoint is below specified breakpoint', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'xs',
        is: () => false,
        isAtLeast: () => false,
        isAtMost: (bp) => bp === 'sm',
      });

      render(<Show below="sm">Mobile content</Show>);
      expect(screen.getByText('Mobile content')).toBeInTheDocument();
    });

    it('should show fallback when current breakpoint is above specified breakpoint', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'xl',
        is: () => false,
        isAtLeast: () => true,
        isAtMost: () => false,
      });

      render(
        <Show below="sm" fallback={<div>Desktop fallback</div>}>
          Mobile content
        </Show>,
      );

      expect(screen.queryByText('Mobile content')).not.toBeInTheDocument();
      expect(screen.getByText('Desktop fallback')).toBeInTheDocument();
    });

    it('should handle array of breakpoints for below', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'sm',
        is: () => false,
        isAtLeast: () => false,
        isAtMost: (bp) => bp === 'sm' || bp === 'md',
      });

      render(<Show below={['sm', 'md']}>Content</Show>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('at prop', () => {
    it('should show children when current breakpoint matches exactly', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'md',
        is: (bp) => bp === 'md',
        isAtLeast: () => false,
        isAtMost: () => false,
      });

      render(<Show at="md">Tablet content</Show>);
      expect(screen.getByText('Tablet content')).toBeInTheDocument();
    });

    it('should show fallback when current breakpoint does not match', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'xs',
        is: () => false,
        isAtLeast: () => false,
        isAtMost: () => true,
      });

      render(
        <Show at="md" fallback={<div>Not tablet</div>}>
          Tablet content
        </Show>,
      );

      expect(screen.queryByText('Tablet content')).not.toBeInTheDocument();
      expect(screen.getByText('Not tablet')).toBeInTheDocument();
    });

    it('should handle array of breakpoints for at', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'sm',
        is: (bp) => bp === 'sm',
        isAtLeast: () => false,
        isAtMost: () => false,
      });

      render(<Show at={['xs', 'sm']}>Small screen content</Show>);
      expect(screen.getByText('Small screen content')).toBeInTheDocument();
    });
  });

  describe('combined props', () => {
    it('should handle above and below together (range)', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'md',
        is: () => false,
        isAtLeast: (bp) => bp === 'sm',
        isAtMost: (bp) => bp === 'lg',
      });

      render(
        <Show above="sm" below="lg">
          Tablet range content
        </Show>,
      );
      expect(screen.getByText('Tablet range content')).toBeInTheDocument();
    });

    it('should hide when outside range', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'xl',
        is: () => false,
        isAtLeast: () => true,
        isAtMost: () => false,
      });

      render(
        <Show above="sm" below="lg" fallback={<div>Outside range</div>}>
          Tablet range content
        </Show>,
      );

      expect(
        screen.queryByText('Tablet range content'),
      ).not.toBeInTheDocument();
      expect(screen.getByText('Outside range')).toBeInTheDocument();
    });
  });

  describe('fallback behavior', () => {
    it('should render null when no fallback provided and condition false', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'xs',
        is: () => false,
        isAtLeast: () => false,
        isAtMost: () => true,
      });

      const {container} = render(<Show above="md">Desktop content</Show>);
      expect(container.textContent).toBe('');
    });

    it('should render fallback element when condition false', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'xs',
        is: () => false,
        isAtLeast: () => false,
        isAtMost: () => true,
      });

      render(
        <Show above="md" fallback={<div>Mobile UI</div>}>
          Desktop UI
        </Show>,
      );

      expect(screen.getByText('Mobile UI')).toBeInTheDocument();
    });
  });

  describe('no conditions', () => {
    it('should always show children when no conditions specified', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'md',
        is: () => false,
        isAtLeast: () => false,
        isAtMost: () => false,
      });

      render(<Show>Always visible</Show>);
      expect(screen.getByText('Always visible')).toBeInTheDocument();
    });
  });

  describe('priority of conditions', () => {
    it('should prioritize "at" over "above" and "below"', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'md',
        is: (bp) => bp === 'md',
        isAtLeast: () => true,
        isAtMost: () => true,
      });

      render(
        <Show at="md" above="sm" below="lg">
          Exact match content
        </Show>,
      );

      expect(screen.getByText('Exact match content')).toBeInTheDocument();
    });
  });
});
