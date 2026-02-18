import type {Meta, StoryObj} from '@storybook/react';
import {Stack} from './Stack';

const meta = {
  title: 'Core Responsive/Components/Stack',
  component: Stack,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Responsive flexbox layout for vertical or horizontal stacking. Supports responsive direction, gap, alignment, and wrapping.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Stack>;

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

// Sample card component for demos
const Card = ({children}: {children: React.ReactNode}) => (
  <div
    style={{
      padding: '1rem',
      backgroundColor: '#3b82f6',
      color: 'white',
      borderRadius: '8px',
      minWidth: '120px',
      textAlign: 'center',
      fontWeight: 'bold',
    }}
  >
    {children}
  </div>
);

/**
 * Vertical stack - stacks items vertically with gap
 */
export const VerticalStack_Mobile: Story = {
  args: {
    direction: 'vertical',
    gap: 16,
    children: (
      <>
        <Card>Item 1</Card>
        <Card>Item 2</Card>
        <Card>Item 3</Card>
      </>
    ),
  },
  parameters: mobileViewport,
};

export const VerticalStack_Tablet: Story = {
  args: {
    direction: 'vertical',
    gap: 16,
    children: (
      <>
        <Card>Item 1</Card>
        <Card>Item 2</Card>
        <Card>Item 3</Card>
      </>
    ),
  },
  parameters: tabletViewport,
};

export const VerticalStack_Desktop: Story = {
  args: {
    direction: 'vertical',
    gap: 16,
    children: (
      <>
        <Card>Item 1</Card>
        <Card>Item 2</Card>
        <Card>Item 3</Card>
      </>
    ),
  },
  parameters: desktopViewport,
};

/**
 * Horizontal stack - stacks items horizontally with gap
 */
export const HorizontalStack_Mobile: Story = {
  args: {
    direction: 'horizontal',
    gap: 16,
    children: (
      <>
        <Card>Item 1</Card>
        <Card>Item 2</Card>
        <Card>Item 3</Card>
      </>
    ),
  },
  parameters: mobileViewport,
};

export const HorizontalStack_Tablet: Story = {
  args: {
    direction: 'horizontal',
    gap: 16,
    children: (
      <>
        <Card>Item 1</Card>
        <Card>Item 2</Card>
        <Card>Item 3</Card>
      </>
    ),
  },
  parameters: tabletViewport,
};

export const HorizontalStack_Desktop: Story = {
  args: {
    direction: 'horizontal',
    gap: 16,
    children: (
      <>
        <Card>Item 1</Card>
        <Card>Item 2</Card>
        <Card>Item 3</Card>
      </>
    ),
  },
  parameters: desktopViewport,
};

/**
 * Responsive direction - vertical on mobile, horizontal on desktop
 */
export const ResponsiveDirection_Mobile: Story = {
  args: {
    direction: {xs: 'vertical', md: 'horizontal'},
    gap: {xs: 8, md: 16},
    children: (
      <>
        <Card>Card 1</Card>
        <Card>Card 2</Card>
        <Card>Card 3</Card>
      </>
    ),
  },
  parameters: mobileViewport,
};

export const ResponsiveDirection_Tablet: Story = {
  args: {
    direction: {xs: 'vertical', md: 'horizontal'},
    gap: {xs: 8, md: 16},
    children: (
      <>
        <Card>Card 1</Card>
        <Card>Card 2</Card>
        <Card>Card 3</Card>
      </>
    ),
  },
  parameters: tabletViewport,
};

export const ResponsiveDirection_Desktop: Story = {
  args: {
    direction: {xs: 'vertical', md: 'horizontal'},
    gap: {xs: 8, md: 16},
    children: (
      <>
        <Card>Card 1</Card>
        <Card>Card 2</Card>
        <Card>Card 3</Card>
      </>
    ),
  },
  parameters: desktopViewport,
};

/**
 * Centered horizontal stack with different alignments
 */
export const CenteredStack_Mobile: Story = {
  args: {
    direction: 'horizontal',
    gap: 12,
    align: 'center',
    justify: 'center',
    style: {
      minHeight: '200px',
      border: '2px dashed #e5e7eb',
      borderRadius: '8px',
    },
    children: (
      <>
        <Card>Button 1</Card>
        <Card>Button 2</Card>
        <Card>Button 3</Card>
      </>
    ),
  },
  parameters: mobileViewport,
};

export const CenteredStack_Tablet: Story = {
  args: {
    direction: 'horizontal',
    gap: 12,
    align: 'center',
    justify: 'center',
    style: {
      minHeight: '200px',
      border: '2px dashed #e5e7eb',
      borderRadius: '8px',
    },
    children: (
      <>
        <Card>Button 1</Card>
        <Card>Button 2</Card>
        <Card>Button 3</Card>
      </>
    ),
  },
  parameters: tabletViewport,
};

export const CenteredStack_Desktop: Story = {
  args: {
    direction: 'horizontal',
    gap: 12,
    align: 'center',
    justify: 'center',
    style: {
      minHeight: '200px',
      border: '2px dashed #e5e7eb',
      borderRadius: '8px',
    },
    children: (
      <>
        <Card>Button 1</Card>
        <Card>Button 2</Card>
        <Card>Button 3</Card>
      </>
    ),
  },
  parameters: desktopViewport,
};

/**
 * Wrapping stack - items wrap to next line when space runs out
 */
export const WrappingStack_Mobile: Story = {
  args: {
    direction: 'horizontal',
    gap: 12,
    wrap: true,
    style: {
      maxWidth: '300px',
      border: '2px dashed #e5e7eb',
      borderRadius: '8px',
      padding: '1rem',
    },
    children: (
      <>
        <Card>Tag 1</Card>
        <Card>Tag 2</Card>
        <Card>Tag 3</Card>
        <Card>Tag 4</Card>
        <Card>Tag 5</Card>
        <Card>Tag 6</Card>
      </>
    ),
  },
  parameters: mobileViewport,
};

export const WrappingStack_Tablet: Story = {
  args: {
    direction: 'horizontal',
    gap: 12,
    wrap: true,
    style: {
      maxWidth: '500px',
      border: '2px dashed #e5e7eb',
      borderRadius: '8px',
      padding: '1rem',
    },
    children: (
      <>
        <Card>Tag 1</Card>
        <Card>Tag 2</Card>
        <Card>Tag 3</Card>
        <Card>Tag 4</Card>
        <Card>Tag 5</Card>
        <Card>Tag 6</Card>
      </>
    ),
  },
  parameters: tabletViewport,
};

export const WrappingStack_Desktop: Story = {
  args: {
    direction: 'horizontal',
    gap: 12,
    wrap: true,
    style: {
      maxWidth: '600px',
      border: '2px dashed #e5e7eb',
      borderRadius: '8px',
      padding: '1rem',
    },
    children: (
      <>
        <Card>Tag 1</Card>
        <Card>Tag 2</Card>
        <Card>Tag 3</Card>
        <Card>Tag 4</Card>
        <Card>Tag 5</Card>
        <Card>Tag 6</Card>
      </>
    ),
  },
  parameters: desktopViewport,
};

/**
 * Space between justification
 */
export const SpaceBetween_Mobile: Story = {
  args: {
    direction: 'horizontal',
    gap: 0,
    justify: 'space-between',
    style: {
      width: '100%',
      border: '2px dashed #e5e7eb',
      borderRadius: '8px',
      padding: '1rem',
    },
    children: (
      <>
        <Card>Left</Card>
        <Card>Center</Card>
        <Card>Right</Card>
      </>
    ),
  },
  parameters: mobileViewport,
};

export const SpaceBetween_Tablet: Story = {
  args: {
    direction: 'horizontal',
    gap: 0,
    justify: 'space-between',
    style: {
      width: '100%',
      border: '2px dashed #e5e7eb',
      borderRadius: '8px',
      padding: '1rem',
    },
    children: (
      <>
        <Card>Left</Card>
        <Card>Center</Card>
        <Card>Right</Card>
      </>
    ),
  },
  parameters: tabletViewport,
};

export const SpaceBetween_Desktop: Story = {
  args: {
    direction: 'horizontal',
    gap: 0,
    justify: 'space-between',
    style: {
      width: '100%',
      border: '2px dashed #e5e7eb',
      borderRadius: '8px',
      padding: '1rem',
    },
    children: (
      <>
        <Card>Left</Card>
        <Card>Center</Card>
        <Card>Right</Card>
      </>
    ),
  },
  parameters: desktopViewport,
};
