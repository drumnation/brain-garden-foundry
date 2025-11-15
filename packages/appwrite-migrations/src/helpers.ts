import { Client, Databases, Storage, ID, Permission, Role } from 'appwrite';
import type {
  CollectionSchema,
  AttributeSchema,
  IndexSchema,
  BucketSchema,
} from './types.js';

/**
 * Helper class for creating database collections with schema
 */
export class DatabaseHelper {
  private databases: Databases;
  private databaseId: string;

  constructor(client: Client, databaseId = 'main') {
    this.databases = new Databases(client);
    this.databaseId = databaseId;
  }

  /**
   * Create a collection with full schema
   */
  async createCollection(schema: CollectionSchema): Promise<void> {
    // Create collection
    const collectionId = ID.unique();
    await this.databases.createCollection(
      this.databaseId,
      collectionId,
      schema.name,
      schema.permissions || [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );

    // Create attributes
    for (const attr of schema.attributes) {
      await this.createAttribute(collectionId, attr);
    }

    // Create indexes
    if (schema.indexes) {
      for (const index of schema.indexes) {
        await this.createIndex(collectionId, index);
      }
    }
  }

  /**
   * Create an attribute based on its type
   */
  private async createAttribute(collectionId: string, attr: AttributeSchema): Promise<void> {
    const { key, type, required = false, array = false } = attr;

    switch (type) {
      case 'string':
        await this.databases.createStringAttribute(
          this.databaseId,
          collectionId,
          key,
          attr.size || 255,
          required,
          attr.default,
          array
        );
        break;

      case 'integer':
        await this.databases.createIntegerAttribute(
          this.databaseId,
          collectionId,
          key,
          required,
          attr.min,
          attr.max,
          attr.default,
          array
        );
        break;

      case 'float':
        await this.databases.createFloatAttribute(
          this.databaseId,
          collectionId,
          key,
          required,
          attr.min,
          attr.max,
          attr.default,
          array
        );
        break;

      case 'boolean':
        await this.databases.createBooleanAttribute(
          this.databaseId,
          collectionId,
          key,
          required,
          attr.default,
          array
        );
        break;

      case 'datetime':
        await this.databases.createDatetimeAttribute(
          this.databaseId,
          collectionId,
          key,
          required,
          attr.default,
          array
        );
        break;

      case 'email':
        await this.databases.createEmailAttribute(
          this.databaseId,
          collectionId,
          key,
          required,
          attr.default,
          array
        );
        break;

      case 'ip':
        await this.databases.createIpAttribute(
          this.databaseId,
          collectionId,
          key,
          required,
          attr.default,
          array
        );
        break;

      case 'url':
        await this.databases.createUrlAttribute(
          this.databaseId,
          collectionId,
          key,
          required,
          attr.default,
          array
        );
        break;

      case 'enum':
        if (!attr.values) {
          throw new Error(`Enum attribute ${key} requires values`);
        }
        await this.databases.createEnumAttribute(
          this.databaseId,
          collectionId,
          key,
          attr.values,
          required,
          attr.default,
          array
        );
        break;

      case 'relationship':
        if (!attr.relatedCollection) {
          throw new Error(`Relationship attribute ${key} requires relatedCollection`);
        }
        await this.databases.createRelationshipAttribute(
          this.databaseId,
          collectionId,
          attr.relatedCollection,
          attr.relationType || 'oneToMany',
          attr.twoWay || false,
          key,
          attr.twoWayKey,
          attr.onDelete || 'restrict'
        );
        break;

      default:
        throw new Error(`Unknown attribute type: ${type}`);
    }
  }

  /**
   * Create an index
   */
  private async createIndex(collectionId: string, index: IndexSchema): Promise<void> {
    await this.databases.createIndex(
      this.databaseId,
      collectionId,
      index.key,
      index.type,
      index.attributes,
      index.orders
    );
  }

  /**
   * Delete a collection
   */
  async deleteCollection(name: string): Promise<void> {
    // Find collection by name
    const collections = await this.databases.listCollections(this.databaseId);
    const collection = collections.collections.find(c => c.name === name);

    if (collection) {
      await this.databases.deleteCollection(this.databaseId, collection.$id);
    }
  }
}

/**
 * Helper class for managing storage buckets
 */
export class StorageHelper {
  private storage: Storage;

  constructor(client: Client) {
    this.storage = new Storage(client);
  }

  /**
   * Create a storage bucket with configuration
   */
  async createBucket(schema: BucketSchema): Promise<void> {
    await this.storage.createBucket(
      schema.bucketId,
      schema.name,
      schema.permissions || [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ],
      schema.fileSecurity || true,
      schema.enabled !== false,
      schema.maximumFileSize,
      schema.allowedFileExtensions,
      schema.compression || 'none',
      schema.encryption !== false,
      schema.antivirus !== false
    );
  }

  /**
   * Delete a storage bucket
   */
  async deleteBucket(bucketId: string): Promise<void> {
    await this.storage.deleteBucket(bucketId);
  }

  /**
   * Update bucket configuration
   */
  async updateBucket(schema: Partial<BucketSchema> & { bucketId: string }): Promise<void> {
    await this.storage.updateBucket(
      schema.bucketId,
      schema.name!,
      schema.permissions,
      schema.fileSecurity,
      schema.enabled,
      schema.maximumFileSize,
      schema.allowedFileExtensions,
      schema.compression,
      schema.encryption,
      schema.antivirus
    );
  }
}

/**
 * Pre-defined collection schemas for common use cases
 */
export const CommonSchemas = {
  /**
   * User profiles collection
   */
  userProfiles: (): CollectionSchema => ({
    name: 'user_profiles',
    attributes: [
      { key: 'userId', type: 'string', required: true, size: 36 },
      { key: 'email', type: 'email', required: true },
      { key: 'name', type: 'string', size: 255 },
      { key: 'bio', type: 'string', size: 1000 },
      { key: 'avatarUrl', type: 'url' },
      { key: 'role', type: 'enum', values: ['user', 'moderator', 'admin'], default: 'user' },
      { key: 'isVerified', type: 'boolean', default: false },
      { key: 'createdAt', type: 'datetime', required: true },
      { key: 'updatedAt', type: 'datetime', required: true },
    ],
    indexes: [
      { key: 'userId_unique', type: 'unique', attributes: ['userId'] },
      { key: 'email_unique', type: 'unique', attributes: ['email'] },
      { key: 'role_index', type: 'key', attributes: ['role'] },
    ],
  }),

  /**
   * Sessions collection for auth
   */
  sessions: (): CollectionSchema => ({
    name: 'sessions',
    attributes: [
      { key: 'userId', type: 'string', required: true, size: 36 },
      { key: 'token', type: 'string', required: true, size: 255 },
      { key: 'ipAddress', type: 'ip', required: true },
      { key: 'userAgent', type: 'string', size: 500 },
      { key: 'expiresAt', type: 'datetime', required: true },
      { key: 'createdAt', type: 'datetime', required: true },
    ],
    indexes: [
      { key: 'token_unique', type: 'unique', attributes: ['token'] },
      { key: 'userId_index', type: 'key', attributes: ['userId'] },
      { key: 'expiresAt_index', type: 'key', attributes: ['expiresAt'] },
    ],
  }),

  /**
   * Teams/organizations collection
   */
  teams: (): CollectionSchema => ({
    name: 'teams',
    attributes: [
      { key: 'name', type: 'string', required: true, size: 255 },
      { key: 'slug', type: 'string', required: true, size: 100 },
      { key: 'description', type: 'string', size: 1000 },
      { key: 'logoUrl', type: 'url' },
      { key: 'ownerId', type: 'string', required: true, size: 36 },
      { key: 'memberCount', type: 'integer', default: 1, min: 0 },
      { key: 'plan', type: 'enum', values: ['free', 'pro', 'enterprise'], default: 'free' },
      { key: 'createdAt', type: 'datetime', required: true },
      { key: 'updatedAt', type: 'datetime', required: true },
    ],
    indexes: [
      { key: 'slug_unique', type: 'unique', attributes: ['slug'] },
      { key: 'ownerId_index', type: 'key', attributes: ['ownerId'] },
      { key: 'plan_index', type: 'key', attributes: ['plan'] },
    ],
  }),
};

/**
 * Pre-defined bucket schemas for common use cases
 */
export const CommonBuckets = {
  /**
   * Profile pictures bucket
   */
  profilePictures: (): BucketSchema => ({
    bucketId: 'profile-pictures',
    name: 'Profile Pictures',
    maximumFileSize: 5 * 1024 * 1024, // 5MB
    allowedFileExtensions: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    compression: 'gzip',
    permissions: [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.user(ID.custom('$id'))),
      Permission.delete(Role.user(ID.custom('$id'))),
    ],
  }),

  /**
   * Documents storage bucket
   */
  documents: (): BucketSchema => ({
    bucketId: 'documents',
    name: 'Documents',
    maximumFileSize: 50 * 1024 * 1024, // 50MB
    allowedFileExtensions: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'md'],
    compression: 'zstd',
    permissions: [
      Permission.read(Role.users()),
      Permission.create(Role.users()),
      Permission.update(Role.user(ID.custom('$id'))),
      Permission.delete(Role.user(ID.custom('$id'))),
    ],
  }),

  /**
   * Public uploads bucket
   */
  uploads: (): BucketSchema => ({
    bucketId: 'uploads',
    name: 'Public Uploads',
    maximumFileSize: 100 * 1024 * 1024, // 100MB
    compression: 'gzip',
    permissions: [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.user(ID.custom('$id'))),
      Permission.delete(Role.user(ID.custom('$id'))),
    ],
  }),
};