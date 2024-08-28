'use server';

import { revalidatePath } from 'next/cache';
import pool from '@/db/pgModel';

export async function updateUserSettings(prevState: any, formData: FormData) {
  const firstname = formData.get('firstname') as string;
  const lastname = formData.get('lastname') as string;
  const email = formData.get('email') as string;

  try {
    const client = await pool.connect();
    const result = await client.query('UPDATE usersettings SET firstname = $1, lastname = $2 WHERE email = $3', [
      firstname,
      lastname,
      email,
    ]);
    client.release();

    revalidatePath('/dashboard/settings');

    if (result.rowCount > 0) {
      return { message: 'Settings updated successfully' };
    } else {
      return { message: 'Failed to update settings' };
    }
  } catch (error) {
    console.error('Error updating user settings:', error);
    return { message: 'Failed to update settings' };
  }
}
