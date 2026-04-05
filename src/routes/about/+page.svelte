<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { onMount } from 'svelte';
  import {
    Eye, Sprout, Users, Handshake, GraduationCap, Landmark, 
    ShieldCheck, Target, Globe, Leaf, TrendingUp,
    Scale, Lightbulb, Heart
  } from 'lucide-svelte';
  import type { PageData } from './$types';

  // Svelte 5 Props
  let { data }: { data: PageData } = $props();

  // Handle Locales Reactively
  let locale = $derived((data.locale ?? 'en') as 'en' | 'tl' | 'cb');

  // Translation Dictionary
  const content = {
    en: {
      meta_title: "Unlad Saka · About Us",
      meta_desc: "Unlad Saka empowers Filipino farmers and landowners through collective action, knowledge sharing, and sustainable agricultural practices.",
      hero_badge: "About UNLADSAKA",
      hero_title_1: "Empowering Filipino Farmers,",
      hero_title_2: "Growing Together",
      hero_desc: "UNLADSAKA is a unified association of farmers and landowners committed to transforming Philippine agriculture through collective action, shared knowledge, and sustainable practices.",
      purpose_badge: "Our Purpose",
      purpose_title: "Why We Exist",
      purpose_desc: "The purpose of UNLADSAKA Association of Farmers and Land Owners is to empower members by increasing access to resources, capital, technology, and information, while facilitating collective marketing and purchasing to increase income and efficiency.",
      mission_title: "Our Mission",
      mission_text: "To empower Filipino farmers and landowners by increasing access to resources, capital, technology, and information, while facilitating collective marketing and purchasing to increase income and efficiency.",
      vision_title: "Our Vision",
      vision_text: "A thriving agricultural sector where Filipino farmers are prosperous, empowered, and united, contributing to food security and sustainable rural development.",
      functions_badge: "Core Functions",
      functions_title: "Key Purposes & Functions",
      functions_desc: "How we serve and empower our farming community",
      // Function Titles & Descriptions
      f1_t: "Economic Empowerment", 
      f1_d: "Reduce input costs through bulk purchasing of seeds and fertilizer. Increase profits through collective marketing and direct sales.",
      f2_t: "Knowledge & Technology", 
      f2_d: "Facilitate training, workshops, and adoption of modern farming technologies, including sustainable farming and pest control.",
      f3_t: "Financial Services", 
      f3_d: "Connect farmers with credit, loans, and financial services. Form savings and credit cooperatives to support small-scale farmers.",
      f4_t: "Policy Advocacy", 
      f4_d: "Represent farmers' voices at local and national levels. Advocate for better agricultural policies, subsidies, and fair trade.",
      f5_t: "Networking & Support", 
      f5_d: "Offer platforms for farmers to share experiences, build trust, and collaborate. Strengthen their role as a united community group.",
      f6_t: "Risk Management", 
      f6_d: "Help farmers handle market fluctuations, crop diseases, and natural disasters through collaboration and effective resource management."
    },
    tl: {
      meta_title: "Unlad Saka · Tungkol sa Amin",
      meta_desc: "Binibigyang-lakas ng Unlad Saka ang mga magsasakang Pilipino sa pamamagitan ng kolektibong pagkilos at makabagong teknolohiya.",
      hero_badge: "Tungkol sa UNLADSAKA",
      hero_title_1: "Pagpapalakas sa Magsasakang Pilipino,",
      hero_title_2: "Sama-samang Pag-unlad",
      hero_desc: "Ang UNLADSAKA ay isang nagkakaisang samahan ng mga magsasaka at may-ari ng lupa na nakatuon sa pagbabago ng agrikultura sa Pilipinas.",
      purpose_badge: "Aming Layunin",
      purpose_title: "Bakit Kami Narito",
      purpose_desc: "Ang layunin ng UNLADSAKA ay bigyang-kapangyarihan ang mga miyembro sa pamamagitan ng pagpapalawak ng access sa teknolohiya, kapital, at impormasyon.",
      mission_title: "Aming Misyon",
      mission_text: "Palakasin ang kakayahan ng mga magsasaka at may-ari ng lupa sa pamamagitan ng pagbibigay ng sapat na resources at kolektibong pamimili.",
      vision_title: "Aming Pananaw",
      vision_text: "Isang maunlad na sektor ng agrikultura kung saan ang mga magsasaka ay masagana, may kapangyarihan, at nagkakaisa.",
      functions_badge: "Pangunahing Tungkulin",
      functions_title: "Mga Layunin at Gawain",
      functions_desc: "Paano namin pinaglilingkuran ang komunidad ng pagsasaka",
      f1_t: "Pagpapalakas ng Ekonomiya", f1_d: "Bawasan ang gastos sa pagsasaka sa pamamagitan ng maramihang pagbili ng binhi at pataba.",
      f2_t: "Kaalaman at Teknolohiya", f2_d: "Pagsasagawa ng mga workshop at pagtuturo ng mga makabagong paraan ng pagsasaka.",
      f3_t: "Serbisyong Pinansyal", f3_d: "Iugnay ang mga magsasaka sa mga pautang at serbisyong kooperatiba.",
      f4_t: "Adbokasiya sa Polisiya", f4_d: "Maging boses ng mga magsasaka sa pamahalaan para sa mas magandang batas sa agrikultura.",
      f5_t: "Networking at Suporta", f5_d: "Magbigay ng plataporma para sa pagbabahagi ng karanasan at pagtutulungan.",
      f6_t: "Pamamahala ng Risko", f6_d: "Tulungan ang mga magsasaka na harapin ang mga sakuna at pagbabago ng presyo sa merkado."
    },
    cb: {
      /* Add Cebuano translations here following the same keys */
      meta_title: "Unlad Saka · Mahitungod Kanamo",
      hero_badge: "Mahitungod sa UNLADSAKA",
      hero_title_1: "Paglig-on sa mga Mag-uumang Pilipino,",
      hero_title_2: "Dungan nga Pag-uswag",
      hero_desc: "Ang UNLADSAKA usa ka hiniusang asosasyon sa mga mag-uuma ug tag-iya sa yuta nga naningkamot nga mabag-o ang agrikultura sa Pilipinas pinaagi sa kolektibong lihok, gipaambit nga kahibalo, ug malungtarong pamaagi.",
      purpose_badge: "Among Katuyoan",
      purpose_title: "Nganong Kami Naglungtad",
      purpose_desc: "Ang katuyoan sa UNLADSAKA Association of Farmers and Land Owners mao ang paghatag ug gahom sa mga miyembro pinaagi sa pagpadali sa pag-access sa mga kahinguhaan, kapital, teknolohiya, ug impormasyon, samtang gipadali ang kolektibong pagpamaligya ug pagpalit aron madugangan ang kita ug kaepektibo.",
      mission_title: "Among Misyon",
      mission_text: "Ang paghatag ug gahom sa mga mag-uuma ug tag-iya sa yuta sa Pilipinas pinaagi sa pagpadali sa pag-access sa mga kahinguhaan, kapital, teknolohiya, ug impormasyon, samtang gipadali ang kolektibong pagpamaligya ug pagpalit aron madugangan ang kita ug kaepektibo.",
      vision_title: "Among Bisyon",
      vision_text: "Usa ka nag-uswag nga sektor sa agrikultura diin ang mga mag-uuma sa Pilipinas malambo, gipagahom, ug nahiusa, nga nakatampo sa seguridad sa pagkaon ug malungtarong paglambo sa kabaryohan.",
      functions_badge: "Pangunang mga Kalihokan",
      functions_title: "Pangunang mga Katuyoan ug Kalihokan",
      functions_desc: "Kon unsaon namo pag-alagad ug paghatag ug gahom sa among komunidad sa mga mag-uuma",
      // Function Titles & Descriptions
      f1_t: "Paghatag ug Gahom sa Ekonomiya",
      f1_d: "Pagpakunhod sa gasto sa mga kinahanglanon pinaagi sa dinagkong pagpalit sa mga liso ug abono. Pagpadako sa kita pinaagi sa kolektibong pagpamaligya ug direktang pagbaligya.",
      f2_t: "Kahibalo ug Teknolohiya",
      f2_d: "Pagpahigayon sa mga pagbansay, workshop, ug pagsagop sa modernong teknolohiya sa pag-uma, lakip na ang malungtarong pag-uma ug pagkontrol sa peste.",
      f3_t: "Mga Serbisyong Pinansyal",
      f3_d: "Pagdugtong sa mga mag-uuma sa kredito, utang, ug mga serbisyong pinansyal. Pagporma ug mga kooperatiba sa pagtipig ug kredito aron pagsuporta sa gagmay nga mga mag-uuma.",
      f4_t: "Pagpasiugda sa Polisiya",
      f4_d: "Pagrepresentar sa mga tingog sa mga mag-uuma sa lokal ug nasyonal nga lebel. Pagpasiugda alang sa mas maayong mga polisiya sa agrikultura, subsidiya, ug patas nga pamatigayon.",
      f5_t: "Pagdugtong ug Suporta",
      f5_d: "Paghatag ug mga plataporma alang sa mga mag-uuma aron makapaambit sa mga kasinatian, makapalig-on sa pagsalig, ug makigtambayayong. Pagpalig-on sa ilang tahop isip usa ka nahiusang komunidad.",
      f6_t: "Pagdumala sa Risgo",
      f6_d: "Pagtabang sa mga mag-uuma sa pag-atubang sa mga pagbag-o sa merkado, mga sakit sa tanom, ug mga kalamidad pinaagi sa pagtinabangay ug episyenteng pagdumala sa kahinguhaan."
    }
  };

  // Translation Helper Function
  function t(key: keyof typeof content['en']) {
    return content[locale][key] || content['en'][key];
  }

  // Derived functions array to update titles/descriptions automatically on locale change
  const functions = $derived([
    { icon: Handshake, title: t('f1_t'), description: t('f1_d'), color: "from-amber-500 to-orange-500" },
    { icon: GraduationCap, title: t('f2_t'), description: t('f2_d'), color: "from-emerald-500 to-teal-500" },
    { icon: Landmark, title: t('f3_t'), description: t('f3_d'), color: "from-blue-500 to-cyan-500" },
    { icon: Scale, title: t('f4_t'), description: t('f4_d'), color: "from-purple-500 to-violet-500" },
    { icon: Heart, title: t('f5_t'), description: t('f5_d'), color: "from-rose-500 to-pink-500" },
    { icon: ShieldCheck, title: t('f6_t'), description: t('f6_d'), color: "from-amber-600 to-orange-600" }
  ]);

  // Animations logic
  let visible = $state(false);
  let statsVisible = $state(false);
  let statsRef: HTMLElement | undefined;

  onMount(() => {
    setTimeout(() => (visible = true), 80);

    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        statsVisible = true;
        obs.disconnect();
      }
    }, { threshold: 0.2 });

    if (statsRef) obs.observe(statsRef);
    return () => obs.disconnect();
  });
</script>

<svelte:head>
  <title>{t('meta_title')}</title>
  <meta name="description" content={t('meta_desc')} />
</svelte:head>

<section class="relative min-h-screen flex items-center justify-center overflow-hidden">
  <div class="absolute inset-0 w-full h-full z-0">
    <video autoplay muted loop playsinline class="w-full h-full object-cover">
      <source src="/banana.mp4" type="video/mp4">
      <div class="absolute inset-0" style="background:linear-gradient(150deg,var(--color-soil) 0%,var(--color-forest) 40%,var(--color-grove) 100%)"></div>
    </video>
    <div class="absolute inset-0 bg-black/50"></div>
  </div>

  <div class="container relative z-10 text-center py-20">
    <div class="max-w-4xl mx-auto px-4">
      {#if visible}
        <div in:fly={{ y: -10, duration: 500 }}
             class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 mx-auto bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold tracking-widest uppercase">
          <Sprout size={13} />
          {t('hero_badge')}
        </div>

        <h1 in:fly={{ y: 32, duration: 700, delay: 150, easing: cubicOut }}
            class="font-bold mb-6 leading-tight text-white text-4xl md:text-6xl lg:text-7xl">
          {t('hero_title_1')}<br />
          <span class="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
            {t('hero_title_2')}
          </span>
        </h1>

        <p in:fly={{ y: 20, duration: 600, delay: 300 }}
           class="text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto text-white/90">
          {t('hero_desc')}
        </p>
      {/if}
    </div>
  </div>
</section>

<section class="py-24 bg-white dark:bg-neutral-900 overflow-hidden">
  <div class="container max-w-5xl mx-auto px-4">
    <div class="text-center">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 bg-amber-50 dark:bg-amber-900/30">
        <Target class="w-4 h-4 text-amber-600" />
        <span class="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
          {t('purpose_badge')}
        </span>
      </div>
      <h2 class="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-6">
        {t('purpose_title')}
      </h2>
      <p class="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-4xl mx-auto">
        {t('purpose_desc')}
      </p>
    </div>
  </div>
</section>

<section class="py-20 bg-stone-50 dark:bg-neutral-950">
  <div class="container max-w-6xl mx-auto px-4">
    <div class="grid md:grid-cols-2 gap-8">
      <div class="bg-white dark:bg-neutral-900 rounded-2xl p-10 shadow-sm border border-stone-200 dark:border-neutral-800 transition-transform hover:-translate-y-1">
        <div class="w-14 h-14 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6">
          <Target class="w-7 h-7 text-amber-600" />
        </div>
        <h3 class="text-2xl font-bold text-neutral-900 dark:text-white mb-4">{t('mission_title')}</h3>
        <p class="text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {t('mission_text')}
        </p>
      </div>

      <div class="bg-white dark:bg-neutral-900 rounded-2xl p-10 shadow-sm border border-stone-200 dark:border-neutral-800 transition-transform hover:-translate-y-1">
        <div class="w-14 h-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
          <Eye class="w-7 h-7 text-emerald-600" />
        </div>
        <h3 class="text-2xl font-bold text-neutral-900 dark:text-white mb-4">{t('vision_title')}</h3>
        <p class="text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {t('vision_text')}
        </p>
      </div>
    </div>
  </div>
</section>

<section class="py-24 bg-white dark:bg-neutral-900" bind:this={statsRef}>
  <div class="container max-w-7xl mx-auto px-4">
    <div class="text-center mb-16">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 bg-emerald-50 dark:bg-emerald-900/30">
        <GraduationCap class="w-4 h-4 text-emerald-600" />
        <span class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          {t('functions_badge')}
        </span>
      </div>
      <h2 class="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
        {t('functions_title')}
      </h2>
      <p class="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
        {t('functions_desc')}
      </p>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each functions as fn, i}
        <div in:fly={{ y: 20, duration: 400, delay: i * 80 }}
             class="group bg-stone-50 dark:bg-neutral-800/50 p-8 rounded-2xl border border-stone-200 dark:border-neutral-700 hover:shadow-xl hover:bg-white dark:hover:bg-neutral-800 transition-all duration-300">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br {fn.color} flex items-center justify-center mb-6 shadow-md">
            <fn.icon class="w-6 h-6 text-white" />
          </div>
          <h3 class="text-xl font-bold text-neutral-900 dark:text-white mb-3 group-hover:text-amber-600 transition-colors">
            {fn.title}
          </h3>
          <p class="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
            {fn.description}
          </p>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  /* Base transitions and custom scroll settings can go here */
  :global(html) {
    scroll-behavior: smooth;
  }
</style>
