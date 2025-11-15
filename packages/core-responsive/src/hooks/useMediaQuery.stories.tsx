import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { useMediaQuery } from './useMediaQuery';

const UseMediaQueryDemo = ({ query }: { query: string }) => {
  const matches = useMediaQuery(query);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ marginBottom: '1rem' }}>useMediaQuery Hook Demo</h2>
      <div style={{
        padding: '1rem',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        backgroundColor: matches ? '#10b981' : '#ef4444',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '1.25rem',
        textAlign: 'center',
        marginBottom: '1rem'
      }}>
        {matches ? '✓ Query Matches' : '✗ Query Does Not Match'}
      </div>
      <div style={{
        padding: '1rem',
        backgroundColor: '#f9fafb',
        borderRadius: '6px',
        fontFamily: 'monospace',
        fontSize: '0.875rem'
      }}>
        <div><strong>Query:</strong> {query}</div>
        <div><strong>Window Width:</strong> {typeof window !== 'undefined' ? `${window.innerWidth}px` : 'N/A'}</div>
        <div><strong>Result:</strong> {String(matches)}</div>
      </div>
    </div>
  );
};

const meta = {
  title: 'Core Responsive/Hooks/useMediaQuery',
  component: UseMediaQueryDemo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'React hook for responsive media queries. Returns true when the media query matches, false otherwise. Automatically updates when the viewport changes.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    query: {
      control: 'text',
      description: 'CSS media query string',
    },
  },
} satisfies Meta<typeof UseMediaQueryDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Detects mobile devices (max-width: 768px)
 * Try resizing your browser window to see it change!
 */
export const MobileDetection: Story = {
  args: {
    query: '(max-width: 768px)',
  },
};

/**
 * Detects desktop devices (min-width: 1024px)
 */
export const DesktopDetection: Story = {
  args: {
    query: '(min-width: 1024px)',
  },
};

/**
 * Detects portrait orientation
 */
export const PortraitOrientation: Story = {
  args: {
    query: '(orientation: portrait)',
  },
};

/**
 * Detects landscape orientation
 */
export const LandscapeOrientation: Story = {
  args: {
    query: '(orientation: landscape)',
  },
};

/**
 * Detects dark mode preference
 */
export const DarkModePreference: Story = {
  args: {
    query: '(prefers-color-scheme: dark)',
  },
};

/**
 * Detects reduced motion preference
 */
export const ReducedMotionPreference: Story = {
  args: {
    query: '(prefers-reduced-motion: reduce)',
  },
};

/**
 * Complex query combining multiple conditions
 */
export const ComplexQuery: Story = {
  args: {
    query: '(min-width: 768px) and (max-width: 1024px)',
  },
};
