import { NextResponse } from 'next/server';
import pool from '@/db/pgModel';

// Environment variables for connection details
// const pool = new Pool({
//   host: process.env.POSTGRES_HOST || 'localhost',
//   port: parseInt(process.env.POSTGRES_PORT || '5432'),
//   database: process.env.POSTGRES_DB || 'morpheus',
//   user: process.env.POSTGRES_USER || 'postgres',
//   password: process.env.POSTGRES_PASSWORD || 'your_postgres_password',
// });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  if (isNaN(limit) || isNaN(offset)) {
    return NextResponse.json({ error: 'Invalid limit or offset' }, { status: 400 });
  }

  try {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM snapshots ORDER BY metric_date DESC LIMIT $1 OFFSET $2',
        [limit, offset]
      );

      if (result.rows.length === 0) {
        return NextResponse.json({ message: 'No data found' }, { status: 404 });
      }

      const snapshots = result.rows.map(row => ({
        ...row,
        metric_date: row.metric_date.toISOString(),
      }));

      return NextResponse.json({ data: snapshots });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching data from database:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
