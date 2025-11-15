import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as useMediaQueryStories from '../useMediaQuery.stories';
import * as useBreakpointStories from '../useBreakpoint.stories';

// Compose all stories from useMediaQuery
const {
  MobileDetection,
  DesktopDetection,
  PortraitOrientation,
  LandscapeOrientation,
  DarkModePreference,
  ReducedMotionPreference,
  ComplexQuery,
} = composeStories(useMediaQueryStories);

// Compose all stories from useBreakpoint
const { Interactive } = composeStories(useBreakpointStories);

describe('useMediaQuery Stories', () => {
  it('should render MobileDetection story without errors', () => {
    const { container } = render(<MobileDetection />);
    expect(container).toBeTruthy();
    expect(container.textContent).toContain('useMediaQuery Hook Demo');
  });

  it('should render DesktopDetection story without errors', () => {
    const { container } = render(<DesktopDetection />);
    expect(container).toBeTruthy();
    expect(container.textContent).toContain('useMediaQuery Hook Demo');
  });

  it('should render PortraitOrientation story without errors', () => {
    const { container } = render(<PortraitOrientation />);
    expect(container).toBeTruthy();
  });

  it('should render LandscapeOrientation story without errors', () => {
    const { container } = render(<LandscapeOrientation />);
    expect(container).toBeTruthy();
  });

  it('should render DarkModePreference story without errors', () => {
    const { container } = render(<DarkModePreference />);
    expect(container).toBeTruthy();
  });

  it('should render ReducedMotionPreference story without errors', () => {
    const { container } = render(<ReducedMotionPreference />);
    expect(container).toBeTruthy();
  });

  it('should render ComplexQuery story without errors', () => {
    const { container } = render(<ComplexQuery />);
    expect(container).toBeTruthy();
  });

  it('should display query string in all stories', () => {
    const { container: mobile } = render(<MobileDetection />);
    expect(mobile.textContent).toContain('max-width: 768px');

    const { container: desktop } = render(<DesktopDetection />);
    expect(desktop.textContent).toContain('min-width: 1024px');
  });
});

describe('useBreakpoint Stories', () => {
  it('should render Interactive story without errors', () => {
    const { container } = render(<Interactive />);
    expect(container).toBeTruthy();
    expect(container.textContent).toContain('useBreakpoint Hook Demo');
  });

  it('should display current breakpoint', () => {
    const { container } = render(<Interactive />);
    expect(container.textContent).toContain('Current Breakpoint');
  });

  it('should display breakpoint definitions', () => {
    const { container } = render(<Interactive />);
    expect(container.textContent).toContain('Breakpoint Definitions');
    expect(container.textContent).toContain('xs');
    expect(container.textContent).toContain('sm');
    expect(container.textContent).toContain('md');
    expect(container.textContent).toContain('lg');
    expect(container.textContent).toContain('xl');
    expect(container.textContent).toContain('2xl');
  });

  it('should display isAtLeast tests', () => {
    const { container } = render(<Interactive />);
    expect(container.textContent).toContain('isAtLeast() Tests');
  });

  it('should display isAtMost tests', () => {
    const { container } = render(<Interactive />);
    expect(container.textContent).toContain('isAtMost() Tests');
  });
});

describe('Story Accessibility', () => {
  it('useMediaQuery stories should have proper semantic structure', () => {
    const { container } = render(<MobileDetection />);
    const heading = container.querySelector('h2');
    expect(heading).toBeTruthy();
    expect(heading?.textContent).toContain('useMediaQuery Hook Demo');
  });

  it('useBreakpoint story should have proper semantic structure', () => {
    const { container } = render(<Interactive />);
    const heading = container.querySelector('h2');
    expect(heading).toBeTruthy();
    expect(heading?.textContent).toContain('useBreakpoint Hook Demo');
  });
});
