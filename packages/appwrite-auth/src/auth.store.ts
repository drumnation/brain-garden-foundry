import type {Session, User} from '@brain-garden/core-appwrite';
import {create} from 'zustand';
import {devtools, persist} from 'zustand/middleware';
import type {AuthService} from './auth.service.js';

export interface AuthState {
  // State
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;

  // Async Actions (require AuthService)
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: (all?: boolean) => Promise<void>;
  checkAuth: () => Promise<void>;
  updateProfile: (
    name?: string,
    email?: string,
    password?: string,
  ) => Promise<void>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  resetPassword: (email: string, url: string) => Promise<void>;
  completePasswordReset: (
    userId: string,
    secret: string,
    password: string,
  ) => Promise<void>;
  sendEmailVerification: (url: string) => Promise<void>;
  completeEmailVerification: (userId: string, secret: string) => Promise<void>;
}

const initialState = {
  user: null,
  session: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

/**
 * Creates an auth store with Zustand
 * Requires an AuthService instance for backend operations
 */
export const createAuthStore = (authService: AuthService) => {
  return create<AuthState>()(
    devtools(
      persist(
        (set, get) => ({
          ...initialState,

          // Synchronous actions
          setUser: (user) =>
            set({
              user,
              isAuthenticated: !!user,
              error: null,
            }),

          setSession: (session) =>
            set({
              session,
              isAuthenticated: !!session,
            }),

          setLoading: (isLoading) => set({isLoading}),

          setError: (error) => set({error, isLoading: false}),

          reset: () => set(initialState),

          // Async actions with AuthService
          signUp: async (email, password, name) => {
            set({isLoading: true, error: null});
            try {
              const {user, session} = await authService.signUp({
                email,
                password,
                name,
              });
              set({
                user,
                session,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
            } catch (error) {
              set({
                error:
                  error instanceof Error ? error.message : 'Sign up failed',
                isLoading: false,
              });
              throw error;
            }
          },

          signIn: async (email, password) => {
            set({isLoading: true, error: null});
            try {
              const {user, session} = await authService.signIn({
                email,
                password,
              });
              set({
                user,
                session,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
            } catch (error) {
              set({
                error:
                  error instanceof Error ? error.message : 'Sign in failed',
                isLoading: false,
              });
              throw error;
            }
          },

          signOut: async (all = false) => {
            set({isLoading: true, error: null});
            try {
              await authService.signOut({all});
              set(initialState);
            } catch (error) {
              set({
                error:
                  error instanceof Error ? error.message : 'Sign out failed',
                isLoading: false,
              });
              throw error;
            }
          },

          checkAuth: async () => {
            set({isLoading: true, error: null});
            try {
              const user = await authService.getCurrentUser();
              set({
                user,
                isAuthenticated: !!user,
                isLoading: false,
                error: null,
              });
            } catch (error) {
              set({
                user: null,
                session: null,
                isAuthenticated: false,
                isLoading: false,
                error: null, // Don't show error for auth check
              });
            }
          },

          updateProfile: async (name, email, password) => {
            set({isLoading: true, error: null});
            try {
              const user = await authService.updateProfile({
                name,
                email,
                password,
              });
              set({
                user,
                isLoading: false,
                error: null,
              });
            } catch (error) {
              set({
                error: error instanceof Error ? error.message : 'Update failed',
                isLoading: false,
              });
              throw error;
            }
          },

          updatePassword: async (oldPassword, newPassword) => {
            set({isLoading: true, error: null});
            try {
              await authService.updatePassword({oldPassword, newPassword});
              set({
                isLoading: false,
                error: null,
              });
            } catch (error) {
              set({
                error:
                  error instanceof Error
                    ? error.message
                    : 'Password update failed',
                isLoading: false,
              });
              throw error;
            }
          },

          resetPassword: async (email, url) => {
            set({isLoading: true, error: null});
            try {
              await authService.resetPassword({email, url});
              set({
                isLoading: false,
                error: null,
              });
            } catch (error) {
              set({
                error:
                  error instanceof Error
                    ? error.message
                    : 'Password reset failed',
                isLoading: false,
              });
              throw error;
            }
          },

          completePasswordReset: async (userId, secret, password) => {
            set({isLoading: true, error: null});
            try {
              await authService.completePasswordReset({
                userId,
                secret,
                password,
              });
              set({
                isLoading: false,
                error: null,
              });
            } catch (error) {
              set({
                error:
                  error instanceof Error
                    ? error.message
                    : 'Password reset failed',
                isLoading: false,
              });
              throw error;
            }
          },

          sendEmailVerification: async (url) => {
            set({isLoading: true, error: null});
            try {
              await authService.sendEmailVerification(url);
              set({
                isLoading: false,
                error: null,
              });
            } catch (error) {
              set({
                error:
                  error instanceof Error
                    ? error.message
                    : 'Verification failed',
                isLoading: false,
              });
              throw error;
            }
          },

          completeEmailVerification: async (userId, secret) => {
            set({isLoading: true, error: null});
            try {
              await authService.completeEmailVerification({userId, secret});
              // Update user to reflect verified status
              const user = await authService.getCurrentUser();
              set({
                user,
                isLoading: false,
                error: null,
              });
            } catch (error) {
              set({
                error:
                  error instanceof Error
                    ? error.message
                    : 'Verification failed',
                isLoading: false,
              });
              throw error;
            }
          },
        }),
        {
          name: 'auth-storage',
          partialize: (state) => ({
            user: state.user,
            session: state.session,
            isAuthenticated: state.isAuthenticated,
          }),
        },
      ),
      {
        name: 'AuthStore',
      },
    ),
  );
};

/**
 * Default auth store instance
 * Must be initialized with an AuthService before use
 */
let defaultAuthStore: ReturnType<typeof createAuthStore> | null = null;

export const initializeAuthStore = (authService: AuthService) => {
  if (!defaultAuthStore) {
    defaultAuthStore = createAuthStore(authService);
  }
  return defaultAuthStore;
};

export const getAuthStore = () => {
  if (!defaultAuthStore) {
    throw new Error(
      'Auth store not initialized. Call initializeAuthStore first.',
    );
  }
  return defaultAuthStore;
};
