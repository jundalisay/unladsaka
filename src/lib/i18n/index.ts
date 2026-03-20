export type Locale = 'en' | 'tl' | 'cb';

export const locales: Locale[] = ['en', 'tl', 'cb'];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  tl: 'Filipino',
  cb: 'Cebuano'
};

export function isValidLocale(l: unknown): l is Locale {
  return typeof l === 'string' && (locales as string[]).includes(l);
}

export function getLocaleFromCookie(cookies: string): Locale {
  const match = cookies.match(/locale=([a-z]{2})/);
  const l = match?.[1];
  return isValidLocale(l) ? l : defaultLocale;
}
