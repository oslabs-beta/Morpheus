import pg from 'pg';

const config: pg.PoolConfig = {
  user: 'admin',
  password: 'admin',
  database: 'morpheus',
  host: 'localhost',
  port: 50005,
};

const pool = new pg.Pool(config);

export default pool;
