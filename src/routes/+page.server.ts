import type { PageServerLoad, Actions } from './$types';
import { createDb } from '$lib/db';
import { registrations } from '$lib/db/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ parent }) => {
  return await parent();
};

export const actions: Actions = {
  register: async ({ request, platform, cookies }) => {
    const form = await request.formData();
    const fullName = form.get('fullName')?.toString().trim() ?? '';
    const email    = form.get('email')?.toString().trim() ?? '';
    const phone    = form.get('phone')?.toString().trim() ?? '';
    const region   = form.get('region')?.toString().trim() ?? '';
    const farmSize = form.get('farmSize')?.toString().trim() ?? '';
    const crops    = form.get('crops')?.toString().trim() ?? '';
    const message  = form.get('message')?.toString().trim() ?? '';
    const locale   = cookies.get('locale') ?? 'en';

    if (!fullName || !email) {
      return fail(400, { error: 'Name and email are required.' });
    }

    try {
      const url   = platform?.env?.TURSO_DATABASE_URL ?? '';
      const token = platform?.env?.TURSO_AUTH_TOKEN ?? '';

      if (url) {
        const db = createDb(url, token);
        await db.insert(registrations).values({ fullName, email, phone, region, farmSize, crops, message, locale });
      }
      return { success: true };
    } catch (err) {
      console.error('Registration error:', err);
      return fail(500, { error: 'Database error. Please try again.' });
    }
  }
};
