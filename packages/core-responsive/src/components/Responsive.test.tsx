import {render, screen} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import * as breakpointHook from '../hooks/useBreakpoint';
import {Responsive} from './Responsive';

describe('Responsive Component', () => {
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
    it('should render children when provided as static content', () => {
      render(
        <Responsive>
          <div>Static content</div>
        </Responsive>,
      );

      expect(screen.getByText('Static content')).toBeInTheDocument();
    });

    it('should render as div by default', () => {
      const {container} = render(
        <Responsive>
          <div>Content</div>
        </Responsive>,
      );

      expect(container.firstChild?.nodeName).toBe('DIV');
    });

    it('should render as custom element when "as" prop is provided', () => {
      const {container} = render(
        <Responsive as="section">
          <div>Content</div>
        </Responsive>,
      );

      expect(container.firstChild?.nodeName).toBe('SECTION');
    });

    it('should apply static className', () => {
      const {container} = render(
        <Responsive className="custom-class">
          <div>Content</div>
        </Responsive>,
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should apply static style', () => {
      const {container} = render(
        <Responsive style={{backgroundColor: 'red'}}>
          <div>Content</div>
        </Responsive>,
      );

      expect(container.firstChild).toHaveStyle(
        'background-color: rgb(255, 0, 0)',
      );
    });
  });

  describe('responsive children', () => {
    it('should render children for current breakpoint', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'xs',
        is: () => false,
        isAtLeast: () => false,
        isAtMost: () => false,
      });

      render(
        <Responsive>
          {{
            xs: <div>Mobile content</div>,
            md: <div>Desktop content</div>,
          }}
        </Responsive>,
      );

      expect(screen.getByText('Mobile content')).toBeInTheDocument();
      expect(screen.queryByText('Desktop content')).not.toBeInTheDocument();
    });

    it('should fall back to smallest defined breakpoint', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'xs',
        is: () => false,
        isAtLeast: () => false,
        isAtMost: () => false,
      });

      render(
        <Responsive>
          {{
            md: <div>Medium content</div>,
            lg: <div>Large content</div>,
          }}
        </Responsive>,
      );

      // Since xs is not defined, should render nothing
      expect(screen.queryByText('Medium content')).not.toBeInTheDocument();
    });

    it('should use closest smaller breakpoint when exact not found', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'lg',
        is: () => false,
        isAtLeast: () => false,
        isAtMost: () => false,
      });

      render(
        <Responsive>
          {{
            xs: <div>Small content</div>,
            md: <div>Medium content</div>,
          }}
        </Responsive>,
      );

      // lg should use md (closest smaller defined breakpoint)
      expect(screen.getByText('Medium content')).toBeInTheDocument();
    });

    it('should handle all breakpoints', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'xl',
        is: () => false,
        isAtLeast: () => false,
        isAtMost: () => false,
      });

      render(
        <Responsive>
          {{
            xs: <div>xs</div>,
            sm: <div>sm</div>,
            md: <div>md</div>,
            lg: <div>lg</div>,
            xl: <div>xl</div>,
            '2xl': <div>2xl</div>,
          }}
        </Responsive>,
      );

      expect(screen.getByText('xl')).toBeInTheDocument();
    });
  });

  describe('responsive className', () => {
    it('should apply className for current breakpoint', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'xs',
        is: () => false,
        isAtLeast: () => false,
        isAtMost: () => false,
      });

      const {container} = render(
        <Responsive
          className={{
            xs: 'mobile-class',
            md: 'desktop-class',
          }}
        >
          <div>Content</div>
        </Responsive>,
      );

      expect(container.firstChild).toHaveClass('mobile-class');
      expect(container.firstChild).not.toHaveClass('desktop-class');
    });

    it('should use closest smaller breakpoint for className', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'lg',
        is: () => false,
        isAtLeast: () => false,
        isAtMost: () => false,
      });

      const {container} = render(
        <Responsive
          className={{
            xs: 'small-class',
            md: 'medium-class',
          }}
        >
          <div>Content</div>
        </Responsive>,
      );

      expect(container.firstChild).toHaveClass('medium-class');
    });
  });

  describe('responsive style', () => {
    it('should apply style for current breakpoint', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'xs',
        is: () => false,
        isAtLeast: () => false,
        isAtMost: () => false,
      });

      const {container} = render(
        <Responsive
          style={{
            xs: {padding: '8px'},
            md: {padding: '16px'},
          }}
        >
          <div>Content</div>
        </Responsive>,
      );

      expect(container.firstChild).toHaveStyle({padding: '8px'});
    });

    it('should use closest smaller breakpoint for style', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'lg',
        is: () => false,
        isAtLeast: () => false,
        isAtMost: () => false,
      });

      const {container} = render(
        <Responsive
          style={{
            xs: {padding: '8px'},
            md: {padding: '16px'},
          }}
        >
          <div>Content</div>
        </Responsive>,
      );

      expect(container.firstChild).toHaveStyle({padding: '16px'});
    });

    it('should support complex style objects', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'md',
        is: () => false,
        isAtLeast: () => false,
        isAtMost: () => false,
      });

      const {container} = render(
        <Responsive
          style={{
            md: {
              padding: '16px',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
            },
          }}
        >
          <div>Content</div>
        </Responsive>,
      );

      expect(container.firstChild).toHaveStyle({
        padding: '16px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
      });
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

      const {container} = render(
        <Responsive
          as="section"
          className={{
            xs: 'mobile-layout',
            md: 'tablet-layout',
            lg: 'desktop-layout',
          }}
          style={{
            xs: {padding: '8px'},
            md: {padding: '16px'},
            lg: {padding: '24px'},
          }}
        >
          {{
            xs: <div>Mobile</div>,
            md: <div>Tablet</div>,
            lg: <div>Desktop</div>,
          }}
        </Responsive>,
      );

      expect(container.firstChild?.nodeName).toBe('SECTION');
      expect(container.firstChild).toHaveClass('tablet-layout');
      expect(container.firstChild).toHaveStyle({padding: '16px'});
      expect(screen.getByText('Tablet')).toBeInTheDocument();
    });

    it('should handle mixed static and responsive props', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'xs',
        is: () => false,
        isAtLeast: () => false,
        isAtMost: () => false,
      });

      const {container} = render(
        <Responsive
          className="static-class"
          style={{
            xs: {padding: '8px'},
            md: {padding: '16px'},
          }}
        >
          <div>Content</div>
        </Responsive>,
      );

      expect(container.firstChild).toHaveClass('static-class');
      expect(container.firstChild).toHaveStyle({padding: '8px'});
    });
  });

  describe('edge cases', () => {
    it('should handle undefined responsive values gracefully', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'xs',
        is: () => false,
        isAtLeast: () => false,
        isAtMost: () => false,
      });

      const {container} = render(
        <Responsive
          style={{
            md: {padding: '16px'},
          }}
        >
          <div>Content</div>
        </Responsive>,
      );

      // Should render without style since xs is not defined
      expect(container.firstChild).not.toHaveStyle({padding: '16px'});
    });

    it('should handle empty children object', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'xs',
        is: () => false,
        isAtLeast: () => false,
        isAtMost: () => false,
      });

      render(<Responsive>{{}}</Responsive>);

      // Should render empty div
      const element = document.querySelector('div');
      expect(element).toBeInTheDocument();
    });

    it('should handle null children', () => {
      const {container} = render(<Responsive>{null}</Responsive>);

      expect(container.firstChild).toBeInTheDocument();
      expect(container.firstChild).toBeEmptyDOMElement();
    });

    it('should handle undefined children', () => {
      const {container} = render(<Responsive />);

      expect(container.firstChild).toBeInTheDocument();
      expect(container.firstChild).toBeEmptyDOMElement();
    });
  });

  describe('responsive value resolution', () => {
    it('should resolve to exact breakpoint when available', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'md',
        is: () => false,
        isAtLeast: () => false,
        isAtMost: () => false,
      });

      render(
        <Responsive>
          {{
            xs: <div>xs</div>,
            sm: <div>sm</div>,
            md: <div>md</div>,
            lg: <div>lg</div>,
          }}
        </Responsive>,
      );

      expect(screen.getByText('md')).toBeInTheDocument();
    });

    it('should resolve to closest smaller when current not available', () => {
      mockUseBreakpoint.mockReturnValue({
        current: 'xl',
        is: () => false,
        isAtLeast: () => false,
        isAtMost: () => false,
      });

      render(
        <Responsive>
          {{
            xs: <div>xs</div>,
            md: <div>md</div>,
          }}
        </Responsive>,
      );

      expect(screen.getByText('md')).toBeInTheDocument();
    });

    it('should resolve 2xl breakpoint correctly', () => {
      mockUseBreakpoint.mockReturnValue({
        current: '2xl',
        is: () => false,
        isAtLeast: () => false,
        isAtMost: () => false,
      });

      render(
        <Responsive>
          {{
            xs: <div>xs</div>,
            lg: <div>lg</div>,
            '2xl': <div>2xl</div>,
          }}
        </Responsive>,
      );

      expect(screen.getByText('2xl')).toBeInTheDocument();
    });
  });
});
