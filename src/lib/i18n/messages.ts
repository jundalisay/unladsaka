import { en } from './en';
import { tl } from './tl';
import { cb } from './cb';
import type { Locale } from './index';

export const messages = { en, tl, cb };

export function t(locale: Locale, key: keyof typeof en): string {
  return messages[locale]?.[key] ?? messages.en[key] ?? key;
}
