// Auth service exports

// Auth hooks exports
export {
  useAuth,
  useAuthActions,
  useAuthCheck,
  useAuthError,
  useAuthLoading,
  useIsAuthenticated,
  useRequireAuth,
  useRequireGuest,
  useSession,
  useUser,
} from './auth.hooks.js';
export {
  type AuthResponse,
  type AuthService,
  type CompletePasswordResetParams,
  makeAuthService,
  type ResetPasswordParams,
  type SignInParams,
  type SignOutParams,
  type SignUpParams,
  type UpdatePasswordParams,
  type UpdateProfileParams,
  type VerifyEmailParams,
} from './auth.service.js';
// Auth store exports
export {
  type AuthState,
  createAuthStore,
  getAuthStore,
  initializeAuthStore,
} from './auth.store.js';
