import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { isValidLocale } from '$lib/i18n';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const { locale } = await request.json();
  if (isValidLocale(locale)) {
    cookies.set('locale', locale, { path: '/', maxAge: 60 * 60 * 24 * 365 });
  }
  return json({ ok: true });
};
