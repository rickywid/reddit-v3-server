import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER, 
  password: process.env.DB_PASS,
  host: process.env.DB_HOSTNAME, 
  database: 'reddit-v3'
});


const query = {
  query: (text: string, params: Array<any>) => pool.query(text, params),
}

export default query;