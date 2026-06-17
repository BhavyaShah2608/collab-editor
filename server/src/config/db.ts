import mongoose from 'mongoose';
import { env } from './env';

export async function connectDatabase(): Promise<void> {
  if (!env.mongoUri) {
    console.warn('MONGODB_URI is not set. Running in local in-memory fallback mode.');
    return;
  }

  try {
    await mongoose.connect(env.mongoUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.warn('Failed to connect to MongoDB. Running in local in-memory fallback mode.');
    console.warn(error);
  }
}

export function hasMongoConnection(): boolean {
  return mongoose.connection.readyState === 1;
}