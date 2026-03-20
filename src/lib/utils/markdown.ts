export interface NewsArticle {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  image?: string;
  content: string;
  readTime: number;
}

/** Parse YAML-ish frontmatter from markdown string */
function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const data: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    data[key] = value;
  }
  return { data, content: match[2] };
}

function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function parseNewsArticle(raw: string, slug: string): NewsArticle {
  const { data, content } = parseFrontmatter(raw);
  return {
    slug,
    title: data.title ?? 'Untitled',
    description: data.description ?? '',
    date: data.date ?? '',
    author: data.author ?? 'Unlad Saka',
    tags: data.tags ? data.tags.split(',').map((t) => t.trim()) : [],
    image: data.image,
    content,
    readTime: estimateReadTime(content)
  };
}

export function slugFromPath(path: string): string {
  return path.split('/').pop()?.replace(/\.md$/, '') ?? '';
}
