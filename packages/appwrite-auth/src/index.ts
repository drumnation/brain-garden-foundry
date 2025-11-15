// Auth service exports
export {
  makeAuthService,
  type AuthService,
  type SignUpParams,
  type SignInParams,
  type SignOutParams,
  type UpdateProfileParams,
  type UpdatePasswordParams,
  type ResetPasswordParams,
  type CompletePasswordResetParams,
  type VerifyEmailParams,
  type AuthResponse,
} from './auth.service.js';

// Auth store exports
export {
  createAuthStore,
  initializeAuthStore,
  getAuthStore,
  type AuthState,
} from './auth.store.js';

// Auth hooks exports
export {
  useAuth,
  useUser,
  useSession,
  useIsAuthenticated,
  useAuthLoading,
  useAuthError,
  useAuthCheck,
  useRequireAuth,
  useRequireGuest,
  useAuthActions,
} from './auth.hooks.js';