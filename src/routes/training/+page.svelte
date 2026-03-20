<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { Monitor, MapPin, Users, Clock, Star, ChevronRight, CheckCircle, Sprout } from 'lucide-svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  let locale = $derived((data.locale ?? 'en') as 'en' | 'tl' | 'cb');

  const T: Record<string, Record<string, string>> = {
    title:      { en: 'Training Programs',           tl: 'Mga Programa sa Pagsasanay',     cb: 'Mga Programa sa Pagbansay' },
    subtitle:   { en: 'Skill-building workshops and seminars designed for modern Filipino farmers.',
                  tl: 'Mga workshop at seminar para sa modernong mga magsasakang Pilipino.',
                  cb: 'Mga workshop ug seminar alang sa modernong mga mag-uumang Pilipino.' },
    upcoming:   { en: 'Upcoming Sessions',            tl: 'Mga Paparating na Sesyon',        cb: 'Mga Umaabot nga Sesyon' },
    free:       { en: 'FREE',                         tl: 'LIBRE',                           cb: 'LIBRE' },
    online:     { en: 'Online (Zoom)',                tl: 'Online (Zoom)',                   cb: 'Online (Zoom)' },
    onsite:     { en: 'On-site',                      tl: 'Sa Lugar',                        cb: 'Sa Lugar' },
    seats:      { en: 'seats available',              tl: 'puwestong bakante',               cb: 'bakanteng lingkoranan' },
    register:   { en: 'Register',                     tl: 'Mag-rehistro',                    cb: 'Mag-rehistro' },
    duration:   { en: 'Duration',                     tl: 'Tagal',                           cb: 'Gidugayon' },
    tracks:     { en: 'Learning Tracks',              tl: 'Mga Landas ng Pag-aaral',         cb: 'Mga Landas sa Pagkat-on' },
    tracks_sub: { en: 'Browse programs by specialization.',
                  tl: 'I-browse ang mga programa ayon sa espesyalisasyon.',
                  cb: 'I-browse ang mga programa base sa espesyalisasyon.' },
    benefits:   { en: 'Why Train with Unlad Saka?',   tl: 'Bakit Mag-aral sa Unlad Saka?',  cb: 'Ngano Magbansay sa Unlad Saka?' },
    cert:       { en: 'DA-recognized certificate upon completion.',
                  tl: 'DA-recognized na sertipiko pagkatapos.',
                  cb: 'DA-recognized nga sertipiko pagkahuman.' },
    network:    { en: 'Connect with expert trainors and fellow farmers.',
                  tl: 'Kumonekta sa mga eksperto at kapwa magsasaka.',
                  cb: 'Konek sa mga eksperto ug kauban nga mag-uuma.' },
    material:   { en: 'Free learning materials and follow-up support.',
                  tl: 'Libreng mga materyales at follow-up na suporta.',
                  cb: 'Libre nga mga materyales ug follow-up nga suporta.' },
    applied:    { en: 'Practical, applied learning — not just theory.',
                  tl: 'Praktikal na pag-aaral — hindi lamang teorya.',
                  cb: 'Praktikal nga pagkat-on — dili lang teorya.' },
  };
  const t = (k: string) => T[k]?.[locale] ?? T[k]?.en ?? k;

  let visible = $state(false);
  onMount(() => setTimeout(() => (visible = true), 80));

  interface Session {
    title: Record<string, string>;
    desc: Record<string, string>;
    date: string;
    mode: string;
    location: string;
    seats: number;
    duration: string;
    free: boolean;
    price?: string;
    level: string;
    tags: string[];
  }

  const sessions: Session[] = [
    {
      title:    { en:'Organic Farming Fundamentals', tl:'Mga Pundasyon ng Organic Farming', cb:'Mga Pundasyon sa Organic Farming' },
      desc:     { en:'Hands-on soil health, composting, natural pest management, and organic certification processes.', tl:'Praktikal na pag-aaral tungkol sa kalusugan ng lupa, compost, at natural na pamamahala ng peste.', cb:'Praktikal nga pagkat-on bahin sa kahimsog sa yuta, compost, ug natural nga pagdumala sa peste.' },
      date:     'Feb 8–10, 2025',
      mode:     'onsite',
      location: 'Sta. Rosa, Laguna',
      seats:    25,
      duration: '3 days',
      free:     true,
      level:    'Beginner',
      tags:     ['organic', 'soil'],
    },
    {
      title:    { en:'Digital Tools for Modern Farmers', tl:'Mga Digital na Kasangkapan para sa mga Magsasaka', cb:'Digital nga mga Kasangkapan alang sa mga Mag-uuma' },
      desc:     { en:'Farm management apps, satellite field mapping, weather forecasting, and e-commerce for selling produce.', tl:'Pag-aralan ang mga app sa pamamahala ng bukid, satellite mapping, at e-commerce.', cb:'Pagkat-on sa mga app sa pagdumala sa uma, satellite mapping, ug e-commerce.' },
      date:     'Feb 15, 2025',
      mode:     'online',
      location: 'Zoom Webinar',
      seats:    100,
      duration: '1 day',
      free:     true,
      level:    'All Levels',
      tags:     ['technology', 'digital'],
    },
    {
      title:    { en:'High-Value Crop Production', tl:'Pagsasaka ng mga Mataas na Kita na Pananim', cb:'Produksyon sa mga High-Value nga Tanom' },
      desc:     { en:'Grow asparagus, strawberries, herbs, and specialty vegetables for premium export and local markets.', tl:'Matuto sa pagpapalaki ng asparagus, strawberry, halaman, at espesyal na gulay para sa premium markets.', cb:'Pagkat-on sa pagtubo sa asparagus, strawberry, ug espesyal nga mga utan para sa premium markets.' },
      date:     'Mar 1–3, 2025',
      mode:     'onsite',
      location: 'La Trinidad, Benguet',
      seats:    20,
      duration: '3 days',
      free:     false,
      price:    '₱500',
      level:    'Intermediate',
      tags:     ['high-value', 'vegetables'],
    },
    {
      title:    { en:'Post-Harvest Handling & Value Adding', tl:'Post-Harvest at Pagdaragdag ng Halaga', cb:'Post-Harvest ug Pagdugang sa Kantidad' },
      desc:     { en:'Reduce post-harvest losses and create value-added products: dried fruits, vinegar, preserved vegetables.', tl:'Bawasan ang post-harvest na pagkawala at gumawa ng mga produktong may dagdag na halaga.', cb:'Pagminus sa post-harvest nga pagkawala ug paghimo sa mga produkto nga may dugang nga kantidad.' },
      date:     'Mar 22, 2025',
      mode:     'online',
      location: 'Zoom Webinar',
      seats:    80,
      duration: '1 day',
      free:     true,
      level:    'All Levels',
      tags:     ['post-harvest', 'value-adding'],
    },
    {
      title:    { en:'Farm Financial Management', tl:'Pamamahala ng Pananalapi sa Bukid', cb:'Pagdumala sa Pananalapi sa Uma' },
      desc:     { en:'Record-keeping, farm budgeting, loan applications, and accessing DA Agri-Negosyo programs for capital.', tl:'Pag-iingat ng rekord, budgeting ng bukid, loan applications, at mga programa ng DA.', cb:'Pag-irekord, budgeting sa uma, loan applications, ug mga programa sa DA.' },
      date:     'Apr 5, 2025',
      mode:     'online',
      location: 'Zoom Webinar',
      seats:    120,
      duration: '1 day',
      free:     true,
      level:    'All Levels',
      tags:     ['finance', 'business'],
    },
    {
      title:    { en:'Climate-Smart Rice Production', tl:'Climate-Smart na Produksyon ng Palay', cb:'Climate-Smart nga Produksyon sa Humay' },
      desc:     { en:'AWD irrigation, stress-tolerant seed varieties, and PAGASA weather tools for resilient rice farming.', tl:'AWD irrigation, mga binhing stress-tolerant, at mga tool ng PAGASA para sa matibay na pagsasaka ng palay.', cb:'AWD irrigation, stress-tolerant nga mga binhi, ug mga tool sa PAGASA para sa resilient nga pag-uma.' },
      date:     'Apr 19–20, 2025',
      mode:     'onsite',
      location: 'Camarines Sur',
      seats:    30,
      duration: '2 days',
      free:     true,
      level:    'Intermediate',
      tags:     ['rice', 'climate'],
    },
  ];

  const tracks = [
    { emoji:'🌱', en:'Crop Production',   tl:'Produksyon ng Pananim',    cb:'Produksyon sa Tanom',    count:12 },
    { emoji:'💧', en:'Water Management',  tl:'Pamamahala ng Tubig',      cb:'Pagdumala sa Tubig',     count:5  },
    { emoji:'📊', en:'Farm Business',     tl:'Negosyo sa Bukid',         cb:'Negosyo sa Uma',         count:8  },
    { emoji:'🔬', en:'Soil Science',      tl:'Agham ng Lupa',            cb:'Siyensya sa Yuta',       count:6  },
    { emoji:'🤖', en:'AgriTech',          tl:'AgriTech',                 cb:'AgriTech',               count:4  },
    { emoji:'🌿', en:'Organic & Natural', tl:'Organic at Natural',       cb:'Organic ug Natural',     count:7  },
    { emoji:'📦', en:'Post-Harvest',      tl:'Post-Harvest',             cb:'Post-Harvest',           count:5  },
    { emoji:'💰', en:'Agri-Finance',      tl:'Agri-Finance',             cb:'Agri-Finance',           count:4  },
    { emoji:'🌍', en:'Climate-Smart',     tl:'Climate-Smart',            cb:'Climate-Smart',          count:6  },
  ];

  const benefits = ['cert','network','material','applied'];
</script>

<svelte:head>
  <title>Training – Unlad Saka</title>
  <meta name="description" content="Free agricultural training workshops and seminars for Filipino farmers from Unlad Saka." />
</svelte:head>

<div class="pt-20">
  <!-- Header -->
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

  <div class="section">
    <div class="container">

      <!-- Benefits strip -->
      <div class="card p-6 mb-14" style="background:var(--color-parchment);border-color:var(--color-mint)">
        <h3 class="font-serif text-xl font-bold mb-5 text-center" style="color:var(--color-forest)">{t('benefits')}</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {#each benefits as b, i}
            <div class="flex items-start gap-2.5 p-3 rounded-xl"
                 style="background:white;animation:fadeUp 0.5s ease both;animation-delay:{i*0.08}s">
              <CheckCircle size={18} color="var(--color-grove)" class="flex-shrink-0 mt-0.5" />
              <span class="text-sm leading-snug opacity-75">{t(b)}</span>
            </div>
          {/each}
        </div>
      </div>

      <!-- Learning tracks -->
      <div class="mb-16">
        <h2 class="font-serif text-3xl font-bold text-center mb-2" style="color:var(--color-forest)">{t('tracks')}</h2>
        <p class="text-center opacity-55 mb-8 text-sm">{t('tracks_sub')}</p>
        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-3">
          {#each tracks as track, i}
            <div class="card p-4 text-center cursor-default transition-all hover:scale-105 hover:border-amber-300"
                 style="animation:fadeUp 0.45s ease both;animation-delay:{i*0.05}s">
              <div class="text-3xl mb-2">{track.emoji}</div>
              <div class="text-xs font-semibold leading-tight" style="color:var(--color-forest)">{track[locale as 'en'] ?? track.en}</div>
              <div class="text-xs mt-1 opacity-40">{track.count}</div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Sessions -->
      <h2 class="font-serif text-3xl font-bold mb-8" style="color:var(--color-forest)">{t('upcoming')}</h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {#each sessions as session, i}
          <article class="card flex flex-col"
                   style="animation:fadeUp 0.6s ease both;animation-delay:{i*0.08}s">
            <div class="h-1.5 flex-shrink-0"
                 style="background:linear-gradient(90deg,var(--color-grove),var(--color-amber))"></div>
            <div class="p-6 flex flex-col flex-1">
              <!-- Top row: tags + badge -->
              <div class="flex items-start justify-between gap-3 mb-3">
                <div class="flex flex-wrap gap-1.5">
                  {#each session.tags as tag}
                    <span class="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                          style="background:var(--color-sage);color:var(--color-grove)">{tag}</span>
                  {/each}
                </div>
                {#if session.free}
                  <span class="flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold"
                        style="background:var(--color-grove);color:white">{t('free')}</span>
                {:else}
                  <span class="flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold"
                        style="background:var(--color-flax);color:var(--color-harvest)">{session.price}</span>
                {/if}
              </div>

              <!-- Title + desc -->
              <h3 class="font-serif text-lg font-bold mb-2 leading-snug" style="color:var(--color-forest)">
                {session.title[locale] ?? session.title.en}
              </h3>
              <p class="text-sm opacity-68 mb-5 leading-relaxed flex-1">
                {session.desc[locale] ?? session.desc.en}
              </p>

              <!-- Meta grid -->
              <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-xs opacity-60 mb-5">
                <div class="flex items-center gap-1.5">
                  <Star size={12} /> {session.level}
                </div>
                <div class="flex items-center gap-1.5">
                  <Clock size={12} /> {t('duration')}: {session.duration}
                </div>
                <div class="flex items-center gap-1.5">
                  {#if session.mode === 'online'}
                    <Monitor size={12} /> {t('online')}
                  {:else}
                    <MapPin size={12} /> {session.location}
                  {/if}
                </div>
                <div class="flex items-center gap-1.5">
                  <Users size={12} /> {session.seats} {t('seats')}
                </div>
              </div>

              <!-- Footer -->
              <div class="flex items-center justify-between pt-4 border-t gap-3"
                   style="border-color:var(--color-sage)">
                <span class="text-sm font-semibold flex items-center gap-1.5"
                      style="color:var(--color-harvest)">
                  📅 {session.date}
                </span>
                <a href="/#register" class="btn btn-primary"
                   style="padding:0.5rem 1.25rem;font-size:0.8rem">
                  {t('register')} <ChevronRight size={14} />
                </a>
              </div>
            </div>
          </article>
        {/each}
      </div>

    </div>
  </div>
</div>
