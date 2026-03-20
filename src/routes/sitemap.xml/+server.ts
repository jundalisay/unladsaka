import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  const base = 'https://unladsakaph.pages.dev';
  const now  = new Date().toISOString().split('T')[0];

  const routes = [
    { path: '/',         priority: '1.0', freq: 'weekly' },
    { path: '/harvest',  priority: '0.9', freq: 'weekly' },
    { path: '/news',     priority: '0.9', freq: 'daily'  },
    { path: '/training', priority: '0.8', freq: 'weekly' },
  ];

  const urlset = routes.map(r => `
  <url>
    <loc>${base}${r.path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${r.freq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlset}\n</urlset>`,
    { headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'max-age=3600' } }
  );
};
