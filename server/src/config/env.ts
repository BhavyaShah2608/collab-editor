import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 4000),
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI ?? process.env.MONGO_URI ?? ''
};