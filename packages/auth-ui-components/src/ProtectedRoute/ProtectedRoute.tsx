import {useAuth} from '@brain-garden/appwrite-auth';
import {Alert, Center, Loader, Stack, Text} from '@mantine/core';
import {IconAlertCircle} from '@tabler/icons-react';
import {useEffect} from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  redirectTo?: string;
  onRedirect?: (path: string) => void;
  onUnauthorized?: (data: {
    user: any;
    requiredRoles?: string[];
    requiredPermissions?: string[];
  }) => void;
  loadingComponent?: React.ReactNode;
  fallbackComponent?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  redirectTo = '/login',
  onRedirect,
  onUnauthorized,
  loadingComponent,
  fallbackComponent,
}: ProtectedRouteProps) {
  const {user, isLoading} = useAuth();

  // Effect for handling redirects
  useEffect(() => {
    if (!isLoading && !user && onRedirect) {
      onRedirect(redirectTo);
    }
  }, [isLoading, user, onRedirect, redirectTo]);

  // Show loading state
  if (isLoading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }
    return (
      <Center h="100vh">
        <Stack align="center" spacing="md">
          <Loader size="lg" />
          <Text size="sm" color="dimmed">
            Loading...
          </Text>
        </Stack>
      </Center>
    );
  }

  // User is not authenticated
  if (!user) {
    // If redirect handler is provided, it will handle the redirect
    // Show fallback UI while redirect happens
    if (onRedirect) {
      if (fallbackComponent) {
        return <>{fallbackComponent}</>;
      }
      return (
        <Center h="100vh">
          <Stack align="center" spacing="md">
            <Loader size="lg" />
            <Text size="sm" color="dimmed">
              Redirecting to login...
            </Text>
          </Stack>
        </Center>
      );
    }

    // No redirect handler, show fallback
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }

    return (
      <Center h="100vh">
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Authentication Required"
          color="yellow"
        >
          You must be logged in to access this page.
        </Alert>
      </Center>
    );
  }

  // Check for required roles
  if (requiredRoles.length > 0) {
    const userRoles = user.roles || [];
    const hasRequiredRole = requiredRoles.some((role) =>
      userRoles.includes(role),
    );

    if (!hasRequiredRole) {
      // Call unauthorized callback if provided
      if (onUnauthorized) {
        onUnauthorized({
          user,
          requiredRoles,
          requiredPermissions,
        });
      }

      if (fallbackComponent) {
        return <>{fallbackComponent}</>;
      }

      return (
        <Center h="100vh">
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Insufficient Permissions"
            color="red"
          >
            You don't have permission to access this page.
          </Alert>
        </Center>
      );
    }
  }

  // Check for required permissions
  if (requiredPermissions.length > 0) {
    const userPermissions = user.permissions || [];
    const hasAllPermissions = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasAllPermissions) {
      // Call unauthorized callback if provided
      if (onUnauthorized) {
        onUnauthorized({
          user,
          requiredRoles,
          requiredPermissions,
        });
      }

      if (fallbackComponent) {
        return <>{fallbackComponent}</>;
      }

      return (
        <Center h="100vh">
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Insufficient Permissions"
            color="red"
          >
            You don't have permission to access this page.
          </Alert>
        </Center>
      );
    }
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
}
