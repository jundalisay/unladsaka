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

<div class="relative flex md:w-72 flex-shrink-0 flex-col justify-between overflow-hidden p-8"
  style="background: {featuredArticle.image 
    ? `url('${featuredArticle.image}') center/cover no-repeat, linear-gradient(160deg, var(--color-forest), var(--color-grove))` 
    : 'linear-gradient(160deg, var(--color-forest), var(--color-grove))'}">
  
  {#if featuredArticle.image}
    <div class="absolute inset-0 z-0 bg-black/40"></div>
  {/if}
  
  <div class="relative z-10">
    <span 
      class="mb-4 inline-block rounded-full px-3 py-1 text-xs font-semibold"
      style="background: rgba(212, 160, 23, 0.25); color: var(--color-amber);">
      ✦ {t('featured')}
    </span>

    <div class="mb-3 flex flex-wrap gap-1.5">
      {#each featuredArticle.tags as tag}
        <span 
          class="rounded px-2 py-0.5 text-xs capitalize"
          style="background: rgba(255, 255, 255, 0.12); color: var(--color-mint);"
        >
          {tag}
        </span>
      {/each}
    </div>
  </div>
  
  {#if !featuredArticle.image}
    <svg 
      class="absolute right-0 bottom-0 z-0 h-28 w-28 opacity-10" 
      viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="40" y1="75" x2="40" y2="10" stroke="#d4a017" stroke-width="2"/>
      <ellipse cx="28" cy="38" rx="8" ry="16" fill="#d4a017" transform="rotate(-30,28,38)"/>
      <ellipse cx="52" cy="38" rx="8" ry="16" fill="#d4a017" transform="rotate(30,52,38)"/>
      <ellipse cx="40" cy="12" rx="7" ry="14" fill="#d4a017"/>
    </svg>
  {/if}
  
  <div class="relative z-10 mt-4 flex items-center gap-1.5 text-xs text-white/50">
    <Calendar size={11} /> 
    {formatDate(featuredArticle.date)}
  </div>
</div>

              <!-- Content -->
              <div class="p-8 flex flex-col flex-1">
                <a href="/news/{featuredArticle.slug}">
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
                    <div class="btn btn-primary" style="padding:0.6rem 1.5rem;font-size:0.875rem">
                      {t('read')} <ArrowRight size={15} />
                    </div>
                  </div>
                </a>
              </div>
            </article>
          {/key}
        {/if}

        <!-- Rest of articles grid -->
        {#if restArticles.length > 0}
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {#each restArticles as article, i (article.slug)}
              <article in:fly={{ y: 20, duration: 400, delay: i * 80 }}
                       class="card flex flex-col group overflow-hidden">
                  <!-- Image Section -->
                <a href="/news/{article.slug}">
                  <div class="relative w-full aspect-[16/9] overflow-hidden bg-gray-100">
                    {#if article.image}
                      <img 
                        src={article.image} 
                        alt={article.title}
                        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy" />
                    {:else}
                      <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold-400/20 to-amber-400/20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="text-gold-500/50">
                          <rect x="2" y="2" width="20" height="20" rx="2.18"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <path d="M21 15l-5-5-5 5-5-5-4 4"/>
                        </svg>
                      </div>
                    {/if}
                    
                    <!-- Optional gradient overlay for text readability -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  
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
                      
                      <div class="flex items-center gap-1 text-xs font-semibold transition-all hover:gap-2"
                         style="color:var(--color-grove)">
                        {t('read')} <ArrowRight size={13} />
                      </div>
                    </div>
                  </div>
                </a>
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
