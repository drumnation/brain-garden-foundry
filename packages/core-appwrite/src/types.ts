import type { Models } from 'appwrite';

/**
 * Type-safe collection document with Appwrite metadata
 */
export type Document<T = Record<string, any>> = T & Models.Document;

/**
 * Type-safe list response
 */
export interface ListResponse<T> {
  total: number;
  documents: T[];
}

/**
 * Query builder types for type-safe queries
 */
export type QueryOperator =
  | 'equal'
  | 'notEqual'
  | 'lessThan'
  | 'lessThanEqual'
  | 'greaterThan'
  | 'greaterThanEqual'
  | 'contains'
  | 'between'
  | 'isNull'
  | 'isNotNull'
  | 'startsWith'
  | 'endsWith'
  | 'select'
  | 'orderAsc'
  | 'orderDesc'
  | 'limit'
  | 'offset'
  | 'cursorAfter'
  | 'cursorBefore';

/**
 * Type-safe query builder
 */
export interface QueryBuilder {
  equal: (attribute: string, value: any) => string;
  notEqual: (attribute: string, value: any) => string;
  lessThan: (attribute: string, value: any) => string;
  lessThanEqual: (attribute: string, value: any) => string;
  greaterThan: (attribute: string, value: any) => string;
  greaterThanEqual: (attribute: string, value: any) => string;
  contains: (attribute: string, value: string | string[]) => string;
  between: (attribute: string, start: any, end: any) => string;
  isNull: (attribute: string) => string;
  isNotNull: (attribute: string) => string;
  startsWith: (attribute: string, value: string) => string;
  endsWith: (attribute: string, value: string) => string;
  select: (attributes: string[]) => string;
  orderAsc: (attribute: string) => string;
  orderDesc: (attribute: string) => string;
  limit: (value: number) => string;
  offset: (value: number) => string;
  cursorAfter: (documentId: string) => string;
  cursorBefore: (documentId: string) => string;
}

/**
 * User session type
 */
export interface Session extends Models.Session {
  userId: string;
  expire: string;
}

/**
 * User account type
 */
export interface User extends Models.User<Models.Preferences> {
  $id: string;
  email: string;
  name: string;
  registration: string;
  status: boolean;
  emailVerification: boolean;
  phoneVerification: boolean;
  prefs: Models.Preferences;
}

/**
 * JWT payload type
 */
export interface JWT extends Models.Jwt {
  jwt: string;
}

/**
 * File upload type
 */
export interface File extends Models.File {
  $id: string;
  bucketId: string;
  name: string;
  sizeOriginal: number;
  mimeType: string;
}

/**
 * Team type
 */
export interface Team extends Models.Team<Models.Preferences> {
  $id: string;
  name: string;
  total: number;
  prefs: Models.Preferences;
}

/**
 * Membership type
 */
export interface Membership extends Models.Membership {
  $id: string;
  userId: string;
  userName: string;
  userEmail: string;
  teamId: string;
  teamName: string;
  roles: string[];
  confirm: boolean;
  joined: string;
}

/**
 * Execution type for functions
 */
export interface Execution extends Models.Execution {
  $id: string;
  functionId: string;
  trigger: string;
  status: string;
  requestMethod: string;
  requestPath: string;
  requestHeaders: Models.Headers[];
  responseStatusCode: number;
  responseBody: string;
  responseHeaders: Models.Headers[];
  logs: string;
  errors: string;
  duration: number;
}

/**
 * Realtime message type
 */
export interface RealtimeMessage<T = any> {
  events: string[];
  channels: string[];
  payload: T;
  timestamp: string;
}

/**
 * Collection permission helpers
 */
export const Permissions = {
  read: (role: string) => `read("${role}")`,
  write: (role: string) => `write("${role}")`,
  create: (role: string) => `create("${role}")`,
  update: (role: string) => `update("${role}")`,
  delete: (role: string) => `delete("${role}")`,
} as const;

/**
 * Role helpers for permissions
 */
export const Roles = {
  any: () => 'any',
  users: () => 'users',
  user: (id: string) => `user:${id}`,
  team: (id: string, role?: string) => role ? `team:${id}/${role}` : `team:${id}`,
  member: (id: string) => `member:${id}`,
  label: (label: string) => `label:${label}`,
} as const;