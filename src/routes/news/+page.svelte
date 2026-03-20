<script lang="ts">
  import { fly, fade, scale } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { onMount } from 'svelte';
  import { Search, Calendar, Clock, User, ArrowRight, Newspaper, X, Tag } from 'lucide-svelte';
  import type { PageData } from './$types';
  import type { NewsArticle } from '$lib/utils/markdown';

  let { data }: { data: PageData } = $props();
  let locale = $derived((data.locale ?? 'en') as 'en' | 'tl' | 'cb');
  let articles = $derived((data.articles ?? []) as NewsArticle[]);

  const T: Record<string, Record<string, string>> = {
    title:    { en: 'Latest News',    tl: 'Pinakabagong Balita',     cb: 'Pinakabag-o nga Balita' },
    subtitle: { en: 'Stay updated on agricultural policies, programs, and opportunities for Filipino farmers.',
                tl: 'Manatiling updated sa mga patakaran sa agrikultura, programa, at mga oportunidad.',
                cb: 'Manatiling updated sa mga patakaran sa agrikultura, programa, ug mga oportunidad.' },
    search:   { en: 'Search articles…',   tl: 'Maghanap ng balita…',    cb: 'Pangita ug balita…' },
    all:      { en: 'All Topics',          tl: 'Lahat',                  cb: 'Tanan' },
    none:     { en: 'No articles match your search.',
                tl: 'Walang nahanap na artikulo para sa inyong paghahanap.',
                cb: 'Walay nakitang mga artikulo alang sa imong pagpangita.' },
    read:     { en: 'Read Article',        tl: 'Basahin ang Artikulo',   cb: 'Basaha ang Artikulo' },
    minread:  { en: 'min read',            tl: 'min basa',               cb: 'min basaha' },
    by:       { en: 'By',                  tl: 'Ni',                     cb: 'Ni' },
    featured: { en: 'Featured',            tl: 'Tampok',                 cb: 'Gipunting' },
    clear:    { en: 'Clear',               tl: 'I-clear',                cb: 'I-clear' },
  };
  const t = (k: string) => T[k]?.[locale] ?? T[k]?.en ?? k;

  let searchQuery = $state('');
  let selectedTag = $state('');
  let visible = $state(false);

  onMount(() => setTimeout(() => (visible = true), 80));

  let allTags = $derived([...new Set(articles.flatMap(a => a.tags))].filter(Boolean));

  let filtered = $derived(articles.filter(a => {
    const q = searchQuery.toLowerCase().trim();
    const matchQ = !q ||
      a.title.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.tags.some(tg => tg.toLowerCase().includes(q));
    const matchT = !selectedTag || a.tags.includes(selectedTag);
    return matchQ && matchT;
  }));

  function formatDate(d: string) {
    if (!d) return '';
    try {
      return new Date(d).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch { return d; }
  }

  let featuredArticle = $derived(filtered[0] ?? null);
  let restArticles = $derived(filtered.slice(1));

  function clearFilters() {
    searchQuery = '';
    selectedTag = '';
  }
</script>

<svelte:head>
  <title>News – Unlad Saka</title>
  <meta name="description" content="Latest agricultural news, policy updates, and opportunities for Filipino farmers." />
</svelte:head>

<div class="pt-20">
  <!-- ── Header ──────────────────────────────────────────────────── -->
  <section class="py-20" style="background:linear-gradient(160deg,var(--color-forest),var(--color-grove))">
    <div class="container text-center">
      {#if visible}
        <h1 in:fly={{ y: 30, duration: 600 }} class="font-serif text-5xl font-bold mb-4"
            style="color:var(--color-cream)">{t('title')}</h1>
        <span class="gold-line mx-auto"></span>
        <p in:fly={{ y: 20, duration: 600, delay: 200 }} class="text-lg max-w-xl mx-auto"
           style="color:rgba(255,255,255,0.78)">{t('subtitle')}</p>
      {/if}
    </div>
  </section>

  <section class="section">
    <div class="container">

      <!-- ── Search + Filter bar ──────────────────────────────────── -->
      <div class="max-w-2xl mx-auto mb-12">
        <div class="relative mb-4">
          <Search size={17} class="absolute left-4 top-1/2 -translate-y-1/2"
                  style="color:var(--color-fern);opacity:0.6;pointer-events:none" />
          <input type="text" bind:value={searchQuery}
                 placeholder={t('search')}
                 class="input pl-11"
                 style="font-size:0.95rem;padding:0.85rem 1rem 0.85rem 2.75rem" />
          {#if searchQuery}
            <button onclick={() => searchQuery = ''}
                    class="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full opacity-50 hover:opacity-100 transition-opacity"
                    aria-label="Clear search">
              <X size={15} />
            </button>
          {/if}
        </div>
        <!-- Tag pills -->
        <div class="flex flex-wrap gap-2 items-center">
          <button onclick={() => selectedTag = ''}
                  class="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style="background:{!selectedTag ? 'var(--color-grove)' : 'var(--color-sage)'};
                         color:{!selectedTag ? 'white' : 'var(--color-grove)'}">
            {t('all')}
          </button>
          {#each allTags as tag}
            <button onclick={() => selectedTag = selectedTag === tag ? '' : tag}
                    class="px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all"
                    style="background:{selectedTag === tag ? 'var(--color-grove)' : 'var(--color-sage)'};
                           color:{selectedTag === tag ? 'white' : 'var(--color-grove)'}">
              {tag}
            </button>
          {/each}
          {#if searchQuery || selectedTag}
            <button onclick={clearFilters}
                    class="ml-auto text-xs flex items-center gap-1 opacity-50 hover:opacity-80 transition-opacity">
              <X size={12} /> {t('clear')}
            </button>
          {/if}
        </div>
      </div>

      <!-- ── Results ───────────────────────────────────────────────── -->
      {#if filtered.length === 0}
        <div in:fade class="text-center py-24">
          <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
               style="background:var(--color-sage)">
            <Newspaper size={32} color="var(--color-fern)" strokeWidth={1.5} />
          </div>
          <p class="font-serif text-xl mb-2" style="color:var(--color-forest)">{t('none')}</p>
          <button onclick={clearFilters}
                  class="btn btn-outline mt-4" style="font-size:0.875rem">
            {t('clear')} filters
          </button>
        </div>

      {:else}
        <!-- Featured (first) article -->
        {#if featuredArticle}
          {#key featuredArticle.slug}
            <article in:fly={{ y: 20, duration: 500 }}
                     class="card mb-10 overflow-hidden md:flex">
              <!-- Accent panel -->
              <div class="md:w-72 flex-shrink-0 flex flex-col justify-between p-8 relative overflow-hidden"
                   style="background:linear-gradient(160deg,var(--color-forest),var(--color-grove))">
                <div>
                  <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
                        style="background:rgba(212,160,23,0.25);color:var(--color-amber)">
                    ✦ {t('featured')}
                  </span>
                  <div class="flex flex-wrap gap-1.5 mb-3">
                    {#each featuredArticle.tags as tag}
                      <span class="px-2 py-0.5 rounded text-xs capitalize"
                            style="background:rgba(255,255,255,0.12);color:var(--color-mint)">{tag}</span>
                    {/each}
                  </div>
                </div>
                <!-- Decorative wheat -->
                <svg class="absolute bottom-0 right-0 opacity-10 w-28 h-28" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="40" y1="75" x2="40" y2="10" stroke="#d4a017" stroke-width="2"/>
                  <ellipse cx="28" cy="38" rx="8" ry="16" fill="#d4a017" transform="rotate(-30,28,38)"/>
                  <ellipse cx="52" cy="38" rx="8" ry="16" fill="#d4a017" transform="rotate(30,52,38)"/>
                  <ellipse cx="40" cy="12" rx="7" ry="14" fill="#d4a017"/>
                </svg>
                <div class="text-xs mt-4 flex items-center gap-1.5" style="color:rgba(255,255,255,0.5)">
                  <Calendar size={11} /> {formatDate(featuredArticle.date)}
                </div>
              </div>

              <!-- Content -->
              <div class="p-8 flex flex-col flex-1">
                <h2 class="font-serif text-2xl md:text-3xl font-bold leading-snug mb-3"
                    style="color:var(--color-forest)">
                  {featuredArticle.title}
                </h2>
                <p class="leading-relaxed opacity-70 mb-6 flex-1" style="font-size:1rem">
                  {featuredArticle.description}
                </p>
                <div class="flex flex-wrap items-center justify-between gap-4">
                  <div class="flex flex-wrap gap-4 text-xs opacity-50">
                    <span class="flex items-center gap-1.5"><User size={12} />{t('by')} {featuredArticle.author}</span>
                    <span class="flex items-center gap-1.5"><Clock size={12} />{featuredArticle.readTime} {t('minread')}</span>
                  </div>
                  <a href="/news/{featuredArticle.slug}"
                     class="btn btn-primary" style="padding:0.6rem 1.5rem;font-size:0.875rem">
                    {t('read')} <ArrowRight size={15} />
                  </a>
                </div>
              </div>
            </article>
          {/key}
        {/if}

        <!-- Rest of articles grid -->
        {#if restArticles.length > 0}
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {#each restArticles as article, i (article.slug)}
              <article in:fly={{ y: 20, duration: 400, delay: i * 80 }}
                       class="card flex flex-col group">
                <div class="h-1.5 flex-shrink-0"
                     style="background:linear-gradient(90deg,var(--color-grove),var(--color-amber))"></div>
                <div class="p-6 flex flex-col flex-1">
                  <div class="flex flex-wrap gap-1.5 mb-3">
                    {#each article.tags.slice(0, 3) as tag}
                      <span class="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                            style="background:var(--color-sage);color:var(--color-grove)">{tag}</span>
                    {/each}
                  </div>
                  <h3 class="font-serif text-xl font-bold leading-snug mb-2 transition-colors"
                      style="color:var(--color-forest)">
                    {article.title}
                  </h3>
                  <p class="text-sm leading-relaxed opacity-65 mb-4 flex-1 line-clamp-3">
                    {article.description}
                  </p>
                  <div class="border-t pt-4 mt-auto flex items-center justify-between gap-2"
                       style="border-color:var(--color-sage)">
                    <div class="flex flex-wrap gap-3 text-xs opacity-45">
                      <span class="flex items-center gap-1"><Calendar size={11} />{formatDate(article.date)}</span>
                      <span class="flex items-center gap-1"><Clock size={11} />{article.readTime} {t('minread')}</span>
                    </div>
                    <a href="/news/{article.slug}"
                       class="flex items-center gap-1 text-xs font-semibold transition-all hover:gap-2"
                       style="color:var(--color-grove)">
                      {t('read')} <ArrowRight size={13} />
                    </a>
                  </div>
                </div>
              </article>
            {/each}
          </div>
        {/if}
      {/if}
    </div>
  </section>
</div>

<style>
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
