import type { Meta, StoryObj } from '@storybook/react';
import { Responsive } from './Responsive';

const meta = {
  title: 'Core Responsive/Components/Responsive',
  component: Responsive,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Generic responsive wrapper that adapts content, styles, and classes based on current breakpoint. Supports responsive values for children, style, and className props.'
      }
    }
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Responsive>;

export default meta;
type Story = StoryObj<typeof meta>;

// Viewport presets
const mobileViewport = {
  viewport: {
    defaultViewport: 'mobile1',
  },
};

const tabletViewport = {
  viewport: {
    defaultViewport: 'tablet',
  },
};

const desktopViewport = {
  viewport: {
    defaultViewport: 'desktop',
  },
};

// Sample components for demos
const MobileContent = () => (
  <div style={{
    padding: '1rem',
    backgroundColor: '#10b981',
    color: 'white',
    borderRadius: '8px',
    textAlign: 'center',
    fontWeight: 'bold',
  }}>
    📱 Mobile Content
  </div>
);

const TabletContent = () => (
  <div style={{
    padding: '1.5rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    borderRadius: '8px',
    textAlign: 'center',
    fontWeight: 'bold',
  }}>
    📱 Tablet Content
  </div>
);

const DesktopContent = () => (
  <div style={{
    padding: '2rem',
    backgroundColor: '#8b5cf6',
    color: 'white',
    borderRadius: '8px',
    textAlign: 'center',
    fontWeight: 'bold',
  }}>
    💻 Desktop Content
  </div>
);

/**
 * Responsive content - different content per breakpoint
 */
export const ResponsiveContent_Mobile: Story = {
  args: {
    children: {
      xs: <MobileContent />,
      md: <TabletContent />,
      lg: <DesktopContent />,
    },
  },
  parameters: mobileViewport,
};

export const ResponsiveContent_Tablet: Story = {
  args: {
    children: {
      xs: <MobileContent />,
      md: <TabletContent />,
      lg: <DesktopContent />,
    },
  },
  parameters: tabletViewport,
};

export const ResponsiveContent_Desktop: Story = {
  args: {
    children: {
      xs: <MobileContent />,
      md: <TabletContent />,
      lg: <DesktopContent />,
    },
  },
  parameters: desktopViewport,
};

/**
 * Responsive padding - different padding per breakpoint
 */
export const ResponsivePadding_Mobile: Story = {
  args: {
    style: {
      xs: { padding: '8px', backgroundColor: '#f3f4f6', borderRadius: '8px' },
      md: { padding: '16px', backgroundColor: '#e5e7eb', borderRadius: '8px' },
      lg: { padding: '24px', backgroundColor: '#d1d5db', borderRadius: '8px' },
    },
    children: (
      <div style={{
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '1rem',
        borderRadius: '8px',
        textAlign: 'center',
        fontWeight: 'bold',
      }}>
        Check the outer padding (gray area)
      </div>
    ),
  },
  parameters: mobileViewport,
};

export const ResponsivePadding_Tablet: Story = {
  args: {
    style: {
      xs: { padding: '8px', backgroundColor: '#f3f4f6', borderRadius: '8px' },
      md: { padding: '16px', backgroundColor: '#e5e7eb', borderRadius: '8px' },
      lg: { padding: '24px', backgroundColor: '#d1d5db', borderRadius: '8px' },
    },
    children: (
      <div style={{
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '1rem',
        borderRadius: '8px',
        textAlign: 'center',
        fontWeight: 'bold',
      }}>
        Check the outer padding (gray area)
      </div>
    ),
  },
  parameters: tabletViewport,
};

export const ResponsivePadding_Desktop: Story = {
  args: {
    style: {
      xs: { padding: '8px', backgroundColor: '#f3f4f6', borderRadius: '8px' },
      md: { padding: '16px', backgroundColor: '#e5e7eb', borderRadius: '8px' },
      lg: { padding: '24px', backgroundColor: '#d1d5db', borderRadius: '8px' },
    },
    children: (
      <div style={{
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '1rem',
        borderRadius: '8px',
        textAlign: 'center',
        fontWeight: 'bold',
      }}>
        Check the outer padding (gray area)
      </div>
    ),
  },
  parameters: desktopViewport,
};

/**
 * Responsive className - different classes per breakpoint
 */
export const ResponsiveClassName_Mobile: Story = {
  args: {
    className: {
      xs: 'mobile-layout',
      md: 'tablet-layout',
      lg: 'desktop-layout',
    },
    style: { padding: '1rem' },
    children: (
      <div style={{
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '1rem',
        borderRadius: '8px',
        textAlign: 'center',
        fontWeight: 'bold',
      }}>
        Check DevTools: className = "mobile-layout"
      </div>
    ),
  },
  parameters: mobileViewport,
};

export const ResponsiveClassName_Tablet: Story = {
  args: {
    className: {
      xs: 'mobile-layout',
      md: 'tablet-layout',
      lg: 'desktop-layout',
    },
    style: { padding: '1rem' },
    children: (
      <div style={{
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '1rem',
        borderRadius: '8px',
        textAlign: 'center',
        fontWeight: 'bold',
      }}>
        Check DevTools: className = "tablet-layout"
      </div>
    ),
  },
  parameters: tabletViewport,
};

export const ResponsiveClassName_Desktop: Story = {
  args: {
    className: {
      xs: 'mobile-layout',
      md: 'tablet-layout',
      lg: 'desktop-layout',
    },
    style: { padding: '1rem' },
    children: (
      <div style={{
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '1rem',
        borderRadius: '8px',
        textAlign: 'center',
        fontWeight: 'bold',
      }}>
        Check DevTools: className = "desktop-layout"
      </div>
    ),
  },
  parameters: desktopViewport,
};

/**
 * Custom element - render as different HTML element
 */
export const CustomElement_Mobile: Story = {
  args: {
    as: 'section',
    style: {
      xs: { padding: '1rem', backgroundColor: '#fef3c7', border: '2px dashed #f59e0b', borderRadius: '8px' },
      lg: { padding: '2rem', backgroundColor: '#fef3c7', border: '2px dashed #f59e0b', borderRadius: '8px' },
    },
    children: (
      <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
        Check DevTools: Rendered as &lt;section&gt;
      </div>
    ),
  },
  parameters: mobileViewport,
};

export const CustomElement_Tablet: Story = {
  args: {
    as: 'section',
    style: {
      xs: { padding: '1rem', backgroundColor: '#fef3c7', border: '2px dashed #f59e0b', borderRadius: '8px' },
      lg: { padding: '2rem', backgroundColor: '#fef3c7', border: '2px dashed #f59e0b', borderRadius: '8px' },
    },
    children: (
      <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
        Check DevTools: Rendered as &lt;section&gt;
      </div>
    ),
  },
  parameters: tabletViewport,
};

export const CustomElement_Desktop: Story = {
  args: {
    as: 'section',
    style: {
      xs: { padding: '1rem', backgroundColor: '#fef3c7', border: '2px dashed #f59e0b', borderRadius: '8px' },
      lg: { padding: '2rem', backgroundColor: '#fef3c7', border: '2px dashed #f59e0b', borderRadius: '8px' },
    },
    children: (
      <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
        Check DevTools: Rendered as &lt;section&gt;
      </div>
    ),
  },
  parameters: desktopViewport,
};

/**
 * Complex layout - combining content, styles, and className
 */
export const ComplexLayout_Mobile: Story = {
  args: {
    className: {
      xs: 'mobile-card',
      md: 'tablet-card',
      lg: 'desktop-card',
    },
    style: {
      xs: {
        padding: '12px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        maxWidth: '300px',
      },
      md: {
        padding: '16px',
        backgroundColor: '#e5e7eb',
        borderRadius: '12px',
        maxWidth: '500px',
      },
      lg: {
        padding: '24px',
        backgroundColor: '#d1d5db',
        borderRadius: '16px',
        maxWidth: '700px',
      },
    },
    children: {
      xs: (
        <div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Mobile Card</h3>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>Compact layout for small screens</p>
        </div>
      ),
      md: (
        <div>
          <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.25rem' }}>Tablet Card</h3>
          <p style={{ margin: 0, fontSize: '1rem' }}>Medium layout with more breathing room</p>
        </div>
      ),
      lg: (
        <div>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>Desktop Card</h3>
          <p style={{ margin: 0, fontSize: '1.125rem' }}>Spacious layout for large screens</p>
        </div>
      ),
    },
  },
  parameters: mobileViewport,
};

export const ComplexLayout_Tablet: Story = {
  args: {
    className: {
      xs: 'mobile-card',
      md: 'tablet-card',
      lg: 'desktop-card',
    },
    style: {
      xs: {
        padding: '12px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        maxWidth: '300px',
      },
      md: {
        padding: '16px',
        backgroundColor: '#e5e7eb',
        borderRadius: '12px',
        maxWidth: '500px',
      },
      lg: {
        padding: '24px',
        backgroundColor: '#d1d5db',
        borderRadius: '16px',
        maxWidth: '700px',
      },
    },
    children: {
      xs: (
        <div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Mobile Card</h3>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>Compact layout for small screens</p>
        </div>
      ),
      md: (
        <div>
          <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.25rem' }}>Tablet Card</h3>
          <p style={{ margin: 0, fontSize: '1rem' }}>Medium layout with more breathing room</p>
        </div>
      ),
      lg: (
        <div>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>Desktop Card</h3>
          <p style={{ margin: 0, fontSize: '1.125rem' }}>Spacious layout for large screens</p>
        </div>
      ),
    },
  },
  parameters: tabletViewport,
};

export const ComplexLayout_Desktop: Story = {
  args: {
    className: {
      xs: 'mobile-card',
      md: 'tablet-card',
      lg: 'desktop-card',
    },
    style: {
      xs: {
        padding: '12px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        maxWidth: '300px',
      },
      md: {
        padding: '16px',
        backgroundColor: '#e5e7eb',
        borderRadius: '12px',
        maxWidth: '500px',
      },
      lg: {
        padding: '24px',
        backgroundColor: '#d1d5db',
        borderRadius: '16px',
        maxWidth: '700px',
      },
    },
    children: {
      xs: (
        <div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Mobile Card</h3>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>Compact layout for small screens</p>
        </div>
      ),
      md: (
        <div>
          <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.25rem' }}>Tablet Card</h3>
          <p style={{ margin: 0, fontSize: '1rem' }}>Medium layout with more breathing room</p>
        </div>
      ),
      lg: (
        <div>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>Desktop Card</h3>
          <p style={{ margin: 0, fontSize: '1.125rem' }}>Spacious layout for large screens</p>
        </div>
      ),
    },
  },
  parameters: desktopViewport,
};
