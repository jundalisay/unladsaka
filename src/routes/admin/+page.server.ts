import type { PageServerLoad, Actions } from './$types';
import { createDb } from '$lib/db';
import { registrations } from '$lib/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ cookies, platform }) => {
  const authed = cookies.get('admin_auth') === 'true';

  if (!authed) {
    return { authed: false, rows: [], total: 0, thisMonth: 0 };
  }

  try {
    const url   = (platform?.env?.TURSO_DATABASE_URL as string | undefined) ?? '';
    const token = (platform?.env?.TURSO_AUTH_TOKEN as string | undefined) ?? '';

    if (!url) {
      // No DB configured — return empty but authenticated (dev mode)
      return { authed: true, rows: [], total: 0, thisMonth: 0 };
    }

    const db = createDb(url, token);
    const rows = await db
      .select()
      .from(registrations)
      .orderBy(desc(registrations.createdAt));

    const now = new Date();
    const thisMonth = rows.filter(r => {
      if (!r.createdAt) return false;
      const d = new Date(r.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    return { authed: true, rows, total: rows.length, thisMonth };
  } catch (err) {
    console.error('Admin DB error:', err);
    return { authed: true, rows: [], total: 0, thisMonth: 0 };
  }
};

export const actions: Actions = {
  login: async ({ request, cookies, platform }) => {
    const form     = await request.formData();
    const password = form.get('password')?.toString() ?? '';
    const adminPw  = (platform?.env?.ADMIN_PASSWORD as string | undefined) ?? 'admin123';

    if (password !== adminPw) {
      return fail(401, { error: true });
    }

    cookies.set('admin_auth', 'true', {
      path: '/',
      maxAge: 60 * 60 * 8,   // 8 hours
      httpOnly: true,
      sameSite: 'lax',
    });

    throw redirect(303, '/admin');
  },

  logout: async ({ cookies }) => {
    cookies.delete('admin_auth', { path: '/' });
    throw redirect(303, '/admin');
  }
};
