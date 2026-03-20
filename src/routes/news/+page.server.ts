import type { PageServerLoad } from './$types';
import { parseNewsArticle } from '$lib/utils/markdown';
import type { NewsArticle } from '$lib/utils/markdown';

// Vite resolves these at build time — safe for Cloudflare Workers (no Node fs required)
const rawFiles = import.meta.glob('/src/content/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
}) as Record<string, string>;

export const load: PageServerLoad = async ({ parent }) => {
  const data = await parent();
  const locale = (data.locale ?? 'en') as 'en' | 'tl' | 'cb';

  const prefix = `/src/content/${locale}/news/`;
  const articles: NewsArticle[] = [];

  for (const [path, raw] of Object.entries(rawFiles)) {
    if (!path.startsWith(prefix) || !raw) continue;
    const slug = path.slice(prefix.length).replace(/\.md$/, '');
    articles.push(parseNewsArticle(raw, slug));
  }

  articles.sort((a, b) => b.date.localeCompare(a.date));

  return { locale, articles };
};
