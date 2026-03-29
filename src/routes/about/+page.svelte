<script lang="ts">
  import { fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { onMount } from 'svelte';
  import {
    Eye, Sprout, Users, Handshake, GraduationCap, Landmark, 
    ShieldCheck, Target, BarChart3, Leaf, TrendingUp,
    Scale, Lightbulb, Heart, Globe, ArrowRight, CheckCircle
  } from 'lucide-svelte';

  let visible = $state(false);
  let statsVisible = $state(false);
  
	let statsRef: HTMLElement | undefined;

onMount(() => {
  setTimeout(() => (visible = true), 80);

  const obs = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        statsVisible = true;
        obs.disconnect();
        break;
      }
    }
  }, { threshold: 0.3 });

  if (statsRef) obs.observe(statsRef);

  return () => obs.disconnect();
});
  // Mission and Vision
  const missionVision = {
    mission: "To empower Filipino farmers and landowners by increasing access to resources, capital, technology, and information, while facilitating collective marketing and purchasing to increase income and efficiency.",
    vision: "A thriving agricultural sector where Filipino farmers are prosperous, empowered, and united, contributing to food security and sustainable rural development."
  };

  // Key Purposes and Functions
  const functions = [
    {
      icon: Handshake,
      title: "Economic Empowerment",
      description: "Reduce input costs through bulk purchasing of seeds and fertilizer. Increase profits through collective marketing and direct sales, cutting out middlemen.",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: GraduationCap,
      title: "Knowledge & Technology Sharing",
      description: "Facilitate training, workshops, and adoption of modern farming technologies, including sustainable farming, environmental protection, and pest control techniques.",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: Landmark,
      title: "Access to Financial Services",
      description: "Connect farmers with credit, loans, and financial services. Form savings and credit cooperatives to support small-scale farmers.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Scale,
      title: "Policy Advocacy",
      description: "Represent farmers' voices at local, regional, and national levels. Advocate for better agricultural policies, subsidies, and fair trade practices.",
      color: "from-purple-500 to-violet-500"
    },
    {
      icon: Heart,
      title: "Networking & Support",
      description: "Offer platforms for farmers to share experiences, build trust, and collaborate. Strengthen their role in the community and help them act as a united group.",
      color: "from-rose-500 to-pink-500"
    },
    {
      icon: ShieldCheck,
      title: "Risk Management",
      description: "Help farmers handle market fluctuations, crop diseases, and natural disasters through collaboration. Manage natural resources like water systems more effectively.",
      color: "from-amber-600 to-orange-600"
    }
  ];

  // Stats
  const stats = [
    { value: "500+", label: "Active Members", icon: Users },
    { value: "25+", label: "Provinces Served", icon: Globe },
    { value: "50+", label: "Training Programs", icon: GraduationCap },
    { value: "₱10M+", label: "Collective Sales", icon: TrendingUp }
  ];

  // Values
  const values = [
    { icon: Leaf, title: "Sustainability", description: "Promoting environmentally responsible farming practices" },
    { icon: Handshake, title: "Unity", description: "Working together as one strong agricultural community" },
    { icon: Lightbulb, title: "Innovation", description: "Embracing modern technology and traditional wisdom" },
    { icon: Target, title: "Empowerment", description: "Building capacity and confidence in every farmer" }
  ];
</script>

<svelte:head>
  <title>Unlad Saka · About Us</title>
  <meta name="description" content="Unlad Saka empowers Filipino farmers and landowners through collective action, knowledge sharing, and sustainable agricultural practices." />
</svelte:head>



<!-- Hero Section -->
<section class="relative min-h-screen flex items-center justify-center overflow-hidden">
<!-- <section class="container pt-20 min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-forest-900 via-grove-800 to-forest-900"> -->
  <div class="absolute py-20 inset-0 bg-black/40 z-0"></div>

	<div class="absolute inset-0 w-full h-full z-0">
    <video autoplay muted loop playsinline class="w-full h-full object-cover">
      <source src="/banana.mp4" type="video/mp4">
      <!-- Fallback background if video doesn't load -->
      <div class="absolute inset-0" style="background:linear-gradient(150deg,var(--color-soil) 0%,var(--color-forest) 40%,var(--color-grove) 100%)"></div>
    </video>
    <!-- Dark overlay for text readability -->
    <div class="absolute inset-0 bg-black/40"></div>
  </div>


  <div class="container relative z-10 text-center py-20">
    <div class="max-w-4xl mx-auto px-4">
      {#if visible}
        <div in:fly={{ y: -10, duration: 500, delay: 50 }}
             class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 mx-auto"
             style="background:rgba(212,160,23,0.15);border:1px solid rgba(212,160,23,0.35);color:#f59e0b;font-size:0.75rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase">
          <Sprout size={13} />
          About UNLADSAKA
        </div>

        <h1 in:fly={{ y: 32, duration: 700, delay: 150, easing: cubicOut }}
            class="font-bold mb-6 leading-tight text-white"
            style="font-size:clamp(2.5rem,6vw,4.5rem)">
          Empowering Filipino Farmers,<br />
          <span class="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
            Growing Together
          </span>
        </h1>

        <p in:fly={{ y: 20, duration: 600, delay: 300 }}
           class="text-lg leading-relaxed mb-10 max-w-2xl mx-auto text-white">
          UNLADSAKA is a unified association of farmers and landowners committed to 
          transforming Philippine agriculture through collective action, shared knowledge, 
          and sustainable practices.
        </p>
      {/if}
    </div>
  </div>
</section>

<!-- Purpose Statement -->
<section class="py-20 bg-white dark:bg-neutral-900 container">
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
    <div class="text-center mb-12">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 bg-amber-50 dark:bg-amber-900/30">
        <Target class="w-4 h-4 text-amber-600" />
        <span class="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Our Purpose</span>
      </div>
      <h2 class="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-6">
        Why We Exist
      </h2>
      <p class="text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
        The purpose of UNLADSAKA Association of Farmers and Land Owners is to empower members 
        by increasing access to resources, capital, technology, and information, while facilitating 
        collective marketing and purchasing to increase income and efficiency. The association 
        promotes sustainable agricultural practices, advocates for better policies, and provides 
        networking opportunities to improve the social and economic well-being of farmers.
      </p>
    </div>
  </div>
</section>

<!-- Mission & Vision -->
<section class="py-20 bg-stone-50 dark:bg-neutral-950 container">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid md:grid-cols-2 gap-8">
      <!-- Mission -->
      <div class="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-lg border border-stone-200 dark:border-neutral-800">
        <div class="w-14 h-14 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-5">
          <Target class="w-7 h-7 text-amber-600" />
        </div>
        <h3 class="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Our Mission</h3>
        <p class="text-neutral-600 dark:text-neutral-300 leading-relaxed">
          {missionVision.mission}
        </p>
      </div>

      <!-- Vision -->
      <div class="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-lg border border-stone-200 dark:border-neutral-800">
        <div class="w-14 h-14 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-5">
          <Eye class="w-7 h-7 text-amber-600" />
        </div>
        <h3 class="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Our Vision</h3>
        <p class="text-neutral-600 dark:text-neutral-300 leading-relaxed">
          {missionVision.vision}
        </p>
      </div>
    </div>
  </div>
</section>

<!-- Key Functions -->
<section class="py-20  bg-white dark:bg-neutral-900 container">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <div class="pt-20 inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 bg-amber-50 dark:bg-amber-900/30">
        <GraduationCap class="w-4 h-4 text-amber-600" />
        <span class="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Core Functions</span>
      </div>
      <h2 class="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
        Key Purposes & Functions
      </h2>
      <p class="text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
        How we serve and empower our farming community
      </p>
    </div>

<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {#each functions as fn, i}
        <div 
          in:fly={{ y: 30, duration: 500, delay: i * 100 }}
          class="group bg-stone-50 dark:bg-neutral-800/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-stone-200 dark:border-neutral-700"
        >
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br {fn.color} flex items-center justify-center mb-4">
            <fn.icon class="w-6 h-6 text-white" />
          </div>
          <h3 class="text-xl font-bold text-neutral-900 dark:text-white mb-3">
            {fn.title}
          </h3>
          <p class="text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {fn.description}
          </p>
        </div>
      {/each}
    </div>
  </div>
</section>


<style>
  :global(.btn-gold) {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    transition: all 0.2s ease;
  }
  :global(.btn-gold:hover) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(245, 158, 11, 0.4);
  }
</style>


