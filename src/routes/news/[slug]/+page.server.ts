import type { PageServerLoad } from './$types';
import { parseNewsArticle } from '$lib/utils/markdown';
import { error } from '@sveltejs/kit';

const rawFiles = import.meta.glob('/src/content/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
}) as Record<string, string>;

export const load: PageServerLoad = async ({ parent, params }) => {
  const data = await parent();
  const locale = (data.locale ?? 'en') as 'en' | 'tl' | 'cb';
  const { slug } = params;

  const path = `/src/content/${locale}/news/${slug}.md`;
  const fallbackPath = `/src/content/en/news/${slug}.md`;

  const raw = rawFiles[path] ?? rawFiles[fallbackPath];
  if (!raw) throw error(404, `Article "${slug}" not found.`);

  return { locale, article: parseNewsArticle(raw, slug) };
};
