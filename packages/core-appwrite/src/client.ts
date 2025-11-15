import { Client, Account, Databases, Storage, Teams, Functions, Realtime } from 'appwrite';

export interface AppwriteConfig {
  endpoint?: string;
  projectId?: string;
  apiKey?: string;
  jwt?: string;
  locale?: string;
}

export interface AppwriteClient {
  client: Client;
  account: Account;
  databases: Databases;
  storage: Storage;
  teams: Teams;
  functions: Functions;
  realtime: Realtime;
  setJWT: (jwt: string) => void;
  clearAuth: () => void;
}

/**
 * Creates an Appwrite client with all services initialized
 * Uses environment variables as defaults, can be overridden with config
 */
export const makeAppwriteClient = (config: AppwriteConfig = {}): AppwriteClient => {
  // Get configuration from environment or provided config
  const endpoint = config.endpoint || process.env.VITE_APPWRITE_ENDPOINT || process.env.APPWRITE_ENDPOINT;
  const projectId = config.projectId || process.env.VITE_APPWRITE_PROJECT_ID || process.env.APPWRITE_PROJECT_ID;
  const apiKey = config.apiKey || process.env.VITE_APPWRITE_API_KEY || process.env.APPWRITE_API_KEY;
  const jwt = config.jwt;
  const locale = config.locale;

  // Validate required configuration
  if (!endpoint) {
    throw new Error('Appwrite endpoint is required');
  }
  if (!projectId) {
    throw new Error('Appwrite project ID is required');
  }

  // Create and configure the client
  const client = new Client();
  client.setEndpoint(endpoint).setProject(projectId);

  // Set optional authentication
  if (apiKey) {
    client.setKey(apiKey);
  }
  if (jwt) {
    client.setJWT(jwt);
  }
  if (locale) {
    client.setLocale(locale);
  }

  // Initialize all services
  const account = new Account(client);
  const databases = new Databases(client);
  const storage = new Storage(client);
  const teams = new Teams(client);
  const functions = new Functions(client);
  const realtime = new Realtime(client);

  // Return the client with all services and utility methods
  return {
    client,
    account,
    databases,
    storage,
    teams,
    functions,
    realtime,
    setJWT: (newJWT: string) => {
      client.setJWT(newJWT);
    },
    clearAuth: () => {
      client.setJWT('');
    },
  };
};

/**
 * Singleton instance for default client
 * Useful for simple applications that don't need multiple clients
 */
let defaultClient: AppwriteClient | null = null;

export const getDefaultClient = (config?: AppwriteConfig): AppwriteClient => {
  if (!defaultClient) {
    defaultClient = makeAppwriteClient(config);
  }
  return defaultClient;
};

export const resetDefaultClient = (): void => {
  defaultClient = null;
};