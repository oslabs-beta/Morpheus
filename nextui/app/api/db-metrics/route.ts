import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Use environment variables for connection details
const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost', // or '127.0.0.1'
  port: parseInt(process.env.POSTGRES_PORT || '50005'),
  database: process.env.POSTGRES_DB || 'morpheus',
  user: process.env.POSTGRES_USER || 'admin',
  password: process.env.POSTGRES_PASSWORD || 'admin',
});

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM snapshots ORDER BY metric_date DESC LIMIT 1');
      
      if (result.rows.length === 0) {
        return NextResponse.json({ message: 'No data found' }, { status: 404 });
      }

      const latestSnapshot = result.rows[0];
      
      // Convert BigInt values to strings
      const processedSnapshot = Object.fromEntries(
        Object.entries(latestSnapshot).map(([key, value]) => [
          key,
          typeof value === 'bigint' ? value.toString() : value
        ])
      );

      return NextResponse.json({ data: processedSnapshot });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching data from database:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}