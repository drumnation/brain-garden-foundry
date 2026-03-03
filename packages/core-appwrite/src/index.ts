// Core Appwrite client exports

// Re-export commonly used Appwrite types
export type {
  ExecutionMethod,
  ID,
  Models,
  Permission,
  Role,
} from 'appwrite';
export {
  type AppwriteClient,
  type AppwriteConfig,
  getDefaultClient,
  makeAppwriteClient,
  resetDefaultClient,
} from './client.js';

// Export error handling utilities
export {AppwriteError, isAppwriteError} from './errors.js';

// Export type utilities
export * from './types.js';
