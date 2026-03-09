'use server';

import { cookies } from 'next/headers';


 
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies();

  const raw =
    cookieStore.get('access-token')?.value ||
    cookieStore.get('access_token')?.value ||
    '';

  const token = raw.replace(/\s+/g, '').replace(/^(Bearer|Token)\s*/i, '');

  if (!token || token === 'undefined' || token === 'null') {
    return { 'Content-Type': 'application/json' };
  }

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}