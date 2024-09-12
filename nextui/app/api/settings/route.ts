import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'morpheus',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'your_postgres_password',
});

export async function GET(request: Request) {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT fetch_interval, run_immediately FROM settings WHERE id = 1');
      if (result.rows.length === 0) {
        return NextResponse.json({ message: 'No settings found' }, { status: 404 });
      }
      const settings = result.rows[0];
      return NextResponse.json({ data: settings });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching settings from database:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { fetch_interval, run_immediately } = body;

    // Validate inputs
    if (typeof fetch_interval !== 'number' || fetch_interval < 10 || fetch_interval > 3600) {
      fetch_interval = 60; // default to 60 seconds
    }
    if (typeof run_immediately !== 'boolean') {
      run_immediately = false;
    }

    const client = await pool.connect();
    try {
      await client.query('UPDATE settings SET fetch_interval = $1, run_immediately = $2 WHERE id = 1', [
        fetch_interval,
        run_immediately,
      ]);
      return NextResponse.json({ message: 'Settings updated' });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating settings in database:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
