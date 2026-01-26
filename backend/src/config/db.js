import mysql from 'mysql2/promise';
import { env } from './env.js';

// Create a connection pool
// Pools allow handling multiple concurrent requests efficiently
const pool = mysql.createPool({
  host: env.db.host,
  user: env.db.user,
  password: env.db.password,
  database: env.db.name,
  port: env.db.port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the connection on startup
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`✅ Database connected successfully to ${env.db.name}`);
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    // process.exit(1); // Optional: Exit if DB is critical for startup
  }
};

testConnection();

export { pool as db };
