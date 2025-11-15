import { describe, it, expect, beforeEach, vi } from 'vitest';
import { makeAppwriteClient } from './client.js';
import { Client, Account, Databases, Storage, Teams, Functions, Realtime } from 'appwrite';

// Mock Appwrite SDK
vi.mock('appwrite', () => ({
  Client: vi.fn().mockImplementation(() => ({
    setEndpoint: vi.fn().mockReturnThis(),
    setProject: vi.fn().mockReturnThis(),
    setKey: vi.fn().mockReturnThis(),
    setJWT: vi.fn().mockReturnThis(),
    setLocale: vi.fn().mockReturnThis(),
  })),
  Account: vi.fn(),
  Databases: vi.fn(),
  Storage: vi.fn(),
  Teams: vi.fn(),
  Functions: vi.fn(),
  Realtime: vi.fn(),
}));

describe('AppwriteClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('makeAppwriteClient', () => {
    it('should create a client with required configuration', () => {
      const config = {
        endpoint: 'https://cloud.appwrite.io/v1',
        projectId: 'test-project-id',
      };

      const client = makeAppwriteClient(config);

      expect(client).toBeDefined();
      expect(client.client).toBeDefined();
      expect(client.account).toBeDefined();
      expect(client.databases).toBeDefined();
      expect(client.storage).toBeDefined();
      expect(client.realtime).toBeDefined();
    });

    it('should set endpoint and project ID on the client', () => {
      const config = {
        endpoint: 'https://cloud.appwrite.io/v1',
        projectId: 'test-project-id',
      };

      const client = makeAppwriteClient(config);
      const mockClient = client.client as any;

      expect(mockClient.setEndpoint).toHaveBeenCalledWith(config.endpoint);
      expect(mockClient.setProject).toHaveBeenCalledWith(config.projectId);
    });

    it('should set API key when provided', () => {
      const config = {
        endpoint: 'https://cloud.appwrite.io/v1',
        projectId: 'test-project-id',
        apiKey: 'test-api-key',
      };

      const client = makeAppwriteClient(config);
      const mockClient = client.client as any;

      expect(mockClient.setKey).toHaveBeenCalledWith(config.apiKey);
    });

    it('should set JWT when provided', () => {
      const config = {
        endpoint: 'https://cloud.appwrite.io/v1',
        projectId: 'test-project-id',
        jwt: 'test-jwt-token',
      };

      const client = makeAppwriteClient(config);
      const mockClient = client.client as any;

      expect(mockClient.setJWT).toHaveBeenCalledWith(config.jwt);
    });

    it('should set locale when provided', () => {
      const config = {
        endpoint: 'https://cloud.appwrite.io/v1',
        projectId: 'test-project-id',
        locale: 'en-US',
      };

      const client = makeAppwriteClient(config);
      const mockClient = client.client as any;

      expect(mockClient.setLocale).toHaveBeenCalledWith(config.locale);
    });

    it('should use environment variables as defaults', () => {
      const originalEnv = process.env;
      process.env = {
        ...originalEnv,
        VITE_APPWRITE_ENDPOINT: 'https://env.appwrite.io/v1',
        VITE_APPWRITE_PROJECT_ID: 'env-project-id',
        VITE_APPWRITE_API_KEY: 'env-api-key',
      };

      const client = makeAppwriteClient();
      const mockClient = client.client as any;

      expect(mockClient.setEndpoint).toHaveBeenCalledWith('https://env.appwrite.io/v1');
      expect(mockClient.setProject).toHaveBeenCalledWith('env-project-id');
      expect(mockClient.setKey).toHaveBeenCalledWith('env-api-key');

      process.env = originalEnv;
    });

    it('should throw error when required config is missing', () => {
      const originalEnv = process.env;
      process.env = { ...originalEnv };
      delete process.env.VITE_APPWRITE_ENDPOINT;
      delete process.env.VITE_APPWRITE_PROJECT_ID;

      expect(() => makeAppwriteClient()).toThrow('Appwrite endpoint is required');

      process.env = originalEnv;
    });

    it('should create service instances with the client', () => {
      const config = {
        endpoint: 'https://cloud.appwrite.io/v1',
        projectId: 'test-project-id',
      };

      const client = makeAppwriteClient(config);

      expect(Account).toHaveBeenCalledWith(client.client);
      expect(Databases).toHaveBeenCalledWith(client.client);
      expect(Storage).toHaveBeenCalledWith(client.client);
      expect(Teams).toHaveBeenCalledWith(client.client);
      expect(Functions).toHaveBeenCalledWith(client.client);
      expect(Realtime).toHaveBeenCalledWith(client.client);
    });

    it('should provide a method to update JWT', () => {
      const config = {
        endpoint: 'https://cloud.appwrite.io/v1',
        projectId: 'test-project-id',
      };

      const client = makeAppwriteClient(config);
      const newJWT = 'new-jwt-token';

      client.setJWT(newJWT);
      const mockClient = client.client as any;

      expect(mockClient.setJWT).toHaveBeenCalledWith(newJWT);
    });

    it('should provide a method to clear authentication', () => {
      const config = {
        endpoint: 'https://cloud.appwrite.io/v1',
        projectId: 'test-project-id',
        jwt: 'test-jwt',
      };

      const client = makeAppwriteClient(config);

      client.clearAuth();
      const mockClient = client.client as any;

      // Should be called twice - once during setup, once during clear
      expect(mockClient.setJWT).toHaveBeenCalledTimes(2);
      expect(mockClient.setJWT).toHaveBeenLastCalledWith('');
    });
  });
});