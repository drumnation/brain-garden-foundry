import {useEffect} from 'react';
import {useStore} from 'zustand';
import {getAuthStore} from './auth.store.js';

/**
 * Hook to access the auth store
 */
export const useAuth = () => {
  const store = getAuthStore();
  return useStore(store);
};

/**
 * Hook to get just the user
 */
export const useUser = () => {
  const store = getAuthStore();
  return useStore(store, (state) => state.user);
};

/**
 * Hook to get just the session
 */
export const useSession = () => {
  const store = getAuthStore();
  return useStore(store, (state) => state.session);
};

/**
 * Hook to check if authenticated
 */
export const useIsAuthenticated = () => {
  const store = getAuthStore();
  return useStore(store, (state) => state.isAuthenticated);
};

/**
 * Hook to get auth loading state
 */
export const useAuthLoading = () => {
  const store = getAuthStore();
  return useStore(store, (state) => state.isLoading);
};

/**
 * Hook to get auth error
 */
export const useAuthError = () => {
  const store = getAuthStore();
  return useStore(store, (state) => state.error);
};

/**
 * Hook to perform auth check on mount
 */
export const useAuthCheck = () => {
  const checkAuth = useAuth().checkAuth;

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
};

/**
 * Hook to require authentication
 * Redirects to login if not authenticated
 */
export const useRequireAuth = (redirectTo = '/login') => {
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuthLoading();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // In a real app, you'd use your router here
      // For example with React Router:
      // navigate(redirectTo);
      console.warn(`User not authenticated. Redirect to ${redirectTo}`);
    }
  }, [isAuthenticated, isLoading, redirectTo]);

  return {isAuthenticated, isLoading};
};

/**
 * Hook to require guest (not authenticated)
 * Redirects to home if authenticated
 */
export const useRequireGuest = (redirectTo = '/') => {
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuthLoading();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // In a real app, you'd use your router here
      // For example with React Router:
      // navigate(redirectTo);
      console.warn(`User already authenticated. Redirect to ${redirectTo}`);
    }
  }, [isAuthenticated, isLoading, redirectTo]);

  return {isAuthenticated, isLoading};
};

/**
 * Hook to handle auth actions with error handling
 */
export const useAuthActions = () => {
  const store = getAuthStore();
  const state = useStore(store);

  return {
    signUp: async (email: string, password: string, name?: string) => {
      try {
        await state.signUp(email, password, name);
        return {success: true, error: null};
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Sign up failed',
        };
      }
    },

    signIn: async (email: string, password: string) => {
      try {
        await state.signIn(email, password);
        return {success: true, error: null};
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Sign in failed',
        };
      }
    },

    signOut: async (all = false) => {
      try {
        await state.signOut(all);
        return {success: true, error: null};
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Sign out failed',
        };
      }
    },

    updateProfile: async (name?: string, email?: string, password?: string) => {
      try {
        await state.updateProfile(name, email, password);
        return {success: true, error: null};
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Update failed',
        };
      }
    },

    updatePassword: async (oldPassword: string, newPassword: string) => {
      try {
        await state.updatePassword(oldPassword, newPassword);
        return {success: true, error: null};
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : 'Password update failed',
        };
      }
    },

    resetPassword: async (email: string, url: string) => {
      try {
        await state.resetPassword(email, url);
        return {success: true, error: null};
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : 'Password reset failed',
        };
      }
    },

    completePasswordReset: async (
      userId: string,
      secret: string,
      password: string,
    ) => {
      try {
        await state.completePasswordReset(userId, secret, password);
        return {success: true, error: null};
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : 'Password reset failed',
        };
      }
    },

    sendEmailVerification: async (url: string) => {
      try {
        await state.sendEmailVerification(url);
        return {success: true, error: null};
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Verification failed',
        };
      }
    },

    completeEmailVerification: async (userId: string, secret: string) => {
      try {
        await state.completeEmailVerification(userId, secret);
        return {success: true, error: null};
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Verification failed',
        };
      }
    },
  };
};
