import {Account, Client, Databases, Functions, Storage, Teams} from 'appwrite';

/**
 * REAL Appwrite Client for Brain Garden Deployment
 * Connects to actual infrastructure at appwrite.singularity-labs.org
 */

// Real production endpoints - verified from brain-garden-appwrite project
const APPWRITE_ENDPOINT = 'https://appwrite.singularity-labs.org/v1';
const APPWRITE_PROJECT_ID = '6917d0a50033ebe8d013';

export interface AppwriteDeploymentConfig {
  projectName: string;
  apiKey?: string;
  endpoint?: string;
  projectId?: string;
}

export class AppwriteDeploymentClient {
  private client: Client;
  private account: Account;
  private databases: Databases;
  private storage: Storage;
  private teams: Teams;
  private functions: Functions;

  constructor(config: AppwriteDeploymentConfig) {
    // Use real production endpoints
    const endpoint = config.endpoint || APPWRITE_ENDPOINT;
    const projectId = config.projectId || APPWRITE_PROJECT_ID;

    this.client = new Client().setEndpoint(endpoint).setProject(projectId);

    // If API key provided, use it for server-side operations
    if (config.apiKey) {
      this.client.setKey(config.apiKey);
    }

    // Initialize services
    this.account = new Account(this.client);
    this.databases = new Databases(this.client);
    this.storage = new Storage(this.client);
    this.teams = new Teams(this.client);
    this.functions = new Functions(this.client);
  }

  /**
   * Test connection to Appwrite
   */
  async testConnection(): Promise<boolean> {
    try {
      // Try to get project info - this should work with API key
      const health = await fetch(`${APPWRITE_ENDPOINT}/health`, {
        headers: {
          'X-Appwrite-Project': APPWRITE_PROJECT_ID,
        },
      });
      return health.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  /**
   * Create database for new deployment
   */
  async createDatabase(name: string): Promise<string> {
    try {
      const databaseId = `${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_db`;

      const database = await this.databases.create(databaseId, name);

      console.log(`✅ Database created: ${database.$id}`);
      return database.$id;
    } catch (error: any) {
      // Database might already exist
      if (error.code === 409) {
        console.log('Database already exists, using existing one');
        return `${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_db`;
      }
      throw error;
    }
  }

  /**
   * Create default collections for Brain Garden apps
   */
  async createDefaultCollections(databaseId: string) {
    const collections = [
      {
        id: 'users',
        name: 'Users',
        permissions: ['read("any")', 'write("users")'],
      },
      {
        id: 'projects',
        name: 'Projects',
        permissions: ['read("users")', 'write("users")'],
      },
      {
        id: 'todos',
        name: 'Todos',
        permissions: ['read("users")', 'write("users")'],
      },
      {
        id: 'settings',
        name: 'Settings',
        permissions: ['read("users")', 'write("users")'],
      },
    ];

    for (const collection of collections) {
      try {
        await this.databases.createCollection(
          databaseId,
          collection.id,
          collection.name,
          collection.permissions,
        );
        console.log(`✅ Collection created: ${collection.name}`);
      } catch (error: any) {
        if (error.code === 409) {
          console.log(`Collection ${collection.name} already exists`);
        } else {
          console.error(
            `Failed to create collection ${collection.name}:`,
            error,
          );
        }
      }
    }
  }

  /**
   * Create storage bucket for file uploads
   */
  async createStorageBucket(name: string): Promise<string> {
    try {
      const bucketId = `${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_files`;

      const bucket = await this.storage.createBucket(
        bucketId,
        name,
        ['read("any")', 'write("users")'],
        false, // No encryption for now
        true, // Enable antivirus
        undefined,
        ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'], // Allowed extensions
        30000000, // 30MB max file size
      );

      console.log(`✅ Storage bucket created: ${bucket.$id}`);
      return bucket.$id;
    } catch (error: any) {
      if (error.code === 409) {
        console.log('Storage bucket already exists');
        return `${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_files`;
      }
      throw error;
    }
  }

  /**
   * Setup authentication methods
   */
  async setupAuthentication() {
    // Note: Auth provider setup requires console access
    // This function documents what needs to be configured

    const authConfig = {
      email: true,
      oauth2: {
        google: {
          enabled: false, // Need client ID/secret
          clientId: '',
          clientSecret: '',
        },
        github: {
          enabled: false, // Need client ID/secret
          clientId: '',
          clientSecret: '',
        },
      },
      teams: true,
      jwt: true,
      sessions: {
        limit: 10,
        duration: 365 * 24 * 60 * 60, // 1 year
      },
    };

    console.log('📝 Authentication configuration:');
    console.log('- Email/Password: Enabled');
    console.log('- Teams: Enabled');
    console.log('- JWT: Enabled');
    console.log('- Session duration: 1 year');
    console.log('- OAuth2: Configure in Appwrite console if needed');

    return authConfig;
  }

  /**
   * Generate environment variables for deployment
   */
  generateEnvVariables(
    projectName: string,
    databaseId: string,
    bucketId: string,
  ): Record<string, string> {
    return {
      // Public variables (safe for client-side)
      VITE_APPWRITE_ENDPOINT: APPWRITE_ENDPOINT,
      VITE_APPWRITE_PROJECT_ID: APPWRITE_PROJECT_ID,
      VITE_APPWRITE_DATABASE_ID: databaseId,
      VITE_APPWRITE_BUCKET_ID: bucketId,

      // Server-side variables
      APPWRITE_ENDPOINT: APPWRITE_ENDPOINT,
      APPWRITE_PROJECT_ID: APPWRITE_PROJECT_ID,
      APPWRITE_DATABASE_ID: databaseId,
      APPWRITE_BUCKET_ID: bucketId,

      // Deployment metadata
      DEPLOYMENT_NAME: projectName,
      DEPLOYMENT_DOMAIN: `${projectName}.singularity-labs.org`,
      DEPLOYMENT_TIMESTAMP: new Date().toISOString(),
    };
  }

  /**
   * Full deployment provisioning
   */
  async provisionDeployment(projectName: string): Promise<{
    success: boolean;
    config: Record<string, any>;
    envVars: Record<string, string>;
  }> {
    console.log(`🚀 Provisioning Appwrite resources for: ${projectName}`);

    try {
      // Test connection first
      const connected = await this.testConnection();
      if (!connected) {
        throw new Error(
          'Failed to connect to Appwrite. Check endpoint and credentials.',
        );
      }
      console.log('✅ Connected to Appwrite');

      // Create database
      const databaseId = await this.createDatabase(projectName);

      // Create collections
      await this.createDefaultCollections(databaseId);

      // Create storage bucket
      const bucketId = await this.createStorageBucket(projectName);

      // Setup authentication
      const authConfig = await this.setupAuthentication();

      // Generate environment variables
      const envVars = this.generateEnvVariables(
        projectName,
        databaseId,
        bucketId,
      );

      const config = {
        endpoint: APPWRITE_ENDPOINT,
        projectId: APPWRITE_PROJECT_ID,
        databaseId,
        bucketId,
        auth: authConfig,
        deployment: {
          name: projectName,
          domain: `${projectName}.singularity-labs.org`,
          timestamp: new Date().toISOString(),
        },
      };

      console.log('\n✅ Deployment provisioned successfully!');
      console.log('📊 Configuration:', JSON.stringify(config, null, 2));

      return {
        success: true,
        config,
        envVars,
      };
    } catch (error) {
      console.error('❌ Provisioning failed:', error);
      return {
        success: false,
        config: {},
        envVars: {},
      };
    }
  }
}
