import type {Meta, StoryObj} from '@storybook/react';
import {IconBolt, IconRocket, IconShield} from '@tabler/icons-react';
import {FeatureCard} from './FeatureCard';

const meta = {
  title: 'UI Components/FeatureCard',
  component: FeatureCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'error', 'info'],
    },
  },
} satisfies Meta<typeof FeatureCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    icon: <IconRocket size={32} />,
    title: 'Fast Performance',
    description:
      'Lightning-fast load times with optimized builds and smart caching strategies.',
    actionLabel: 'Learn More',
    onAction: () => alert('Action clicked!'),
    variant: 'primary',
  },
};

export const Success: Story = {
  args: {
    icon: <IconShield size={32} />,
    title: 'Secure by Default',
    description:
      'Built with security best practices including CSP, HTTPS, and input validation.',
    actionLabel: 'View Security Guide',
    onAction: () => alert('Security guide opened'),
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    icon: <IconBolt size={32} />,
    title: 'High Performance',
    description:
      'Optimized for speed with lazy loading, code splitting, and efficient rendering.',
    variant: 'warning',
  },
};

export const WithoutAction: Story = {
  args: {
    icon: <IconRocket size={32} />,
    title: 'Simple Feature',
    description: 'This card has no action button.',
    variant: 'info',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        width: '800px',
      }}
    >
      <FeatureCard
        icon={<IconRocket size={32} />}
        title="Primary Variant"
        description="Default primary color variant for general features."
        variant="primary"
      />
      <FeatureCard
        icon={<IconShield size={32} />}
        title="Success Variant"
        description="Success color variant for positive features."
        variant="success"
      />
      <FeatureCard
        icon={<IconBolt size={32} />}
        title="Warning Variant"
        description="Warning color variant for important notices."
        variant="warning"
      />
      <FeatureCard
        icon={<IconRocket size={32} />}
        title="Error Variant"
        description="Error color variant for critical features."
        variant="error"
      />
      <FeatureCard
        icon={<IconShield size={32} />}
        title="Info Variant"
        description="Info color variant for informational features."
        variant="info"
      />
    </div>
  ),
};
