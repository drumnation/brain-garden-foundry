import type {Client} from 'appwrite';

export interface Migration {
  id: string;
  name: string;
  up: (client: Client) => Promise<void>;
  down: (client: Client) => Promise<void>;
}

export interface MigrationHistory {
  id: string;
  name: string;
  appliedAt: string;
  checksum?: string;
}

export interface MigrationConfig {
  migrationsDir: string;
  client: Client;
  databaseId?: string;
  projectId?: string;
}

export interface MigrationResult {
  success: boolean;
  migrationsRun: string[];
  error?: Error;
}

export interface CollectionSchema {
  name: string;
  attributes: AttributeSchema[];
  indexes?: IndexSchema[];
  permissions?: string[];
}

export interface AttributeSchema {
  key: string;
  type:
    | 'string'
    | 'integer'
    | 'float'
    | 'boolean'
    | 'datetime'
    | 'email'
    | 'ip'
    | 'url'
    | 'enum'
    | 'relationship';
  required?: boolean;
  array?: boolean;
  size?: number;
  default?: any;
  min?: number;
  max?: number;
  values?: string[]; // For enum type
  relatedCollection?: string; // For relationship type
  relationType?: 'oneToOne' | 'oneToMany' | 'manyToOne' | 'manyToMany';
  twoWay?: boolean;
  twoWayKey?: string;
  onDelete?: 'restrict' | 'cascade' | 'setNull';
}

export interface IndexSchema {
  key: string;
  type: 'key' | 'unique' | 'fulltext';
  attributes: string[];
  orders?: ('ASC' | 'DESC')[];
}

export interface BucketSchema {
  bucketId: string;
  name: string;
  permissions?: string[];
  fileSecurity?: boolean;
  enabled?: boolean;
  maximumFileSize?: number;
  allowedFileExtensions?: string[];
  compression?: 'none' | 'gzip' | 'zstd';
  encryption?: boolean;
  antivirus?: boolean;
}
