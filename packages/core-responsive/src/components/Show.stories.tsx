import type {Meta, StoryObj} from '@storybook/react';
import {Show} from './Show';

const meta = {
  title: 'Core Responsive/Components/Show',
  component: Show,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Conditionally renders children based on current breakpoint. Use `above`, `below`, or `at` props to control visibility across different screen sizes.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Show>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mobile viewport (375x667 - iPhone SE)
const mobileViewport = {
  viewport: {
    defaultViewport: 'mobile1',
  },
};

// Tablet viewport (768x1024 - iPad)
const tabletViewport = {
  viewport: {
    defaultViewport: 'tablet',
  },
};

// Desktop viewport (1920x1080)
const desktopViewport = {
  viewport: {
    defaultViewport: 'desktop',
  },
};

/**
 * Show content only on mobile (below sm breakpoint)
 */
export const MobileOnly_Mobile: Story = {
  args: {
    below: 'sm',
    children: (
      <div
        style={{
          padding: '2rem',
          backgroundColor: '#10b981',
          color: 'white',
          borderRadius: '8px',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        ✓ Visible on Mobile Only
      </div>
    ),
    fallback: (
      <div
        style={{
          padding: '2rem',
          backgroundColor: '#ef4444',
          color: 'white',
          borderRadius: '8px',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        ✗ Hidden on Mobile
      </div>
    ),
  },
  parameters: mobileViewport,
};

export const MobileOnly_Tablet: Story = {
  args: {
    below: 'sm',
    children: (
      <div
        style={{
          padding: '2rem',
          backgroundColor: '#10b981',
          color: 'white',
          borderRadius: '8px',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        ✓ Visible on Mobile Only
      </div>
    ),
    fallback: (
      <div
        style={{
          padding: '2rem',
          backgroundColor: '#ef4444',
          color: 'white',
          borderRadius: '8px',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        ✗ Hidden on Tablet/Desktop
      </div>
    ),
  },
  parameters: tabletViewport,
};

export const MobileOnly_Desktop: Story = {
  args: {
    below: 'sm',
    children: (
      <div
        style={{
          padding: '2rem',
          backgroundColor: '#10b981',
          color: 'white',
          borderRadius: '8px',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        ✓ Visible on Mobile Only
      </div>
    ),
    fallback: (
      <div
        style={{
          padding: '2rem',
          backgroundColor: '#ef4444',
          color: 'white',
          borderRadius: '8px',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        ✗ Hidden on Desktop
      </div>
    ),
  },
  parameters: desktopViewport,
};

/**
 * Show content only on desktop (above md breakpoint)
 */
export const DesktopOnly_Mobile: Story = {
  args: {
    above: 'md',
    children: (
      <div
        style={{
          padding: '2rem',
          backgroundColor: '#10b981',
          color: 'white',
          borderRadius: '8px',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        ✓ Visible on Desktop Only
      </div>
    ),
    fallback: (
      <div
        style={{
          padding: '2rem',
          backgroundColor: '#ef4444',
          color: 'white',
          borderRadius: '8px',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        ✗ Hidden on Mobile
      </div>
    ),
  },
  parameters: mobileViewport,
};

export const DesktopOnly_Tablet: Story = {
  args: {
    above: 'md',
    children: (
      <div
        style={{
          padding: '2rem',
          backgroundColor: '#10b981',
          color: 'white',
          borderRadius: '8px',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        ✓ Visible on Desktop Only
      </div>
    ),
    fallback: (
      <div
        style={{
          padding: '2rem',
          backgroundColor: '#ef4444',
          color: 'white',
          borderRadius: '8px',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        ✗ Hidden on Tablet
      </div>
    ),
  },
  parameters: tabletViewport,
};

export const DesktopOnly_Desktop: Story = {
  args: {
    above: 'md',
    children: (
      <div
        style={{
          padding: '2rem',
          backgroundColor: '#10b981',
          color: 'white',
          borderRadius: '8px',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        ✓ Visible on Desktop Only
      </div>
    ),
    fallback: (
      <div
        style={{
          padding: '2rem',
          backgroundColor: '#ef4444',
          color: 'white',
          borderRadius: '8px',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        ✗ Hidden on Desktop
      </div>
    ),
  },
  parameters: desktopViewport,
};

/**
 * Show content only on tablet (at md breakpoint)
 */
export const TabletOnly_Mobile: Story = {
  args: {
    at: 'md',
    children: (
      <div
        style={{
          padding: '2rem',
          backgroundColor: '#10b981',
          color: 'white',
          borderRadius: '8px',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        ✓ Visible on Tablet Only
      </div>
    ),
    fallback: (
      <div
        style={{
          padding: '2rem',
          backgroundColor: '#ef4444',
          color: 'white',
          borderRadius: '8px',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        ✗ Hidden on Mobile
      </div>
    ),
  },
  parameters: mobileViewport,
};

export const TabletOnly_Tablet: Story = {
  args: {
    at: 'md',
    children: (
      <div
        style={{
          padding: '2rem',
          backgroundColor: '#10b981',
          color: 'white',
          borderRadius: '8px',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        ✓ Visible on Tablet Only
      </div>
    ),
    fallback: (
      <div
        style={{
          padding: '2rem',
          backgroundColor: '#ef4444',
          color: 'white',
          borderRadius: '8px',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        ✗ Hidden on Tablet
      </div>
    ),
  },
  parameters: tabletViewport,
};

export const TabletOnly_Desktop: Story = {
  args: {
    at: 'md',
    children: (
      <div
        style={{
          padding: '2rem',
          backgroundColor: '#10b981',
          color: 'white',
          borderRadius: '8px',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        ✓ Visible on Tablet Only
      </div>
    ),
    fallback: (
      <div
        style={{
          padding: '2rem',
          backgroundColor: '#ef4444',
          color: 'white',
          borderRadius: '8px',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        ✗ Hidden on Desktop
      </div>
    ),
  },
  parameters: desktopViewport,
};

/**
 * Responsive navigation example - mobile vs desktop
 */
export const ResponsiveNav_Mobile: Story = {
  args: {
    above: 'md',
    children: (
      <nav
        style={{
          display: 'flex',
          gap: '2rem',
          padding: '1rem',
          backgroundColor: '#1f2937',
          color: 'white',
          borderRadius: '8px',
        }}
      >
        <a href="/demo" style={{color: 'white', textDecoration: 'none'}}>
          Home
        </a>
        <a href="/demo" style={{color: 'white', textDecoration: 'none'}}>
          About
        </a>
        <a href="/demo" style={{color: 'white', textDecoration: 'none'}}>
          Services
        </a>
        <a href="/demo" style={{color: 'white', textDecoration: 'none'}}>
          Contact
        </a>
      </nav>
    ),
    fallback: (
      <nav
        style={{
          padding: '1rem',
          backgroundColor: '#1f2937',
          color: 'white',
          borderRadius: '8px',
          textAlign: 'center',
        }}
      >
        <button
          type="button"
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          ☰ Menu
        </button>
      </nav>
    ),
  },
  parameters: mobileViewport,
};

export const ResponsiveNav_Tablet: Story = {
  args: {
    above: 'md',
    children: (
      <nav
        style={{
          display: 'flex',
          gap: '2rem',
          padding: '1rem',
          backgroundColor: '#1f2937',
          color: 'white',
          borderRadius: '8px',
        }}
      >
        <a href="/demo" style={{color: 'white', textDecoration: 'none'}}>
          Home
        </a>
        <a href="/demo" style={{color: 'white', textDecoration: 'none'}}>
          About
        </a>
        <a href="/demo" style={{color: 'white', textDecoration: 'none'}}>
          Services
        </a>
        <a href="/demo" style={{color: 'white', textDecoration: 'none'}}>
          Contact
        </a>
      </nav>
    ),
    fallback: (
      <nav
        style={{
          padding: '1rem',
          backgroundColor: '#1f2937',
          color: 'white',
          borderRadius: '8px',
          textAlign: 'center',
        }}
      >
        <button
          type="button"
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          ☰ Menu
        </button>
      </nav>
    ),
  },
  parameters: tabletViewport,
};

export const ResponsiveNav_Desktop: Story = {
  args: {
    above: 'md',
    children: (
      <nav
        style={{
          display: 'flex',
          gap: '2rem',
          padding: '1rem',
          backgroundColor: '#1f2937',
          color: 'white',
          borderRadius: '8px',
        }}
      >
        <a href="/demo" style={{color: 'white', textDecoration: 'none'}}>
          Home
        </a>
        <a href="/demo" style={{color: 'white', textDecoration: 'none'}}>
          About
        </a>
        <a href="/demo" style={{color: 'white', textDecoration: 'none'}}>
          Services
        </a>
        <a href="/demo" style={{color: 'white', textDecoration: 'none'}}>
          Contact
        </a>
      </nav>
    ),
    fallback: (
      <nav
        style={{
          padding: '1rem',
          backgroundColor: '#1f2937',
          color: 'white',
          borderRadius: '8px',
          textAlign: 'center',
        }}
      >
        <button
          type="button"
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          ☰ Menu
        </button>
      </nav>
    ),
  },
  parameters: desktopViewport,
};
