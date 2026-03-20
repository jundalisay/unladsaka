import type { LayoutServerLoad } from './$types';
import { isValidLocale, defaultLocale } from '$lib/i18n';

export const load: LayoutServerLoad = async ({ cookies }) => {
  const cookie = cookies.get('locale');
  const locale = isValidLocale(cookie) ? cookie : defaultLocale;
  return { locale };
};
