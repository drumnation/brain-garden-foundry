import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProtectedRoute } from './ProtectedRoute';

// Mock the auth hook
vi.mock('@brain-garden/appwrite-auth', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '@brain-garden/appwrite-auth';

describe('ProtectedRoute', () => {
  const mockUseAuth = useAuth as any;

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render children when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'user123', email: 'user@example.com' },
      isLoading: false,
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should render loading spinner when auth is loading', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: true,
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should render custom loading component when provided', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: true,
    });

    render(
      <ProtectedRoute loadingComponent={<div>Custom Loading...</div>}>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Custom Loading...')).toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', () => {
    const mockRedirect = vi.fn();
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
    });

    render(
      <ProtectedRoute onRedirect={mockRedirect}>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(mockRedirect).toHaveBeenCalledWith('/login');
  });

  it('should redirect to custom path when provided', () => {
    const mockRedirect = vi.fn();
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
    });

    render(
      <ProtectedRoute redirectTo="/auth/signin" onRedirect={mockRedirect}>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(mockRedirect).toHaveBeenCalledWith('/auth/signin');
  });

  it('should render fallback component when not authenticated and no redirect handler', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByText(/you must be logged in/i)).toBeInTheDocument();
  });

  it('should render custom fallback component when provided', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
    });

    render(
      <ProtectedRoute fallbackComponent={<div>Please sign in first</div>}>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Please sign in first')).toBeInTheDocument();
  });

  it('should check for required roles when specified', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'user123',
        email: 'user@example.com',
        roles: ['user']
      },
      isLoading: false,
    });

    render(
      <ProtectedRoute requiredRoles={['admin']}>
        <div>Admin Content</div>
      </ProtectedRoute>
    );

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    expect(screen.getByText(/you don't have permission/i)).toBeInTheDocument();
  });

  it('should render children when user has required role', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'user123',
        email: 'admin@example.com',
        roles: ['user', 'admin']
      },
      isLoading: false,
    });

    render(
      <ProtectedRoute requiredRoles={['admin']}>
        <div>Admin Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  it('should check for required permissions when specified', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'user123',
        email: 'user@example.com',
        permissions: ['read']
      },
      isLoading: false,
    });

    render(
      <ProtectedRoute requiredPermissions={['write', 'delete']}>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByText(/you don't have permission/i)).toBeInTheDocument();
  });

  it('should render children when user has all required permissions', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'user123',
        email: 'user@example.com',
        permissions: ['read', 'write', 'delete']
      },
      isLoading: false,
    });

    render(
      <ProtectedRoute requiredPermissions={['write', 'delete']}>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should call onUnauthorized callback when provided and user lacks permission', () => {
    const mockOnUnauthorized = vi.fn();
    mockUseAuth.mockReturnValue({
      user: {
        id: 'user123',
        email: 'user@example.com',
        roles: ['user']
      },
      isLoading: false,
    });

    render(
      <ProtectedRoute
        requiredRoles={['admin']}
        onUnauthorized={mockOnUnauthorized}
      >
        <div>Admin Content</div>
      </ProtectedRoute>
    );

    expect(mockOnUnauthorized).toHaveBeenCalledWith({
      user: expect.objectContaining({ id: 'user123' }),
      requiredRoles: ['admin'],
      requiredPermissions: undefined,
    });
  });
});