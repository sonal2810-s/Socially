import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'socially_db',
    port: process.env.DB_PORT || 3306,
  },
  jwtSecret: process.env.JWT_SECRET,
};
