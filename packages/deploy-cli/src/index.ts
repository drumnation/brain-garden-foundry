// Main exports for programmatic usage
export * from './commands/index.js';

// Types
export interface DeployConfig {
  project: string;
  environment: 'production' | 'staging' | 'development';
  appwrite: {
    endpoint: string;
    projectId: string;
    apiKey?: string;
    collections: string[];
    buckets: string[];
    functions: string[];
  };
  github: {
    repository: string;
    secretsConfigured: boolean;
    actionsEnabled: boolean;
  };
  domains: {
    production: string;
    preview: string;
  };
  migrations: {
    current: string;
    history: Array<{
      id: string;
      name: string;
      appliedAt: string;
    }>;
  };
  lastSync?: string;
}

export interface DeployOptions {
  project?: string;
  endpoint?: string;
  noInteractive?: boolean;
  dryRun?: boolean;
  force?: boolean;
  verbose?: boolean;
  json?: boolean;
  migrations?: boolean;
  keepData?: boolean;
}
