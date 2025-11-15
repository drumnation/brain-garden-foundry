/**
 * Initial database schema for Brain Garden template
 * Creates the foundational collections and storage buckets
 */
import { Client } from 'appwrite';
import {
  DatabaseHelper,
  StorageHelper,
  CommonSchemas,
  CommonBuckets,
} from '@brain-garden/appwrite-migrations';

export const up = async (client: Client) => {
  // Initialize helpers
  const db = new DatabaseHelper(client, 'main');
  const storage = new StorageHelper(client);

  console.log('Creating user profiles collection...');
  await db.createCollection(CommonSchemas.userProfiles());

  console.log('Creating sessions collection...');
  await db.createCollection(CommonSchemas.sessions());

  console.log('Creating teams collection...');
  await db.createCollection(CommonSchemas.teams());

  console.log('Creating profile pictures bucket...');
  await storage.createBucket(CommonBuckets.profilePictures());

  console.log('Creating documents bucket...');
  await storage.createBucket(CommonBuckets.documents());

  console.log('Creating uploads bucket...');
  await storage.createBucket(CommonBuckets.uploads());

  console.log('✅ Initial schema created successfully');
};

export const down = async (client: Client) => {
  // Initialize helpers
  const db = new DatabaseHelper(client, 'main');
  const storage = new StorageHelper(client);

  console.log('Removing collections...');
  await db.deleteCollection('teams');
  await db.deleteCollection('sessions');
  await db.deleteCollection('user_profiles');

  console.log('Removing storage buckets...');
  await storage.deleteBucket('uploads');
  await storage.deleteBucket('documents');
  await storage.deleteBucket('profile-pictures');

  console.log('✅ Initial schema rolled back');
};