// Mock the auth hook
import {useAuth} from '@brain-garden/appwrite-auth';
import {Button, Card, Text, Title} from '@mantine/core';
import type {Meta, StoryObj} from '@storybook/react';
import {vi} from 'vitest';
import {ProtectedRoute} from './ProtectedRoute';

vi.mock('@brain-garden/appwrite-auth', () => ({
  useAuth: vi.fn(),
}));

const meta: Meta<typeof ProtectedRoute> = {
  title: 'Auth/ProtectedRoute',
  component: ProtectedRoute,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{width: '600px', height: '400px'}}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProtectedRoute>;

// Sample protected content component
const ProtectedContent = () => (
  <Card shadow="sm" padding="lg" radius="md" withBorder>
    <Title order={2} mb="md">
      Protected Dashboard
    </Title>
    <Text size="sm" color="dimmed" mb="lg">
      This content is only visible to authenticated users.
    </Text>
    <Button variant="outline">View Profile</Button>
  </Card>
);

// Authenticated user story
export const Authenticated: Story = {
  args: {
    children: <ProtectedContent />,
  },
  beforeEach: () => {
    (useAuth as any).mockReturnValue({
      user: {
        id: 'user123',
        email: 'user@example.com',
        name: 'John Doe',
      },
      isLoading: false,
    });
  },
};

// Loading state
export const Loading: Story = {
  args: {
    children: <ProtectedContent />,
  },
  beforeEach: () => {
    (useAuth as any).mockReturnValue({
      user: null,
      isLoading: true,
    });
  },
};

// Custom loading component
export const CustomLoading: Story = {
  args: {
    children: <ProtectedContent />,
    loadingComponent: (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text align="center">🔄 Checking your authentication status...</Text>
      </Card>
    ),
  },
  beforeEach: () => {
    (useAuth as any).mockReturnValue({
      user: null,
      isLoading: true,
    });
  },
};

// Not authenticated - default fallback
export const NotAuthenticated: Story = {
  args: {
    children: <ProtectedContent />,
  },
  beforeEach: () => {
    (useAuth as any).mockReturnValue({
      user: null,
      isLoading: false,
    });
  },
};

// Not authenticated - custom fallback
export const CustomFallback: Story = {
  args: {
    children: <ProtectedContent />,
    fallbackComponent: (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={3} mb="md">
          Sign In Required
        </Title>
        <Text size="sm" color="dimmed" mb="lg">
          Please sign in to access your dashboard.
        </Text>
        <Button fullWidth>Sign In</Button>
      </Card>
    ),
  },
  beforeEach: () => {
    (useAuth as any).mockReturnValue({
      user: null,
      isLoading: false,
    });
  },
};

// With redirect handler
export const WithRedirect: Story = {
  args: {
    children: <ProtectedContent />,
    onRedirect: (path) => {
      console.log(`Redirecting to: ${path}`);
      alert(`Would redirect to: ${path}`);
    },
    redirectTo: '/auth/login',
  },
  beforeEach: () => {
    (useAuth as any).mockReturnValue({
      user: null,
      isLoading: false,
    });
  },
};

// Admin only - user has admin role
export const AdminAccess: Story = {
  args: {
    children: (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={2} mb="md">
          Admin Panel
        </Title>
        <Text size="sm" color="dimmed" mb="lg">
          Only administrators can see this content.
        </Text>
      </Card>
    ),
    requiredRoles: ['admin'],
  },
  beforeEach: () => {
    (useAuth as any).mockReturnValue({
      user: {
        id: 'admin123',
        email: 'admin@example.com',
        name: 'Admin User',
        roles: ['user', 'admin'],
      },
      isLoading: false,
    });
  },
};

// Admin only - user lacks admin role
export const InsufficientRole: Story = {
  args: {
    children: (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={2} mb="md">
          Admin Panel
        </Title>
      </Card>
    ),
    requiredRoles: ['admin'],
  },
  beforeEach: () => {
    (useAuth as any).mockReturnValue({
      user: {
        id: 'user123',
        email: 'user@example.com',
        name: 'Regular User',
        roles: ['user'],
      },
      isLoading: false,
    });
  },
};

// Permission-based access - has permissions
export const WithPermissions: Story = {
  args: {
    children: (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={2} mb="md">
          Content Editor
        </Title>
        <Text size="sm" color="dimmed" mb="lg">
          You can edit and delete content here.
        </Text>
      </Card>
    ),
    requiredPermissions: ['write', 'delete'],
  },
  beforeEach: () => {
    (useAuth as any).mockReturnValue({
      user: {
        id: 'editor123',
        email: 'editor@example.com',
        name: 'Editor User',
        permissions: ['read', 'write', 'delete'],
      },
      isLoading: false,
    });
  },
};

// Permission-based access - lacks permissions
export const InsufficientPermissions: Story = {
  args: {
    children: (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={2} mb="md">
          Content Editor
        </Title>
      </Card>
    ),
    requiredPermissions: ['write', 'delete'],
  },
  beforeEach: () => {
    (useAuth as any).mockReturnValue({
      user: {
        id: 'viewer123',
        email: 'viewer@example.com',
        name: 'Viewer User',
        permissions: ['read'],
      },
      isLoading: false,
    });
  },
};

// With unauthorized callback
export const WithUnauthorizedCallback: Story = {
  args: {
    children: <ProtectedContent />,
    requiredRoles: ['admin'],
    onUnauthorized: (data) => {
      console.log('Unauthorized access attempted:', data);
      alert(`User ${data.user.email} tried to access admin area`);
    },
  },
  beforeEach: () => {
    (useAuth as any).mockReturnValue({
      user: {
        id: 'user123',
        email: 'user@example.com',
        name: 'Regular User',
        roles: ['user'],
      },
      isLoading: false,
    });
  },
};

// Multiple requirements
export const MultipleRequirements: Story = {
  args: {
    children: (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={2} mb="md">
          Super Admin Area
        </Title>
        <Text size="sm" color="dimmed" mb="lg">
          Only super admins with full permissions can see this.
        </Text>
      </Card>
    ),
    requiredRoles: ['admin', 'super-admin'],
    requiredPermissions: ['manage-users', 'manage-system'],
  },
  beforeEach: () => {
    (useAuth as any).mockReturnValue({
      user: {
        id: 'superadmin123',
        email: 'superadmin@example.com',
        name: 'Super Admin',
        roles: ['user', 'admin', 'super-admin'],
        permissions: [
          'read',
          'write',
          'delete',
          'manage-users',
          'manage-system',
        ],
      },
      isLoading: false,
    });
  },
};
