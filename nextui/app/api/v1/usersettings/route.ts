import { NextResponse } from 'next/server';
import pool from '@/db/pgModel';

export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT firstname, lastname, email FROM usersettings LIMIT 1');
    client.release();

    if (result.rows.length > 0) {
      return NextResponse.json(result.rows[0]);
    } else {
      return NextResponse.json({ error: 'No user settings found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
