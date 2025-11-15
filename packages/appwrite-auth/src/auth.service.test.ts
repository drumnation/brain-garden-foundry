import { describe, it, expect, beforeEach, vi } from 'vitest';
import { makeAuthService } from './auth.service.js';
import type { AppwriteClient } from '@brain-garden/core-appwrite';
import { AppwriteError } from '@brain-garden/core-appwrite';
import { ID } from 'appwrite';

// Mock Appwrite client
const createMockClient = (): AppwriteClient => ({
  client: {} as any,
  account: {
    create: vi.fn(),
    createEmailPasswordSession: vi.fn(),
    createJWT: vi.fn(),
    get: vi.fn(),
    updateName: vi.fn(),
    updateEmail: vi.fn(),
    updatePassword: vi.fn(),
    deleteSession: vi.fn(),
    deleteSessions: vi.fn(),
    createRecovery: vi.fn(),
    updateRecovery: vi.fn(),
    createVerification: vi.fn(),
    updateVerification: vi.fn(),
  } as any,
  databases: {} as any,
  storage: {} as any,
  teams: {} as any,
  functions: {} as any,
  realtime: {} as any,
  setJWT: vi.fn(),
  clearAuth: vi.fn(),
});

describe('AuthService', () => {
  let mockClient: AppwriteClient;
  let authService: ReturnType<typeof makeAuthService>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockClient = createMockClient();
    authService = makeAuthService({ appwriteClient: mockClient });
  });

  describe('signUp', () => {
    it('should create a new user account', async () => {
      const mockUser = {
        $id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
      };
      const mockSession = { $id: 'session-123', userId: 'user-123' };

      mockClient.account.create.mockResolvedValue(mockUser);
      mockClient.account.createEmailPasswordSession.mockResolvedValue(mockSession);

      const result = await authService.signUp({
        email: 'test@example.com',
        password: 'SecurePass123!',
        name: 'Test User',
      });

      expect(mockClient.account.create).toHaveBeenCalledWith(
        expect.any(String),
        'test@example.com',
        'SecurePass123!',
        'Test User',
      );
      expect(mockClient.account.createEmailPasswordSession).toHaveBeenCalledWith(
        'test@example.com',
        'SecurePass123!',
      );
      expect(result).toEqual({
        user: mockUser,
        session: mockSession,
      });
    });

    it('should handle signup errors', async () => {
      mockClient.account.create.mockRejectedValue(
        new Error('Email already exists'),
      );

      await expect(
        authService.signUp({
          email: 'test@example.com',
          password: 'SecurePass123!',
          name: 'Test User',
        }),
      ).rejects.toThrow('Email already exists');
    });

    it('should validate email format', async () => {
      await expect(
        authService.signUp({
          email: 'invalid-email',
          password: 'SecurePass123!',
          name: 'Test User',
        }),
      ).rejects.toThrow('Invalid email format');
    });

    it('should validate password strength', async () => {
      await expect(
        authService.signUp({
          email: 'test@example.com',
          password: '123', // Too weak
          name: 'Test User',
        }),
      ).rejects.toThrow('Password must be at least 8 characters');
    });
  });

  describe('signIn', () => {
    it('should create a session for existing user', async () => {
      const mockSession = {
        $id: 'session-123',
        userId: 'user-123',
        expire: '2024-12-01',
      };
      const mockUser = {
        $id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
      };

      mockClient.account.createEmailPasswordSession.mockResolvedValue(mockSession);
      mockClient.account.get.mockResolvedValue(mockUser);

      const result = await authService.signIn({
        email: 'test@example.com',
        password: 'SecurePass123!',
      });

      expect(mockClient.account.createEmailPasswordSession).toHaveBeenCalledWith(
        'test@example.com',
        'SecurePass123!',
      );
      expect(mockClient.account.get).toHaveBeenCalled();
      expect(result).toEqual({
        user: mockUser,
        session: mockSession,
      });
    });

    it('should handle invalid credentials', async () => {
      mockClient.account.createEmailPasswordSession.mockRejectedValue(
        new Error('Invalid credentials'),
      );

      await expect(
        authService.signIn({
          email: 'test@example.com',
          password: 'WrongPassword',
        }),
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('signOut', () => {
    it('should delete current session', async () => {
      await authService.signOut();

      expect(mockClient.account.deleteSession).toHaveBeenCalledWith('current');
      expect(mockClient.clearAuth).toHaveBeenCalled();
    });

    it('should delete all sessions when specified', async () => {
      await authService.signOut({ all: true });

      expect(mockClient.account.deleteSessions).toHaveBeenCalled();
      expect(mockClient.clearAuth).toHaveBeenCalled();
    });
  });

  describe('getCurrentUser', () => {
    it('should return current authenticated user', async () => {
      const mockUser = {
        $id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
      };

      mockClient.account.get.mockResolvedValue(mockUser);

      const user = await authService.getCurrentUser();

      expect(mockClient.account.get).toHaveBeenCalled();
      expect(user).toEqual(mockUser);
    });

    it('should return null when not authenticated', async () => {
      mockClient.account.get.mockRejectedValue(
        new Error('User is not authenticated'),
      );

      const user = await authService.getCurrentUser();

      expect(user).toBeNull();
    });
  });

  describe('updateProfile', () => {
    it('should update user name', async () => {
      const mockUser = {
        $id: 'user-123',
        email: 'test@example.com',
        name: 'Updated Name',
      };

      mockClient.account.updateName.mockResolvedValue(mockUser);

      const user = await authService.updateProfile({ name: 'Updated Name' });

      expect(mockClient.account.updateName).toHaveBeenCalledWith('Updated Name');
      expect(user).toEqual(mockUser);
    });

    it('should update user email', async () => {
      const mockUser = {
        $id: 'user-123',
        email: 'new@example.com',
        name: 'Test User',
      };

      mockClient.account.updateEmail.mockResolvedValue(mockUser);

      const user = await authService.updateProfile({
        email: 'new@example.com',
        password: 'CurrentPassword',
      });

      expect(mockClient.account.updateEmail).toHaveBeenCalledWith(
        'new@example.com',
        'CurrentPassword',
      );
      expect(user).toEqual(mockUser);
    });

    it('should require password when updating email', async () => {
      await expect(
        authService.updateProfile({ email: 'new@example.com' }),
      ).rejects.toThrow('Password required to update email');
    });
  });

  describe('updatePassword', () => {
    it('should update user password', async () => {
      const mockUser = {
        $id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
      };

      mockClient.account.updatePassword.mockResolvedValue(mockUser);

      await authService.updatePassword({
        oldPassword: 'OldPass123!',
        newPassword: 'NewPass456!',
      });

      expect(mockClient.account.updatePassword).toHaveBeenCalledWith(
        'NewPass456!',
        'OldPass123!',
      );
    });

    it('should validate new password strength', async () => {
      await expect(
        authService.updatePassword({
          oldPassword: 'OldPass123!',
          newPassword: '123', // Too weak
        }),
      ).rejects.toThrow('Password must be at least 8 characters');
    });
  });

  describe('resetPassword', () => {
    it('should send password reset email', async () => {
      const mockToken = { expire: '2024-11-15T12:00:00Z' };

      mockClient.account.createRecovery.mockResolvedValue(mockToken);

      await authService.resetPassword({
        email: 'test@example.com',
        url: 'https://example.com/reset-password',
      });

      expect(mockClient.account.createRecovery).toHaveBeenCalledWith(
        'test@example.com',
        'https://example.com/reset-password',
      );
    });

    it('should complete password reset with token', async () => {
      const mockUser = {
        $id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
      };

      mockClient.account.updateRecovery.mockResolvedValue(mockUser);

      await authService.completePasswordReset({
        userId: 'user-123',
        secret: 'reset-token',
        password: 'NewPass123!',
      });

      expect(mockClient.account.updateRecovery).toHaveBeenCalledWith(
        'user-123',
        'reset-token',
        'NewPass123!',
      );
    });
  });

  describe('verifyEmail', () => {
    it('should send email verification', async () => {
      const mockVerification = { expire: '2024-11-15T12:00:00Z' };

      mockClient.account.createVerification.mockResolvedValue(mockVerification);

      await authService.sendEmailVerification('https://example.com/verify');

      expect(mockClient.account.createVerification).toHaveBeenCalledWith(
        'https://example.com/verify',
      );
    });

    it('should complete email verification', async () => {
      const mockVerification = { verified: true };

      mockClient.account.updateVerification.mockResolvedValue(mockVerification);

      await authService.completeEmailVerification({
        userId: 'user-123',
        secret: 'verify-token',
      });

      expect(mockClient.account.updateVerification).toHaveBeenCalledWith(
        'user-123',
        'verify-token',
      );
    });
  });

  describe('createJWT', () => {
    it('should create a JWT token', async () => {
      const mockJWT = { jwt: 'eyJhbGciOiJIUzI1NiIs...' };

      mockClient.account.createJWT.mockResolvedValue(mockJWT);

      const token = await authService.createJWT();

      expect(mockClient.account.createJWT).toHaveBeenCalled();
      expect(mockClient.setJWT).toHaveBeenCalledWith(mockJWT.jwt);
      expect(token).toEqual(mockJWT.jwt);
    });
  });
});