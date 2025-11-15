/**
 * Brain Garden Appwrite Deployment System
 *
 * REAL, WORKING integration with appwrite.singularity-labs.org
 */

export { AppwriteDeploymentClient } from './appwrite-client';
export type { AppwriteDeploymentConfig } from './appwrite-client';

// Re-export Appwrite SDK types for convenience
export { Client, Account, Databases, Storage, Teams, Functions } from 'appwrite';

/**
 * Quick Start:
 *
 * 1. Install:
 *    pnpm add @brain-garden/appwrite-deployment
 *
 * 2. Use CLI:
 *    npx brain-garden-deploy provision my-project
 *
 * 3. Or use programmatically:
 *    import { AppwriteDeploymentClient } from '@brain-garden/appwrite-deployment';
 *
 *    const client = new AppwriteDeploymentClient({
 *      projectName: 'my-project',
 *      apiKey: process.env.APPWRITE_API_KEY
 *    });
 *
 *    await client.provisionDeployment('my-project');
 */