// Import the Pool class from the 'pg' (node-postgres) library
// This allows us to create a connection pool to PostgreSQL
import { Pool } from 'pg';

/**
 * Create a new PostgreSQL connection pool
 * Connection pools help manage and reuse database connections efficiently
 * instead of creating a new connection for each request
 */
const pool = new Pool({
  // Database connection configuration:
  user: 'packages',         // Database username
  host: 'localhost',        // Database server host (localhost in this case)
  database: 'packages',     // Name of the database to connect to
  password: 'Jwe1989!',     // Password for the database user
  port: 5432,               // PostgreSQL default port (5432)
  
  /**
   * Additional optional pool configuration could be added here:
   * max: 20,               // Maximum number of clients in the pool
   * idleTimeoutMillis: 30000, // How long a client can remain idle before being closed
   * connectionTimeoutMillis: 2000 // Time to wait for connection before timing out
   */
});

// Export the configured pool instance to be used throughout the application
// This single pool instance should be reused across all database operations
export default pool;