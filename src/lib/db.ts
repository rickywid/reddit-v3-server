import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER, 
  password: process.env.DB_PASS,
  host: process.env.DB_HOSTNAME, 
  database: process.env.DB_NAME,
});

const query = {
  query: (text: string, params: Array<any>) => pool.query(text, params),
}

export default query;