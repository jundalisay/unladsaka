<script lang="ts">
  import { enhance } from '$app/forms';
  import { fly, fade, scale } from 'svelte/transition';
  import { cubicOut, elasticOut, backOut } from 'svelte/easing';
  import { onMount } from 'svelte';
  import {
    Sprout, Users, MapPin, Award, Wheat, ArrowRight, ArrowDown,
    CheckCircle, AlertCircle, Loader, ShieldCheck, Handshake,
    GraduationCap, BarChart3, Facebook, Linkedin
  } from 'lucide-svelte';
  import type { PageData, ActionData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  let locale = $derived((data.locale ?? 'en') as 'en'|'tl'|'cb');

  let visible = $state(false);
  let submitting = $state(false);
  let statsVisible = $state(false);
  let statsRef: HTMLElement | undefined = $state();

  import { ChevronDown } from 'lucide-svelte';

  function scrollToTarget() {
    window.scrollBy({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  }


  onMount(() => {
    setTimeout(() => (visible = true), 80);
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { statsVisible = true; obs.disconnect(); }
    }, { threshold: 0.3 });
    if (statsRef) obs.observe(statsRef);
    return () => obs.disconnect();
  });

  const T: Record<string, Record<string, string>> = {
    hero_eyebrow: { en: 'Farmer Association', tl: 'Samahan ng mga Magsasaka', cb: 'Katilingban sa mga Mag-uuma' },
    hero_title1:  { en: 'Growing Together,', tl: 'Sama-sama Tayong Lumalago,', cb: 'Magkauban Kitang Motubo,' },
    hero_title2:  { en: 'Harvesting Tomorrow', tl: 'Masaganang Bukas', cb: 'Maabundansiyang Ugma' },
    hero_sub:     { en: 'Unlad Saka unites Filipino farmers to build stronger communities, share knowledge, and advance sustainable agriculture across the archipelago.', tl: 'Ang Unlad Saka ay nagbubuklod sa mga magsasakang Pilipino upang bumuo ng mas matibay na komunidad at isulong ang napapanatiling pagsasaka.', cb: 'Ang Unlad Saka nagpahiusa sa mga mag-uumang Pilipino aron magtukod ug mas lig-on nga komunidad ug ipadayon ang napadayong pahumok.' },
    hero_cta1:    { en: 'Join the Association', tl: 'Sumali sa Samahan', cb: 'Apil sa Katilingban' },
    hero_cta2:    { en: 'Learn More', tl: 'Alamin ang Higit Pa', cb: 'Pagkat-on og Dugang' },
    s_members:    { en: 'Members Nationwide', tl: 'Miyembro sa Buong Bansa', cb: 'Miyembro sa Tibuok Bansa' },
    s_provinces:  { en: 'Provinces Served', tl: 'Lalawigan ang Nasasakupan', cb: 'Probinsya ang Gisakupan' },
    s_years:      { en: 'Years of Service', tl: 'Taon ng Serbisyo', cb: 'Tuig sa Serbisyo' },
    s_crops:      { en: 'Crop Varieties Tracked', tl: 'Uri ng Pananim ang Sinusubaybayan', cb: 'Matang sa Tanom ang Ginabantayan' },
    why_title:    { en: 'Why Join Unlad Saka?', tl: 'Bakit Sumali sa Unlad Saka?', cb: 'Ngano Apil sa Unlad Saka?' },
    why_sub:      { en: 'We exist to make every Filipino farmer more prosperous, more connected, and better equipped.', tl: 'Narito kami upang gawing mas maunlad, mas konektado, at mas handa ang bawat magsasakang Pilipino.', cb: 'Ania kami aron mas umunlad, mas konektado, ug mas andam ang matag mag-uumang Pilipino.' },
    reg_title:    { en: 'Join Unlad Saka', tl: 'Sumali sa Unlad Saka', cb: 'Apil sa Unlad Saka' },
    reg_sub:      { en: 'Become a member and gain access to resources, training, market links, and a nationwide network of farmers.', tl: 'Maging miyembro at makakuha ng access sa mga mapagkukunan, pagsasanay, at network ng mga kapwa magsasaka.', cb: 'Mahimong miyembro ug makuha ang access sa mga kapanguhaan, pagbansay, ug network sa mga kauban nga mag-uuma.' },
    lbl_name:     { en: 'Full Name', tl: 'Buong Pangalan', cb: 'Tibuok Ngalan' },
    lbl_email:    { en: 'Email Address', tl: 'Email Address', cb: 'Email Address' },
    lbl_phone:    { en: 'Phone Number', tl: 'Numero ng Telepono', cb: 'Numero sa Telepono' },
    lbl_region:   { en: 'Region', tl: 'Rehiyon', cb: 'Rehiyon' },
    lbl_rph:      { en: 'Select your region', tl: 'Piliin ang iyong rehiyon', cb: 'Pilia ang imong rehiyon' },
    lbl_farm:     { en: 'Farm Size (hectares)', tl: 'Sukat ng Bukid (ektarya)', cb: 'Gidak-on sa Uma (ektarya)' },
    lbl_crops:    { en: 'Main Crops Grown', tl: 'Pangunahing Pananim', cb: 'Nag-unang mga Tanom' },
    lbl_cph:      { en: 'e.g. Rice, Corn, Vegetables', tl: 'hal., Palay, Mais, Gulay', cb: 'pananglitan, Humay, Mais, Utan' },
    lbl_msg:      { en: 'Message (optional)', tl: 'Mensahe (opsyonal)', cb: 'Mensahe (opsyonal)' },
    lbl_mph:      { en: 'Tell us about your farm and goals…', tl: 'Sabihin sa amin ang tungkol sa iyong bukid at mga pangarap…', cb: 'Sultihi kami bahin sa imong uma ug mga plano…' },
    reg_btn:      { en: 'Register Now', tl: 'Mag-rehistro Na', cb: 'Mag-rehistro Na' },
    reg_doing:    { en: 'Registering…', tl: 'Nagrerehistro…', cb: 'Nagparehistro…' },
    reg_ok:       { en: "Welcome to Unlad Saka! We'll be in touch soon.", tl: 'Maligayang pagdating sa Unlad Saka! Makikipag-ugnayan kami sa inyo.', cb: 'Malugway nga pag-abot sa Unlad Saka! Makig-ugnay kami kaninyo.' },
    reg_priv:     { en: 'Your information is kept private and used only to serve you better.', tl: 'Ang iyong impormasyon ay pinananatiling pribado.', cb: 'Ang imong impormasyon gipadayon nga pribado.' },
    mission_title: { en: 'Our Mission', tl: 'Ang Aming Misyon', cb: 'Ang Atong Misyon' },
    mission_body:  { en: 'To empower Filipino farmers through collective action, knowledge sharing, access to markets, and advocacy for fair agricultural policies — building a more prosperous and food-secure Philippines.', tl: 'Bigyan ng kapangyarihan ang mga magsasakang Pilipino sa pamamagitan ng kolektibong pagkilos, pagbabahagi ng kaalaman, at pagtataguyod ng makatarungang patakaran.', cb: 'Paghatag ug gahum sa mga mag-uumang Pilipino pinaagi sa kolektibong aksyon, pagpaambit sa kahibalo, ug pagtuyo sa makatarungang mga patakaran.' },
  };
  const t = (k: string) => T[k]?.[locale] ?? T[k]?.en ?? k;

  const regions = ['Ilocos Region (I)','Cagayan Valley (II)','Central Luzon (III)','CALABARZON (IV-A)','MIMAROPA (IV-B)','Bicol Region (V)','Western Visayas (VI)','Central Visayas (VII)','Eastern Visayas (VIII)','Zamboanga Peninsula (IX)','Northern Mindanao (X)','Davao Region (XI)','SOCCSKSARGEN (XII)','Caraga (XIII)','NCR','CAR','BARMM'];

  const stats = [
    { value: '12,400+', key: 's_members',   icon: Users },
    { value: '75',      key: 's_provinces', icon: MapPin },
    { value: '15+',     key: 's_years',     icon: Award },
    { value: '200+',    key: 's_crops',     icon: Wheat },
  ];

  const features = [
    { icon: BarChart3,    color: '#52b788', bg: '#d8f3dc', en: 'Market Access', tl: 'Access sa Merkado', cb: 'Pag-access sa Merkado', bodyEn: 'Connect directly with buyers, traders, and cooperatives across the Philippines for fair prices.', bodyTl: 'Direktang kumonekta sa mga mamimili at kooperatibo sa buong Pilipinas para sa makatarungang presyo.', bodyCb: 'Direkta nga konek sa mga mamumpalit ug kooperatiba sa tibuok Pilipinas.' },
    { icon: GraduationCap, color: '#d4a017', bg: '#fde9a0', en: 'Expert Training', tl: 'Eksperto na Pagsasanay', cb: 'Esperto nga Pagbansay', bodyEn: 'Free workshops on modern farming, soil health, climate adaptation, and agri-technology.', bodyTl: 'Libreng mga workshop sa modernong pagsasaka, kalusugan ng lupa, at teknolohiya.', bodyCb: 'Libre nga mga workshop sa modernong pagpananom, kahimsog sa yuta, ug teknolohiya.' },
    { icon: ShieldCheck,  color: '#2d6a4f', bg: '#d8f3dc', en: 'Government Liaison', tl: 'Pakikipag-ugnayan sa Pamahalaan', cb: 'Pag-liaison sa Gobyerno', bodyEn: "We advocate for farmers' rights and navigate DA, PCIC, and government support programs on your behalf.", bodyTl: 'Nagtataguyod kami ng mga karapatan ng magsasaka at tumutulong sa mga programa ng gobyerno.', bodyCb: 'Nagtuyo kami sa mga katungod sa mag-uuma ug nagtabang sa mga programa sa gobyerno.' },
    { icon: Handshake,    color: '#b5830a', bg: '#fde9a0', en: 'Community Network', tl: 'Network ng Komunidad', cb: 'Network sa Komunidad', bodyEn: 'Build lasting relationships and share knowledge with 100+ farmers across the archipelago.', bodyTl: 'Bumuo ng matibay na ugnayan at magbahagi ng kaalaman sa 100+ magsasaka.', bodyCb: 'Pagtukod ug matibay nga relasyon ug pagpaambit sa kahibalo sa 100+ ka mag-uuma.' },
  ];
</script>


<svelte:head>
  <title>Unlad Saka – Philippine Farm Association</title>
  <meta name="description" content="Unlad Saka unites Filipino farmers through knowledge, market access, and community. Join thousands of farmers advancing Philippine agriculture." />
</svelte:head>



<!-- ══ HERO ═══════════════════════════════════════════════════════ -->
<section class="relative min-h-screen flex items-center justify-center overflow-hidden">
  
  <!-- Background Video -->
  <div class="absolute inset-0 w-full h-full z-0">
    <video autoplay muted loop playsinline class="w-full h-full object-cover">
      <source src="/coco.mp4" type="video/mp4">
      <!-- Fallback background if video doesn't load -->
      <div class="absolute inset-0" style="background:linear-gradient(150deg,var(--color-soil) 0%,var(--color-forest) 40%,var(--color-grove) 100%)"></div>
    </video>
    <!-- Dark overlay for text readability -->
    <div class="absolute inset-0 bg-black/40"></div>
  </div>

  <!-- Animated background elements (moved above video but below content) -->
  <div class="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
    <!-- Large glow -->
    <div class="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full opacity-10"
         style="background:radial-gradient(circle,var(--color-amber),transparent 65%);transform:translate(30%,-20%)"></div>
    <!-- Small glow bottom left -->
    <div class="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10"
         style="background:radial-gradient(circle,var(--color-gold),transparent 70%)"></div>
    <!-- Grid lines -->
    <svg class="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" stroke-width="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>

    <!-- Decorative wheat SVG -->
    <!-- <svg class="absolute bottom-0 right-8 opacity-15 animate-sway" style="width:180px;height:280px;transform-origin:bottom center"
         viewBox="0 0 100 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="50" y1="170" x2="50" y2="20" stroke="#d4a017" stroke-width="2.5"/>
      <ellipse cx="38" cy="80" rx="10" ry="20" fill="#d4a017" transform="rotate(-35,38,80)"/>
      <ellipse cx="35" cy="100" rx="10" ry="20" fill="#d4a017" transform="rotate(-30,35,100)"/>
      <ellipse cx="37" cy="120" rx="10" ry="20" fill="#d4a017" transform="rotate(-25,37,120)"/>
      <ellipse cx="62" cy="80" rx="10" ry="20" fill="#d4a017" transform="rotate(35,62,80)"/>
      <ellipse cx="65" cy="100" rx="10" ry="20" fill="#d4a017" transform="rotate(30,65,100)"/>
      <ellipse cx="63" cy="120" rx="10" ry="20" fill="#d4a017" transform="rotate(25,63,120)"/>
      <ellipse cx="50" cy="22" rx="8" ry="18" fill="#d4a017"/>
    </svg> -->
  </div>

  <!-- Content - Centered -->
  <div class="container relative z-10 text-center pt-32 pb-24">
    <div class="max-w-3xl mx-auto">
      {#if visible}
        <!-- Eyebrow badge -->
        <div in:fly={{ y: -10, duration: 500, delay: 50 }}
             class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full my-6 mx-auto"
             style="background:rgba(212,160,23,0.15);border:1px solid rgba(212,160,23,0.35);color:var(--color-amber);font-size:0.75rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase">
          <Sprout size={13} />
          {t('hero_eyebrow')}
        </div>

        <!-- Headline -->
        <h1 in:fly={{ y: 32, duration: 700, delay: 150, easing: cubicOut }}
            class="font-serif font-bold mb-6 leading-none"
            style="font-size:clamp(2.75rem,6.5vw,5rem);color:var(--color-cream)">
          {t('hero_title1')}<br />
          <span style="background:linear-gradient(90deg,var(--color-amber),var(--color-wheat));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">
            {t('hero_title2')}
          </span>
        </h1>

        <!-- Subheading -->
        <p in:fly={{ y: 20, duration: 600, delay: 300 }}
           class="text-lg leading-relaxed mb-10 max-w-2xl mx-auto bg-black"
           style="color:rgba(255,255,255,0.72)">
          {t('hero_sub')}
        </p>

        <!-- CTAs -->
        <div in:fly={{ y: 20, duration: 600, delay: 450 }} class="flex flex-wrap gap-4 justify-center">
          <a href="/#register" class="btn btn-gold inline-flex items-center gap-2" style="padding:0.9rem 2rem;font-size:1rem;font-weight:600">
            {t('hero_cta1')} <ArrowRight size={18} />
          </a>
          <a href="/news" class="btn inline-flex items-center gap-2" style="padding:0.9rem 2rem;font-size:1rem;color:white;background:rgba(255,255,255,0.12);border:1.5px solid rgba(255,255,255,0.25)">
            {t('hero_cta2')}
          </a>
        </div>

        <!-- Social proof -->
        <div in:fly={{ y: 20, duration: 600, delay: 600 }} class="flex items-center justify-center gap-4 mt-10">
          <div class="flex -space-x-2">
            {#each ['🧑‍🌾','👩‍🌾','🧑‍🌾','👨‍🌾'] as emoji, i}
              <div class="w-9 h-9 rounded-full border-2 flex items-center justify-center text-base"
                   style="background:var(--color-grove);border-color:var(--color-forest)">{emoji}</div>
            {/each}
          </div>
          <p class="text-sm" style="color:rgba(255,255,255,0.65)">
            <strong style="color:var(--color-amber);font-weight:700">hundreds of farmers</strong> already joined
          </p>
        </div>
      {/if}
    </div>
  </div>


<!-- Scroll Button -->
  <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-float z-10">
  <button 
    on:click={scrollToTarget}
    class="group relative w-12 h-12 rounded-full bg-green-100 dark:bg-green-800 hover:bg-green-200 dark:hover:bg-green-700 transition-all duration-300 flex items-center justify-center cursor-pointer animate-bounce"
    aria-label={t ? `Scroll to ${t}` : label}
  >
    <ChevronDown size={24} class="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
    
    <!-- Subtle ring animation -->
    <span class="absolute inset-0 rounded-full animate-ping bg-gray-400/20 dark:bg-gray-600/20 opacity-75"></span>
  </button>
</div>

</section>




<!-- ══ STATS BANNER ═══════════════════════════════════════════════ -->
<!-- <section bind:this={statsRef}
         style="background:var(--color-forest);border-bottom:3px solid var(--color-gold)">
  <div class="container">
    <div class="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
      {#each stats as stat, i}
        <div class="text-center py-8 px-4">
          {#if statsVisible}
            <div in:fly={{ y: 20, duration: 500, delay: i * 100 }}
                 class="text-3xl md:text-4xl font-serif font-bold mb-1"
                 style="color:var(--color-amber)">{stat.value}</div>
            <div in:fade={{ duration: 400, delay: i * 100 + 200 }}
                 class="text-xs uppercase tracking-wide"
                 style="color:var(--color-mint);opacity:0.8">{t(stat.key)}</div>
          {:else}
            <div class="text-3xl md:text-4xl font-serif font-bold mb-1 opacity-0">{stat.value}</div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</section> -->

<!-- ══ WHY JOIN ═══════════════════════════════════════════════════ -->
<section class="section" style="background:var(--color-cream)">
  <div class="container">
    <div class="text-center mb-14">
      <h2 class="font-serif text-4xl md:text-5xl font-bold" style="color:var(--color-forest)">{t('why_title')}</h2>
      <span class="gold-line mx-auto"></span>
      <p class="max-w-xl mx-auto opacity-65 leading-relaxed">{t('why_sub')}</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {#each features as feat, i}
        {@const Icon = feat.icon}
        <div class="card p-7 flex gap-5"
             style="animation:fadeUp 0.6s ease both;animation-delay:{i * 0.12 + 0.05}s">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
               style="background:{feat.bg}">
            <Icon size={24} color={feat.color} />
          </div>
          <div>
            <h3 class="font-serif text-xl font-bold mb-2" style="color:var(--color-forest)">
              {feat[locale as 'en'] ?? feat.en}
            </h3>
            <p class="text-sm leading-relaxed opacity-65">
              {feat[`body${locale.charAt(0).toUpperCase()+locale.slice(1)}` as 'bodyEn'] ?? feat.bodyEn}
            </p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- ══ MISSION BANNER ════════════════════════════════════════════ -->
<section class="section-sm" style="background:var(--color-parchment);border-top:1px solid var(--color-mint);border-bottom:1px solid var(--color-mint)">
  <div class="container max-w-3xl text-center">
    <h2 class="font-serif text-3xl font-bold mb-4" style="color:var(--color-forest)">{t('mission_title')}</h2>
    <p class="text-lg leading-relaxed italic font-serif" style="color:var(--color-bark)">
      "{t('mission_body')}"
    </p>
  </div>
</section>

<!-- ══ REGISTRATION FORM ═════════════════════════════════════════ -->
<section id="register" class="section"
         style="background:linear-gradient(160deg,var(--color-forest) 0%,var(--color-grove) 100%)">
  <div class="container">
    <div class="max-w-2xl mx-auto">
      <div class="text-center mb-10">
        <h2 class="font-serif text-4xl md:text-5xl font-bold mb-3" style="color:var(--color-cream)">{t('reg_title')}</h2>
        <span class="gold-line mx-auto"></span>
        <p class="opacity-75 leading-relaxed" style="color:rgba(255,255,255,0.8)">{t('reg_sub')}</p>
      </div>

      {#if form?.success}
        <div in:scale={{ duration: 500, easing: elasticOut, start: 0.8 }}
             class="card p-10 text-center">
          <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
               style="background:var(--color-sage)">
            <CheckCircle size={40} color="var(--color-grove)" strokeWidth={1.5} />
          </div>
          <h3 class="font-serif text-2xl font-bold mb-2" style="color:var(--color-forest)">{t('reg_ok')}</h3>
          <div class="flex justify-center gap-4 mt-6">
            <a href="https://www.facebook.com/unladsakaph/" target="_blank" rel="noopener noreferrer"
               class="btn btn-outline gap-2"><Facebook size={16} /> Facebook</a>
            <a href="https://www.linkedin.com/company/unladsaka" target="_blank" rel="noopener noreferrer"
               class="btn btn-outline gap-2"><Linkedin size={16} /> LinkedIn</a>
          </div>
        </div>
      {:else}
        <div class="card p-8 md:p-10">        


            <form 
              id="contact-form" 
              method="POST" 
              action="https://pantrypoints.com/api/external"
              on:submit={() => submitting = true}>
              <input type="hidden" name="source" value="Unlad Saka Registration at Root" />
              <input type="hidden" name="lang" value="English" />

              {#if form?.error}
                <div in:fly={{ y: -8, duration: 300 }}
                     class="flex items-center gap-2 mb-6 p-4 rounded-xl text-sm"
                     style="background:#fff0f0;color:#b91c1c;border:1px solid #fecaca">
                  <AlertCircle size={18} /> {form.error}
                </div>
              {/if}


            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input class="hidden" id="source" name="source" type="text" value="Unlad Saka Registration at Root" />

              <!-- Full name (full width) -->
              <div class="md:col-span-2">
                <label class="label" for="fn">{t('lbl_name')} *</label>
                <input class="input" id="fn" name="fullName" type="text" required placeholder="Juan dela Cruz" autocomplete="name" />
              </div>
              <!-- Email -->
              <div>
                <label class="label" for="em">{t('lbl_email')} *</label>
                <input class="input" id="em" name="email" type="email" required
                       placeholder="juan@example.com" autocomplete="email" />
              </div>
              <!-- Phone -->
              <div>
                <label class="label" for="ph">{t('lbl_phone')}</label>
                <input class="input" id="ph" name="phone" type="tel"
                       placeholder="+63 9XX XXX XXXX" autocomplete="tel" />
              </div>
              <!-- Region -->
              <div>
                <label class="label" for="rg">{t('lbl_region')}</label>
                <select class="input" id="rg" name="country">
                  <option value="">{t('lbl_rph')}</option>
                  {#each regions as r}<option value={r}>{r}</option>{/each}
                </select>
              </div>
              <!-- Farm size -->
              <div>
                <label class="label" for="fs">{t('lbl_farm')}</label>
                <input class="input" id="fs" name="age" type="number" min="0" step="0.1"
                       placeholder="0.5" />
              </div>
              <!-- Crops (full width) -->
              <div class="md:col-span-2">
                <label class="label" for="cr">{t('lbl_crops')}</label>
                <input class="input" id="cr" name="subj" type="text"
                       placeholder={t('lbl_cph')} />
              </div>
              <!-- Message (full width) -->
              <div class="md:col-span-2">
                <label class="label" for="mg">{t('lbl_msg')}</label>
                <textarea class="input" id="mg" name="msg" rows="3"
                          placeholder={t('lbl_mph')} style="resize:vertical;min-height:80px"></textarea>
              </div>
            </div>

            <div class="mt-7">
              <button type="submit" disabled={submitting}
                      class="btn btn-gold w-full justify-center"
                      style="padding:1rem;font-size:1.05rem;font-weight:600">
                {#if submitting}
                  <Loader size={18} class="animate-spin" /> {t('reg_doing')}
                {:else}
                  <Sprout size={18} /> {t('reg_btn')}
                {/if}
              </button>
              <p class="text-center text-xs mt-3 opacity-50">{t('reg_priv')}</p>
            </div>
          </form>
        </div>
      {/if}
    </div>
  </div>
</section>

<!-- ══ CTA STRIP ════════════════════════════════════════════════ -->
<!-- <section style="background:var(--color-soil)">
  <div class="container py-20">
    <div class="max-w-3xl mx-auto text-center">
      <p class="text-sm font-medium uppercase tracking-widest mb-4" style="color:var(--color-amber)">✦ Our Mission ✦</p>
      <blockquote class="font-serif font-bold leading-tight mb-8"
                  style="font-size:clamp(1.6rem,4vw,2.8rem);color:var(--color-cream)">
        {#if locale === 'tl'}
          "Isang bansa ng mga magsasakang may dignidad, kaalaman, at kasaganaan."
        {:else if locale === 'cb'}
          "Usa ka nasod sa mga mag-uuma nga adunay dignidad, kahibalo, ug kasarangang kinabuhi."
        {:else}
          "A nation of farmers with dignity, knowledge, and abundance."
        {/if}
      </blockquote>
      <div class="flex flex-wrap justify-center gap-4">
        <a href="/training" class="btn btn-gold" style="padding:0.8rem 2rem">
          {locale === 'tl' ? 'Mga Pagsasanay' : locale === 'cb' ? 'Mga Pagbansay' : 'View Training'}
          <ArrowRight size={16} />
        </a>
        <a href="/news" class="btn"
           style="padding:0.8rem 2rem;color:var(--color-mint);background:rgba(255,255,255,0.08);border:1.5px solid rgba(255,255,255,0.2)">
          {locale === 'tl' ? 'Pinakabagong Balita' : locale === 'cb' ? 'Pinakabag-o nga Balita' : 'Latest News'}
        </a>
      </div>
    </div>
  </div>
</section>
 -->