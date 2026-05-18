// Environment configuration with type-safe access
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface Config {
  port: number;
  mongoUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  jwtRefreshSecret: string;
  jwtRefreshExpiresIn: string;
  nodeEnv: string;
  clientUrl: string;
  bcryptRounds: number;
}

const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const config: Config = {
  port: parseInt(getEnv('PORT', '5000'), 10),
  mongoUri: getEnv('MONGO_URI', 'mongodb://localhost:27017/smart-leads'),
  jwtSecret: getEnv('JWT_SECRET', 'supersecretjwtkey_change_in_production'),
  jwtExpiresIn: getEnv('JWT_EXPIRES_IN', '7d'),
  jwtRefreshSecret: getEnv('JWT_REFRESH_SECRET', 'supersecretrefreshkey_change_in_production'),
  jwtRefreshExpiresIn: getEnv('JWT_REFRESH_EXPIRES_IN', '30d'),
  nodeEnv: getEnv('NODE_ENV', 'development'),
  clientUrl: getEnv('CLIENT_URL', 'http://localhost:5173'),
  bcryptRounds: parseInt(getEnv('BCRYPT_ROUNDS', '12'), 10),
};
