import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createDb } from '$lib/db';
import { registrations } from '$lib/db/schema';

export const POST: RequestHandler = async ({ request, platform }) => {
  const dbUrl   = platform?.env?.TURSO_DATABASE_URL ?? '';
  const dbToken = platform?.env?.TURSO_AUTH_TOKEN ?? '';

  if (!dbUrl) {
    throw error(500, 'Database not configured');
  }

  const body = await request.json();
  const { fullName, email, phone, region, farmSize, crops, message, locale } = body;

  if (!fullName || !email) {
    throw error(400, 'Name and email are required');
  }

  const db = createDb(dbUrl, dbToken);

  await db.insert(registrations).values({
    fullName,
    email,
    phone:    phone    || null,
    region:   region   || null,
    farmSize: farmSize || null,
    crops:    crops    || null,
    message:  message  || null,
    locale:   locale   || 'en'
  });

  return json({ ok: true });
};
