<script lang="ts">
  import '../app.css';
  import { page } from '$app/state';
  import { fly, slide } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { onNavigate } from '$app/navigation';
  import { Menu, X, Sprout, Facebook, Linkedin, ChevronDown } from 'lucide-svelte';
  import type { LayoutData } from './$types';
  import { localeNames, type Locale } from '$lib/i18n';

  let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();

  let menuOpen = $state(false);
  let langOpen = $state(false);
  let scrolled = $state(false);

  let locale = $derived((data.locale ?? 'en') as Locale);
  let path    = $derived(page.url.pathname);

  onNavigate(() => { menuOpen = false; langOpen = false; });

  const navLinks = [
    { href: '/',         label: { en: 'Home',     tl: 'Tahanan',    cb: 'Panimalay' } },
    { href: '/harvest',  label: { en: 'Harvest',  tl: 'Ani',        cb: 'Ani'       } },
    { href: '/news',     label: { en: 'News',     tl: 'Balita',     cb: 'Balita'    } },
    { href: '/training', label: { en: 'Training', tl: 'Pagsasanay', cb: 'Pagbansay' } },
  ];

  const joinLabel: Record<Locale, string> = { en: 'Join Now', tl: 'Sumali Na', cb: 'Apil Na' };

  const footerT = {
    tagline: { en: 'Advancing Philippine agriculture through unity, knowledge, and innovation.', tl: 'Isinusulong ang agrikulturang Pilipino sa pamamagitan ng pagkakaisa, kaalaman, at inobasyon.', cb: 'Gipaabante ang agrikultura sa Pilipinas pinaagi sa panaghiusa, kahibalo, ug inobasyon.' },
    links:   { en: 'Quick Links',     tl: 'Mabilis na Mga Link', cb: 'Dali nga mga Link'   },
    connect: { en: 'Connect With Us', tl: 'Makipag-ugnayan',     cb: 'Makig-ugnay Kanamo'  },
    rights:  { en: 'All rights reserved.', tl: 'Lahat ng karapatan ay nakalaan.', cb: 'Tanan nga katungod napreserba.' },
  };

  function isActive(href: string) {
    if (href === '/') return path === '/';
    return path.startsWith(href);
  }

  async function setLocale(l: Locale) {
    langOpen = false;
    menuOpen = false;
    await fetch('/api/locale', {
      method: 'POST',
      body: JSON.stringify({ locale: l }),
      headers: { 'Content-Type': 'application/json' }
    });
    location.reload();
  }

  function handleScroll() { scrolled = window.scrollY > 30; }
</script>

<svelte:window onscroll={handleScroll} />

<!-- ── Navbar ─────────────────────────────────────────────────── -->
<header class="fixed top-0 inset-x-0 z-50 transition-all duration-300"
        style={scrolled
          ? 'background:rgba(22,57,39,0.97);backdrop-filter:blur(14px);box-shadow:0 2px 32px rgba(0,0,0,0.22)'
          : 'background:transparent'}>

  <nav class="container flex items-center justify-between" style="height:4.5rem">

    <!-- Logo -->
    <a href="/" class="flex items-center gap-3 group" aria-label="Unlad Saka – Home">
      <div class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110"
           style="background:linear-gradient(135deg,var(--color-gold),var(--color-amber));box-shadow:0 2px 12px rgba(212,160,23,0.4)">
        <Sprout size={19} color="var(--color-forest)" strokeWidth={2.5} />
      </div>
      <div class="leading-none">
        <span class="font-serif font-bold text-lg block transition-colors"
              style="color:{scrolled ? 'white' : 'var(--color-cream)'}">Unlad Saka</span>
        <span class="text-xs block mt-0.5 transition-colors"
              style="color:{scrolled ? 'var(--color-wheat)' : 'var(--color-flax)'};opacity:0.7">Philippine Farm Association</span>
      </div>
    </a>

    <!-- Desktop nav -->
    <ul class="hidden md:flex items-center gap-0.5" role="list">
      {#each navLinks as link}
        <li>
          <a href={link.href}
             class="relative px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 block"
             style="color:{isActive(link.href) ? 'var(--color-amber)' : scrolled ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.82)'};background:{isActive(link.href) ? 'rgba(255,255,255,0.08)' : 'transparent'}">
            {link.label[locale]}
            {#if isActive(link.href)}
              <span class="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                    style="background:var(--color-amber)"></span>
            {/if}
          </a>
        </li>
      {/each}
    </ul>

    <!-- Right controls -->
    <div class="hidden md:flex items-center gap-2.5">
      <!-- Language picker -->
      <div class="relative">
        <button onclick={() => langOpen = !langOpen}
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style="color:{scrolled ? 'var(--color-wheat)' : 'rgba(255,255,255,0.8)'};border:1px solid {scrolled ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.25)'}">
          {locale.toUpperCase()}
          <ChevronDown size={13} style="transition:transform 0.2s ease;transform:rotate({langOpen ? 180 : 0}deg)" />
        </button>
        {#if langOpen}
          <div transition:fly={{ y: -6, duration: 160, easing: cubicOut }}
               class="absolute right-0 mt-2 rounded-xl overflow-hidden shadow-2xl"
               style="background:var(--color-forest);border:1px solid var(--color-fern);width:9rem;z-index:60">
            {#each Object.entries(localeNames) as [code, name]}
              <button onclick={() => setLocale(code as Locale)}
                      class="w-full text-left px-4 py-2.5 text-sm transition-colors block hover:bg-white/10"
                      style="color:{code === locale ? 'var(--color-amber)' : 'var(--color-mint)'};font-weight:{code === locale ? '600' : '400'}">
                {name}
              </button>
            {/each}
          </div>
        {/if}
      </div>

      <a href="/#register" class="btn btn-gold" style="padding:0.55rem 1.3rem;font-size:0.875rem">
        {joinLabel[locale]}
      </a>
    </div>

    <!-- Mobile hamburger -->
    <button class="md:hidden p-2.5 rounded-lg transition-colors"
            style="color:white;background:{menuOpen ? 'rgba(255,255,255,0.12)' : 'transparent'}"
            onclick={() => menuOpen = !menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
      {#if menuOpen}<X size={22} />{:else}<Menu size={22} />{/if}
    </button>
  </nav>

  <!-- Mobile menu -->
  {#if menuOpen}
    <div transition:slide={{ duration: 280, easing: cubicOut }}
         style="background:rgba(22,57,39,0.98);backdrop-filter:blur(16px);border-top:1px solid rgba(255,255,255,0.08)">
      <div class="container pt-3 pb-5 flex flex-col gap-1">
        {#each navLinks as link}
          <a href={link.href}
             onclick={() => menuOpen = false}
             class="px-4 py-3 rounded-xl text-sm font-medium transition-colors block"
             style="color:{isActive(link.href) ? 'var(--color-amber)' : 'rgba(255,255,255,0.8)'};background:{isActive(link.href) ? 'rgba(255,255,255,0.08)' : 'transparent'}">
            {link.label[locale]}
          </a>
        {/each}
        <div class="border-t mt-3 pt-4" style="border-color:rgba(255,255,255,0.1)">
          <p class="text-xs uppercase tracking-widest mb-3 px-4"
             style="color:rgba(255,255,255,0.35);font-size:0.65rem">Language</p>
          <div class="flex gap-2 px-4 flex-wrap">
            {#each Object.entries(localeNames) as [code, name]}
              <button onclick={() => setLocale(code as Locale)}
                      class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                      style="background:{code === locale ? 'var(--color-gold)' : 'rgba(255,255,255,0.08)'};color:{code === locale ? 'var(--color-forest)' : 'rgba(255,255,255,0.75)'}">
                {name}
              </button>
            {/each}
          </div>
          <a href="/#register" onclick={() => menuOpen = false}
             class="btn btn-gold mt-4 w-full text-center justify-center block"
             style="padding:0.8rem">
            {joinLabel[locale]}
          </a>
        </div>
      </div>
    </div>
  {/if}
</header>

{#if langOpen}
  <div class="fixed inset-0 z-40" role="presentation"
       onclick={() => langOpen = false}
       onkeydown={() => langOpen = false}></div>
{/if}

<!-- ── Page content ────────────────────────────────────────────── -->
<main>{@render children()}</main>

<!-- ── Footer ─────────────────────────────────────────────────── -->
<footer style="background:var(--color-soil)">
  <div class="container py-16">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-10">

      <div>
        <a href="/" class="flex items-center gap-3 mb-5 group">
          <div class="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
               style="background:linear-gradient(135deg,var(--color-gold),var(--color-amber))">
            <Sprout size={22} color="var(--color-forest)" />
          </div>
          <span class="font-serif text-xl font-bold" style="color:var(--color-wheat)">Unlad Saka</span>
        </a>
        <p class="text-sm leading-relaxed max-w-xs" style="color:var(--color-sage);opacity:0.65">
          {footerT.tagline[locale]}
        </p>
      </div>

      <div>
        <h4 class="font-serif text-base font-bold mb-5 uppercase tracking-wider"
            style="color:var(--color-wheat);font-size:0.85rem">{footerT.links[locale]}</h4>
        <ul class="space-y-2.5">
          {#each navLinks as link}
            <li>
              <a href={link.href}
                 class="text-sm transition-all hover:translate-x-1 inline-block"
                 style="color:var(--color-mint);opacity:0.65">{link.label[locale]}</a>
            </li>
          {/each}
          <li>
            <a href="/admin" class="text-sm transition-all hover:translate-x-1 inline-block"
               style="color:var(--color-mint);opacity:0.65">Admin</a>
          </li>
        </ul>
      </div>

      <div>
        <h4 class="font-serif text-base font-bold mb-5 uppercase tracking-wider"
            style="color:var(--color-wheat);font-size:0.85rem">{footerT.connect[locale]}</h4>
        <div class="flex gap-3 mb-6">
          <a href="https://www.facebook.com/unladsakaph/" target="_blank" rel="noopener noreferrer"
             class="w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-0.5"
             style="background:rgba(255,255,255,0.08)" aria-label="Facebook">
            <Facebook size={19} color="var(--color-mint)" />
          </a>
          <a href="https://www.linkedin.com/company/unladsaka" target="_blank" rel="noopener noreferrer"
             class="w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-0.5"
             style="background:rgba(255,255,255,0.08)" aria-label="LinkedIn">
            <Linkedin size={19} color="var(--color-mint)" />
          </a>
        </div>
        <address class="not-italic text-sm" style="color:var(--color-sage);opacity:0.5">
          <a href="mailto:info@unladsakaph.org" class="hover:opacity-80 transition-opacity block">
            info@unladsakaph.org
          </a>
        </address>
      </div>
    </div>

    <div class="border-t flex flex-col sm:flex-row items-center justify-between gap-3 pt-6"
         style="border-color:rgba(255,255,255,0.07)">
      <p class="text-xs" style="color:var(--color-sage);opacity:0.35">
        &copy; {new Date().getFullYear()} Unlad Saka. {footerT.rights[locale]}
      </p>
      <p class="text-xs" style="color:var(--color-sage);opacity:0.25">Built with 🌾 for Filipino farmers</p>
    </div>
  </div>
</footer>
