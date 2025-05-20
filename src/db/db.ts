import { Pool } from 'pg';

const pool = new Pool({
  user: 'packages',
  host: 'localhost',
  database: 'packages',
  password: 'Jwe1989!',
  port: 5432,
});

export default pool;