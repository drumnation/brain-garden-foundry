// Core Appwrite client exports
export {
  makeAppwriteClient,
  getDefaultClient,
  resetDefaultClient,
  type AppwriteConfig,
  type AppwriteClient,
} from './client.js';

// Re-export commonly used Appwrite types
export type {
  Models,
  ID,
  Permission,
  Role,
  ExecutionMethod,
} from 'appwrite';

// Export error handling utilities
export { AppwriteError, isAppwriteError } from './errors.js';

// Export type utilities
export * from './types.js';