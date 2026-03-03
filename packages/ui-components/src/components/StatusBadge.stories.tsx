import type {Meta, StoryObj} from '@storybook/react';
import {
  IconAlertTriangle,
  IconCheck,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react';
import {StatusBadge} from './StatusBadge';

const meta = {
  title: 'UI Components/StatusBadge',
  component: StatusBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['success', 'warning', 'error', 'info', 'neutral'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    status: 'success',
    children: 'Active',
  },
};

export const Warning: Story = {
  args: {
    status: 'warning',
    children: 'Pending',
  },
};

export const ErrorStatus: Story = {
  args: {
    status: 'error',
    children: 'Failed',
  },
};

export const Info: Story = {
  args: {
    status: 'info',
    children: 'In Progress',
  },
};

export const Neutral: Story = {
  args: {
    status: 'neutral',
    children: 'Draft',
  },
};

export const WithIcon: Story = {
  args: {
    status: 'success',
    children: 'Completed',
    leftSection: <IconCheck size={12} />,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        alignItems: 'flex-start',
      }}
    >
      <StatusBadge status="success" size="xs">
        Extra Small
      </StatusBadge>
      <StatusBadge status="success" size="sm">
        Small
      </StatusBadge>
      <StatusBadge status="success" size="md">
        Medium (Default)
      </StatusBadge>
      <StatusBadge status="success" size="lg">
        Large
      </StatusBadge>
      <StatusBadge status="success" size="xl">
        Extra Large
      </StatusBadge>
    </div>
  ),
};

export const AllStatuses: Story = {
  render: () => (
    <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
      <StatusBadge status="success" leftSection={<IconCheck size={12} />}>
        Success
      </StatusBadge>
      <StatusBadge
        status="warning"
        leftSection={<IconAlertTriangle size={12} />}
      >
        Warning
      </StatusBadge>
      <StatusBadge status="error" leftSection={<IconX size={12} />}>
        Error
      </StatusBadge>
      <StatusBadge status="info" leftSection={<IconInfoCircle size={12} />}>
        Info
      </StatusBadge>
      <StatusBadge status="neutral">Neutral</StatusBadge>
    </div>
  ),
};
