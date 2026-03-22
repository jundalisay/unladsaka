<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { ArrowLeft, Calendar, Clock, User } from 'lucide-svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  let locale = $derived((data.locale ?? 'en') as 'en' | 'tl' | 'cb');
  let article = $derived(data.article);

  const T: Record<string, Record<string, string>> = {
    back:    { en: 'Back to News', tl: 'Bumalik sa Balita', cb: 'Balik sa Balita' },
    minread: { en: 'min read', tl: 'min basa', cb: 'min basaha' },
    by:      { en: 'By', tl: 'Ni', cb: 'Ni' },
  };
  const t = (k: string) => T[k]?.[locale] ?? T[k]?.en ?? k;

  function formatDate(d: string) {
    if (!d) return '';
    try {
      return new Date(d).toLocaleDateString(
        locale === 'en' ? 'en-PH' : locale === 'tl' ? 'fil-PH' : 'en-PH',
        { year: 'numeric', month: 'long', day: 'numeric' }
      );
    } catch { return d; }
  }

  // Convert basic markdown to HTML for display
function mdToHtml(md: string): string {
  if (!md) return '';

  let html = md
    // 1. IMAGES (Must be first)
    .replace(/!\[(.*?)\]\((.*?)\)/g, 
      '<img src="$2" alt="$1" class="rounded-xl my-8 w-full object-cover shadow-lg block">')
    
    // 2. TABLES (Matches standard Markdown table structure)
    .replace(/^\|(.+)\|$\n^\|([-| ]+)\|$\n((?:^\|(.+)\|$\n?)+)/gm, (match, header, separator, body) => {
      const headers = header.split('|').filter(h => h.trim()).map(h => `<th class="border px-4 py-2 bg-slate-50">${h.trim()}</th>`).join('');
      const rows = body.trim().split('\n').map(row => {
        const cols = row.split('|').filter(c => c.trim()).map(c => `<td class="border px-4 py-2">${c.trim()}</td>`).join('');
        return `<tr>${cols}</tr>`;
      }).join('');
      return `<div class="overflow-x-auto my-6"><table class="w-full border-collapse border border-slate-200 text-sm"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></div>`;
    })
    
    // 3. HEADINGS
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')

    // 4. LINKS (Non-image links)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-brand-green underline hover:text-amber-600 transition-colors font-medium">$1</a>')

    // 5. BOLD & ITALIC
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')

    // 6. LISTS
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/^[-*] (.+)$/gm, '<li>$1</li>');

  // 7. BLOCK WRAPPING (Paragraphs and List Groups)
  return html
    .split('\n\n')
    .map(block => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      // Don't wrap if it's already an HTML block (Table, Heading, List, Image)
      if (trimmed.startsWith('<h') || trimmed.startsWith('<div') || trimmed.startsWith('<ul') || trimmed.startsWith('<li') || trimmed.startsWith('<img')) {
        // If it's a list item not wrapped in UL, wrap it now
        if (trimmed.startsWith('<li')) return `<ul class="list-disc pl-6 my-4">${trimmed}</ul>`;
        return trimmed;
      }
      return `<p class="mb-4 leading-relaxed">${trimmed}</p>`;
    })
    .join('\n');
}





  let visible = $state(false);
  onMount(() => setTimeout(() => (visible = true), 60));
</script>

<svelte:head>
  <title>{article?.title ?? 'News'} – Unlad Saka</title>
  <meta name="description" content={article?.description ?? ''} />
</svelte:head>

<div class="pt-20">
  <!-- Header hero -->
  <section style="background:linear-gradient(160deg,var(--color-forest),var(--color-grove))" class="py-16">
    <div class="container">
      {#if visible}
        <a in:fly={{ x: -20, duration: 400 }}
           href="/news"
           class="inline-flex items-center gap-2 text-sm mb-8 transition-all hover:-translate-x-1"
           style="color:var(--color-mint);opacity:0.8">
          <ArrowLeft size={16} /> {t('back')}
        </a>

        {#if article}
          <!-- Tags -->
          <div in:fly={{ y: 20, duration: 500, delay: 100 }} class="flex flex-wrap gap-2 mb-4">
            {#each article.tags as tag}
              <span class="px-3 py-1 rounded-full text-xs font-medium capitalize"
                    style="background:rgba(255,255,255,0.12);color:var(--color-wheat)">{tag}</span>
            {/each}
          </div>

          <h1 in:fly={{ y: 25, duration: 600, delay: 150 }}
              class="font-serif font-bold mb-6 leading-tight"
              style="color:var(--color-cream);font-size:clamp(1.75rem,4.5vw,3rem)">
            {article.title}
          </h1>

          <div in:fly={{ y: 15, duration: 500, delay: 300 }}
               class="flex flex-wrap items-center gap-5 text-sm"
               style="color:rgba(255,255,255,0.6)">
            <span class="flex items-center gap-1.5">
              <User size={14} /> {t('by')} {article.author}
            </span>
            <span class="flex items-center gap-1.5">
              <Calendar size={14} /> {formatDate(article.date)}
            </span>
            <span class="flex items-center gap-1.5">
              <Clock size={14} /> {article.readTime} {t('minread')}
            </span>
          </div>
        {/if}
      {/if}
    </div>
  </section>

  <!-- Article body -->
  {#if article}
    <section class="section-sm">
      <div class="container">
        <div class="max-w-3xl mx-auto">
          <!-- Description lead -->
          <p in:fade={{ duration: 400, delay: 200 }}
             class="text-lg leading-relaxed mb-8 font-medium"
             style="color:var(--color-grove)">
            {article.description}
          </p>

          <div class="h-px mb-8" style="background:linear-gradient(90deg,var(--color-amber),transparent)"></div>

          <!-- Rendered markdown -->
          <div in:fade={{ duration: 500, delay: 300 }}
               class="prose prose-lg max-w-none"
               style="color:var(--color-forest)">
            {@html mdToHtml(article.content)}
          </div>

          <!-- Bottom nav -->
          <div class="mt-14 pt-6 border-t" style="border-color:var(--color-sage)">
            <a href="/news"
               class="inline-flex items-center gap-2 font-medium transition-all hover:-translate-x-1"
               style="color:var(--color-grove)">
              <ArrowLeft size={18} /> {t('back')}
            </a>
          </div>
        </div>
      </div>
    </section>
  {/if}
</div>

<style>
  :global(.prose h1) { font-family: var(--font-serif); font-size: 2rem; font-weight: 700; color: var(--color-forest); margin: 2rem 0 1rem; }
  :global(.prose h2) { font-family: var(--font-serif); font-size: 1.6rem; font-weight: 700; color: var(--color-forest); margin: 1.8rem 0 0.8rem; border-left: 3px solid var(--color-amber); padding-left: 1rem; }
  :global(.prose h3) { font-family: var(--font-serif); font-size: 1.25rem; font-weight: 600; color: var(--color-grove); margin: 1.5rem 0 0.6rem; }
  :global(.prose p) { margin: 0 0 1.2rem; line-height: 1.8; opacity: 0.85; }
  :global(.prose ul) { padding-left: 1.5rem; margin: 1rem 0 1.5rem; }
  :global(.prose li) { margin: 0.4rem 0; line-height: 1.7; opacity: 0.82; list-style: disc; }
  :global(.prose strong) { color: var(--color-forest); font-weight: 600; }
  :global(.prose em) { font-style: italic; color: var(--color-grove); }
</style>
