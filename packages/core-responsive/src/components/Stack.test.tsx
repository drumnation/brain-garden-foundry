import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Stack } from './Stack';
import * as breakpointHook from '../hooks/useBreakpoint';

describe('Stack Component', () => {
  const mockUseBreakpoint = vi.spyOn(breakpointHook, 'useBreakpoint');

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseBreakpoint.mockReturnValue({
      current: 'md',
      is: () => false,
      isAtLeast: () => false,
      isAtMost: () => false,
    });
  });

  describe('basic rendering', () => {
    it('should render children', () => {
      render(
        <Stack>
          <div>Item 1</div>
          <div>Item 2</div>
        </Stack>
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('should apply className', () => {
      const { container } = render(
        <Stack className="custom-stack">
          <div>Item</div>
        </Stack>
      );

      expect(container.firstChild).toHaveClass('custom-stack');
    });

    it('should merge custom styles', () => {
      const { container } = render(
        <Stack style={{ backgroundColor: 'red' }}>
          <div>Item</div>
        </Stack>
      );

      expect(container.firstChild).toHaveStyle('background-color: rgb(255, 0, 0)');
    });
  });

  describe('direction prop', () => {
    it('should default to vertical direction', () => {
      const { container } = render(
        <Stack>
          <div>Item</div>
        </Stack>
      );

      expect(container.firstChild).toHaveStyle({ flexDirection: 'column' });
    });

    it('should apply horizontal direction', () => {
      const { container } = render(
        <Stack direction="horizontal">
          <div>Item</div>
        </Stack>
      );

      expect(container.firstChild).toHaveStyle({ flexDirection: 'row' });
    });

    it('should support responsive direction object', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'xs',
        is: () => false,
        isAtLeast: () => false,
        isAtMost: () => false,
      });

      const { container } = render(
        <Stack direction={{ xs: 'vertical', md: 'horizontal' }}>
          <div>Item</div>
        </Stack>
      );

      expect(container.firstChild).toHaveStyle({ flexDirection: 'column' });
    });

    it('should use larger breakpoint value when current not defined', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'lg',
        is: () => false,
        isAtLeast: () => false,
        isAtMost: () => false,
      });

      const { container } = render(
        <Stack direction={{ xs: 'vertical', md: 'horizontal' }}>
          <div>Item</div>
        </Stack>
      );

      expect(container.firstChild).toHaveStyle({ flexDirection: 'row' });
    });
  });

  describe('gap prop', () => {
    it('should default to 16px gap', () => {
      const { container } = render(
        <Stack>
          <div>Item</div>
        </Stack>
      );

      expect(container.firstChild).toHaveStyle({ gap: '16px' });
    });

    it('should apply custom gap', () => {
      const { container } = render(
        <Stack gap={24}>
          <div>Item</div>
        </Stack>
      );

      expect(container.firstChild).toHaveStyle({ gap: '24px' });
    });

    it('should support responsive gap object', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'xs',
        is: () => false,
        isAtLeast: () => false,
        isAtMost: () => false,
      });

      const { container } = render(
        <Stack gap={{ xs: 8, md: 16, lg: 24 }}>
          <div>Item</div>
        </Stack>
      );

      expect(container.firstChild).toHaveStyle({ gap: '8px' });
    });
  });

  describe('align prop', () => {
    it('should default to stretch alignment', () => {
      const { container } = render(
        <Stack>
          <div>Item</div>
        </Stack>
      );

      expect(container.firstChild).toHaveStyle({ alignItems: 'stretch' });
    });

    it('should apply center alignment', () => {
      const { container } = render(
        <Stack align="center">
          <div>Item</div>
        </Stack>
      );

      expect(container.firstChild).toHaveStyle({ alignItems: 'center' });
    });

    it('should convert start to flex-start', () => {
      const { container } = render(
        <Stack align="start">
          <div>Item</div>
        </Stack>
      );

      expect(container.firstChild).toHaveStyle({ alignItems: 'flex-start' });
    });

    it('should convert end to flex-end', () => {
      const { container } = render(
        <Stack align="end">
          <div>Item</div>
        </Stack>
      );

      expect(container.firstChild).toHaveStyle({ alignItems: 'flex-end' });
    });

    it('should support responsive align object', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'sm',
        is: () => false,
        isAtLeast: () => false,
        isAtMost: () => false,
      });

      const { container } = render(
        <Stack align={{ xs: 'start', sm: 'center', md: 'end' }}>
          <div>Item</div>
        </Stack>
      );

      expect(container.firstChild).toHaveStyle({ alignItems: 'center' });
    });
  });

  describe('justify prop', () => {
    it('should default to start justification', () => {
      const { container } = render(
        <Stack>
          <div>Item</div>
        </Stack>
      );

      expect(container.firstChild).toHaveStyle({ justifyContent: 'flex-start' });
    });

    it('should apply center justification', () => {
      const { container } = render(
        <Stack justify="center">
          <div>Item</div>
        </Stack>
      );

      expect(container.firstChild).toHaveStyle({ justifyContent: 'center' });
    });

    it('should apply space-between justification', () => {
      const { container } = render(
        <Stack justify="space-between">
          <div>Item</div>
        </Stack>
      );

      expect(container.firstChild).toHaveStyle({ justifyContent: 'space-between' });
    });

    it('should support responsive justify object', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'md',
        is: () => false,
        isAtLeast: () => false,
        isAtMost: () => false,
      });

      const { container } = render(
        <Stack justify={{ xs: 'start', md: 'space-between', lg: 'center' }}>
          <div>Item</div>
        </Stack>
      );

      expect(container.firstChild).toHaveStyle({ justifyContent: 'space-between' });
    });
  });

  describe('wrap prop', () => {
    it('should default to no wrap', () => {
      const { container } = render(
        <Stack>
          <div>Item</div>
        </Stack>
      );

      expect(container.firstChild).toHaveStyle({ flexWrap: 'nowrap' });
    });

    it('should enable wrapping', () => {
      const { container } = render(
        <Stack wrap>
          <div>Item</div>
        </Stack>
      );

      expect(container.firstChild).toHaveStyle({ flexWrap: 'wrap' });
    });

    it('should support responsive wrap object', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'xs',
        is: () => false,
        isAtLeast: () => false,
        isAtMost: () => false,
      });

      const { container } = render(
        <Stack wrap={{ xs: true, md: false }}>
          <div>Item</div>
        </Stack>
      );

      expect(container.firstChild).toHaveStyle({ flexWrap: 'wrap' });
    });
  });

  describe('responsive value resolution', () => {
    it('should fall back to smallest defined breakpoint', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'xs',
        is: () => false,
        isAtLeast: () => false,
        isAtMost: () => false,
      });

      const { container } = render(
        <Stack gap={{ md: 16, lg: 24 }}>
          <div>Item</div>
        </Stack>
      );

      // Should use default (16) since no xs/sm defined
      expect(container.firstChild).toHaveStyle({ gap: '16px' });
    });

    it('should use closest smaller breakpoint when exact not found', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'lg',
        is: () => false,
        isAtLeast: () => false,
        isAtMost: () => false,
      });

      const { container } = render(
        <Stack gap={{ xs: 8, sm: 12, md: 16 }}>
          <div>Item</div>
        </Stack>
      );

      // lg should use md value (16) as closest smaller defined breakpoint
      expect(container.firstChild).toHaveStyle({ gap: '16px' });
    });
  });

  describe('complex combinations', () => {
    it('should handle all responsive props together', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'md',
        is: () => false,
        isAtLeast: () => false,
        isAtMost: () => false,
      });

      const { container } = render(
        <Stack
          direction={{ xs: 'vertical', md: 'horizontal' }}
          gap={{ xs: 8, md: 16 }}
          align={{ xs: 'start', md: 'center' }}
          justify={{ xs: 'start', md: 'space-between' }}
          wrap={{ xs: true, md: false }}
        >
          <div>Item</div>
        </Stack>
      );

      expect(container.firstChild).toHaveStyle({
        flexDirection: 'row',
        gap: '16px',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
      });
    });
  });
});
