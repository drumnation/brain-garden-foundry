import type {AppwriteClient, Session, User} from '@brain-garden/core-appwrite';
import {AppwriteError} from '@brain-garden/core-appwrite';
import {ID} from 'appwrite';

export interface SignUpParams {
  email: string;
  password: string;
  name?: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface SignOutParams {
  all?: boolean;
}

export interface UpdateProfileParams {
  name?: string;
  email?: string;
  password?: string; // Required when updating email
}

export interface UpdatePasswordParams {
  oldPassword: string;
  newPassword: string;
}

export interface ResetPasswordParams {
  email: string;
  url: string;
}

export interface CompletePasswordResetParams {
  userId: string;
  secret: string;
  password: string;
}

export interface VerifyEmailParams {
  userId: string;
  secret: string;
}

export interface AuthResponse {
  user: User;
  session: Session;
}

export interface AuthService {
  signUp: (params: SignUpParams) => Promise<AuthResponse>;
  signIn: (params: SignInParams) => Promise<AuthResponse>;
  signOut: (params?: SignOutParams) => Promise<void>;
  getCurrentUser: () => Promise<User | null>;
  updateProfile: (params: UpdateProfileParams) => Promise<User>;
  updatePassword: (params: UpdatePasswordParams) => Promise<void>;
  resetPassword: (params: ResetPasswordParams) => Promise<void>;
  completePasswordReset: (params: CompletePasswordResetParams) => Promise<void>;
  sendEmailVerification: (url: string) => Promise<void>;
  completeEmailVerification: (params: VerifyEmailParams) => Promise<void>;
  createJWT: () => Promise<string>;
}

/**
 * Email validation regex
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate email format
 */
const validateEmail = (email: string): void => {
  if (!EMAIL_REGEX.test(email)) {
    throw new AppwriteError('Invalid email format', 400, 'validation_error');
  }
};

/**
 * Validate password strength
 */
const validatePassword = (password: string): void => {
  if (password.length < 8) {
    throw new AppwriteError(
      'Password must be at least 8 characters',
      400,
      'validation_error',
    );
  }
};

/**
 * Creates an authentication service with Appwrite
 */
export const makeAuthService = (deps: {
  appwriteClient: AppwriteClient;
}): AuthService => {
  const {appwriteClient} = deps;
  const {account} = appwriteClient;

  return {
    signUp: async ({email, password, name}) => {
      // Validate input
      validateEmail(email);
      validatePassword(password);
      // Create account
      const user = (await account.create(
        ID.unique(),
        email,
        password,
        name,
      )) as User;

      // Create session immediately after signup
      const session = (await account.createEmailPasswordSession(
        email,
        password,
      )) as Session;

      return {user, session};
    },

    signIn: async ({email, password}) => {
      // Create session
      const session = (await account.createEmailPasswordSession(
        email,
        password,
      )) as Session;

      // Get user details
      const user = (await account.get()) as User;

      return {user, session};
    },

    signOut: async (params = {}) => {
      if (params.all) {
        // Delete all sessions
        await account.deleteSessions();
      } else {
        // Delete current session
        await account.deleteSession('current');
      }

      // Clear JWT from client
      appwriteClient.clearAuth();
    },

    getCurrentUser: async () => {
      try {
        const user = (await account.get()) as User;
        return user;
      } catch (_error) {
        // Return null if not authenticated
        return null;
      }
    },

    updateProfile: async ({name, email, password}) => {
      if (name !== undefined) {
        return (await account.updateName(name)) as User;
      }

      if (email !== undefined) {
        if (!password) {
          throw new AppwriteError(
            'Password required to update email',
            400,
            'validation_error',
          );
        }
        validateEmail(email);
        return (await account.updateEmail(email, password)) as User;
      }

      // No updates requested, return current user
      return (await account.get()) as User;
    },

    updatePassword: async ({oldPassword, newPassword}) => {
      validatePassword(newPassword);
      await account.updatePassword(newPassword, oldPassword);
    },

    resetPassword: async ({email, url}) => {
      validateEmail(email);
      await account.createRecovery(email, url);
    },

    completePasswordReset: async ({userId, secret, password}) => {
      validatePassword(password);
      await account.updateRecovery(userId, secret, password);
    },

    sendEmailVerification: async (url: string) => {
      await account.createVerification(url);
    },

    completeEmailVerification: async ({userId, secret}) => {
      await account.updateVerification(userId, secret);
    },

    createJWT: async () => {
      const {jwt} = await account.createJWT();
      // Set the JWT on the client
      appwriteClient.setJWT(jwt);
      return jwt;
    },
  };
};
