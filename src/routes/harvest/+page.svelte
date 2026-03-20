<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { Sun, CloudRain, Bug, TrendingUp, Calendar, Droplets, ChevronRight } from 'lucide-svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  let locale = $derived((data.locale ?? 'en') as 'en' | 'tl' | 'cb');

  const T: Record<string, Record<string, string>> = {
    title:      { en: 'Harvest Guide',          tl: 'Gabay sa Pag-aani',           cb: 'Giya sa Pag-ani' },
    subtitle:   { en: 'Seasonal insights, planting calendars, and best practices for every Filipino farmer.',
                  tl: 'Mga pananaw sa bawat panahon, kalendaryo ng pagtatanim, at pinakamahusay na mga gawi.',
                  cb: 'Mga panan-aw sa matag panahon, kalendaryo sa pagtanom, ug labing maayo nga mga buhat.' },
    wet:        { en: 'Wet Season (Jun–Oct)',    tl: 'Tag-ulan (Hun–Okt)',          cb: 'Ting-ulan (Hun–Okt)' },
    dry:        { en: 'Dry Season (Nov–May)',    tl: 'Tag-araw (Nob–Mayo)',         cb: 'Ting-init (Nob–Mayo)' },
    best_crops: { en: 'Best Crops This Season',  tl: 'Pinakamainam na Pananim Ngayon', cb: 'Labing Maayo nga mga Tanom Karon' },
    ideal:      { en: 'Ideal',                  tl: 'Mainam',                      cb: 'Maayo' },
    tips_title: { en: 'Planting Tips',           tl: 'Mga Tip sa Pagtatanim',       cb: 'Mga Tip sa Pagtanom' },
    pest_title: { en: 'Pest & Disease Alerts',   tl: 'Babala sa Mga Peste',         cb: 'Pasidaan sa mga Peste' },
    price_title:{ en: 'Market Prices (PHP/kg)',  tl: 'Presyo sa Palengke (PHP/kg)', cb: 'Presyo sa Merkado (PHP/kg)' },
    cal_title:  { en: 'Planting Calendar',       tl: 'Kalendaryo ng Pagtatanim',    cb: 'Kalendaryo sa Pagtanom' },
    cal_plant:  { en: 'Planting period',         tl: 'Panahon ng Pagtatanim',       cb: 'Panahon sa Pagtanom' },
    months:     { en: 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec',
                  tl: 'Ene,Peb,Mar,Abr,Mayo,Hun,Hul,Ago,Set,Okt,Nob,Dis',
                  cb: 'Ene,Peb,Mar,Abr,Mayo,Hun,Hul,Ago,Set,Okt,Nob,Dis' },
    high:       { en: 'High', tl: 'Mataas', cb: 'Taas' },
    medium:     { en: 'Medium', tl: 'Katamtaman', cb: 'Kasarangan' },
    updated:    { en: 'Prices updated weekly. Source: DA-PFVSC.',
                  tl: 'Ina-update ang mga presyo linggu-linggo. Pinagkunan: DA-PFVSC.',
                  cb: 'Gi-update ang mga presyo matag semana. Tinubdan: DA-PFVSC.' },
  };
  const t = (k: string) => T[k]?.[locale] ?? T[k]?.en ?? k;

  let visible = $state(false);
  let activeTab = $state('wet');

  onMount(() => setTimeout(() => (visible = true), 80));

  const wetCrops  = [
    { name: { en:'Palay / Rice',          tl:'Palay',           cb:'Humay'       }, emoji:'🌾', ideal:true  },
    { name: { en:'Mais / Corn',           tl:'Mais',            cb:'Mais'        }, emoji:'🌽', ideal:true  },
    { name: { en:'Kamote / Sweet Potato', tl:'Kamote',          cb:'Kamote'      }, emoji:'🍠', ideal:false },
    { name: { en:'Pechay / Bok Choy',     tl:'Pechay',          cb:'Pechay'      }, emoji:'🥬', ideal:false },
    { name: { en:'Sitaw / String Bean',   tl:'Sitaw',           cb:'Sitao'       }, emoji:'🫘', ideal:true  },
    { name: { en:'Ampalaya / Bittergourd',tl:'Ampalaya',        cb:'Ampalaya'    }, emoji:'🥒', ideal:false },
  ];
  const dryCrops = [
    { name: { en:'Sibuyas / Onion',       tl:'Sibuyas',         cb:'Sibuyas'     }, emoji:'🧅', ideal:true  },
    { name: { en:'Bawang / Garlic',       tl:'Bawang',          cb:'Bawang'      }, emoji:'🧄', ideal:true  },
    { name: { en:'Kamatis / Tomato',      tl:'Kamatis',         cb:'Kamatis'     }, emoji:'🍅', ideal:true  },
    { name: { en:'Sigarilyas',            tl:'Sigarilyas',      cb:'Sigarilyas'  }, emoji:'🌿', ideal:false },
    { name: { en:'Saging / Banana',       tl:'Saging',          cb:'Saging'      }, emoji:'🍌', ideal:false },
    { name: { en:'Melon / Watermelon',    tl:'Melon',           cb:'Melon'       }, emoji:'🍈', ideal:true  },
  ];

  const tips = [
    { en:'Test soil pH before planting — ideal range is 6.0–7.0 for most crops.',
      tl:'Suriin ang pH ng lupa bago magtanim — ang mainam na saklaw ay 6.0–7.0.',
      cb:'Sulayan ang pH sa yuta sa wala pa magtanom — ang pinakamaayo nga range mao ang 6.0–7.0.' },
    { en:'Use PhilRice-certified seeds for 15–20% better yield versus commercial varieties.',
      tl:'Gumamit ng PhilRice-certified na binhi para sa 15–20% na mas mataas na ani.',
      cb:'Gamit ug PhilRice-certified seeds para sa 15–20% nga mas taas nga ani.' },
    { en:'Apply organic compost or vermicast (2–3 t/ha) to improve soil structure and water retention.',
      tl:'Mag-apply ng organic compost o vermicast (2–3 t/ha) upang mapabuti ang lupa.',
      cb:'Iapply ang organic compost o vermicast (2–3 t/ha) aron maayo ang yuta.' },
    { en:'Practice crop rotation every season to prevent nutrient depletion and pest buildup.',
      tl:'Mag-rotate ng mga pananim tuwing panahon upang maiwasan ang pagkaubos ng sustansya.',
      cb:'Mag-rotate sa mga tanom matag panahon aron mapugngan ang pagminus sa sustansya.' },
    { en:'Use AWD (Alternate Wetting and Drying) for rice — saves 30% water without yield loss.',
      tl:'Gamitin ang AWD para sa palay — nakakatipid ng 30% tubig nang walang pagkawala ng ani.',
      cb:'Gamit ug AWD alang sa humay — nakatipig ug 30% tubig nga walay pagkawala sa ani.' },
  ];

  const pests = [
    { name:'Rice Blast (Tungro)', level:'high',
      en:'Monitor closely in wet season. Apply recommended fungicide at tillering stage. Remove infected plants immediately.',
      tl:'Bantayan nang mabuti sa tag-ulan. Mag-apply ng fungicide sa tamang oras. Alisin agad ang mga nahawaang halaman.',
      cb:'Bantayan pag ting-ulan. Iapply ang fungicide sa hustong oras. Kuhaa dayon ang mga nataptan nga tanom.' },
    { name:'Brown Planthopper', level:'high',
      en:'Use light traps at night. Spray chlorpyrifos or imidacloprid. Avoid over-application of nitrogen.',
      tl:'Gumamit ng light traps sa gabi. Mag-spray ng chlorpyrifos. Iwasang labis na nitrogen.',
      cb:'Gamit ug light traps sa gabii. I-spray ang chlorpyrifos. Likayi ang labis nga nitrogen.' },
    { name:'Aphids (Dalipawen)', level:'medium',
      en:'Spray neem oil solution (5ml/L) weekly on vegetable crops. Introduce beneficial insects.',
      tl:'Mag-spray ng neem oil solusyon (5ml/L) linggu-linggo sa mga gulay.',
      cb:'I-spray ang neem oil solusyon (5ml/L) matag semana sa mga utan.' },
    { name:'Stem Borer', level:'medium',
      en:'Release Trichogramma biological controls at 5–7 days after transplanting. Collect egg masses.',
      tl:'Mag-release ng Trichogramma biological controls 5–7 araw pagkatapos ng transplanting.',
      cb:'Mag-release ug Trichogramma biological controls 5–7 ka adlaw human sa transplanting.' },
  ];

  const prices = [
    { crop:'Palay (Rice)',     min:22, max:28, trend:'up'     },
    { crop:'Mais (Corn)',      min:18, max:22, trend:'stable' },
    { crop:'Kamatis (Tomato)', min:35, max:55, trend:'down'   },
    { crop:'Sibuyas (Onion)',  min:80, max:120,trend:'up'     },
    { crop:'Saging (Banana)',  min:20, max:30, trend:'stable' },
    { crop:'Sitaw',            min:50, max:80, trend:'up'     },
    { crop:'Pechay',           min:25, max:40, trend:'stable' },
    { crop:'Kamote',           min:22, max:35, trend:'down'   },
  ];

  const calendarData = [
    { crop:'🌾 Palay/Rice',       months:[0,1,5,6,7,8],    color:'var(--color-grove)' },
    { crop:'🌽 Mais/Corn',        months:[2,3,4,9,10,11],  color:'var(--color-harvest)' },
    { crop:'🧅 Sibuyas/Onion',    months:[9,10,11,0,1],    color:'var(--color-amber)' },
    { crop:'🍅 Kamatis/Tomato',   months:[1,2,3,9,10],     color:'#e53e3e' },
    { crop:'🥬 Gulay/Vegetables', months:[0,1,2,3,10,11],  color:'var(--color-fern)' },
    { crop:'🍌 Saging/Banana',    months:[0,1,2,3,4,5,6,7,8,9,10,11], color:'#d4a017' },
  ];

  let monthNames = $derived(t('months').split(','));
</script>

<svelte:head>
  <title>Harvest Guide – Unlad Saka</title>
  <meta name="description" content="Seasonal planting guide, pest alerts, and market prices for Filipino farmers." />
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

      <!-- Season toggle -->
      <div class="flex justify-center gap-3 mb-12">
        <button onclick={() => activeTab = 'wet'}
                class="btn gap-2.5 transition-all"
                style="padding:0.75rem 1.75rem;font-size:0.95rem;
                       background:{activeTab==='wet'?'var(--color-grove)':'transparent'};
                       color:{activeTab==='wet'?'white':'var(--color-grove)'};
                       border:2px solid var(--color-grove)">
          <CloudRain size={18} /> {t('wet')}
        </button>
        <button onclick={() => activeTab = 'dry'}
                class="btn gap-2.5 transition-all"
                style="padding:0.75rem 1.75rem;font-size:0.95rem;
                       background:{activeTab==='dry'?'var(--color-harvest)':'transparent'};
                       color:{activeTab==='dry'?'white':'var(--color-harvest)'};
                       border:2px solid var(--color-harvest)">
          <Sun size={18} /> {t('dry')}
        </button>
      </div>

      <!-- Crops grid -->
      {#key activeTab}
        <div in:fade={{ duration: 250 }}>
          <h2 class="font-serif text-2xl font-bold mb-6 text-center" style="color:var(--color-forest)">{t('best_crops')}</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-16">
            {#each (activeTab === 'wet' ? wetCrops : dryCrops) as crop, i}
              <div class="card p-5 text-center"
                   style="animation:fadeUp 0.45s ease both;animation-delay:{i*0.06}s;
                          {crop.ideal ? 'border-color:var(--color-amber);box-shadow:0 4px 16px rgba(212,160,23,0.15)' : ''}">
                <div class="text-4xl mb-2">{crop.emoji}</div>
                <div class="text-xs font-semibold leading-snug" style="color:var(--color-forest)">
                  {crop.name[locale as 'en'] ?? crop.name.en}
                </div>
                {#if crop.ideal}
                  <span class="inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-semibold"
                        style="background:var(--color-flax);color:var(--color-harvest)">
                    ★ {t('ideal')}
                  </span>
                {/if}
              </div>
            {/each}
          </div>
        </div>
      {/key}

      <!-- Tips + Pests -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
        <!-- Tips -->
        <div class="card p-7">
          <h3 class="font-serif text-xl font-bold mb-6 flex items-center gap-2" style="color:var(--color-forest)">
            <Droplets size={20} color="var(--color-grove)" /> {t('tips_title')}
          </h3>
          <ol class="space-y-4">
            {#each tips as tip, i}
              <li class="flex gap-3 text-sm"
                  style="animation:fadeUp 0.5s ease both;animation-delay:{i*0.08}s">
                <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                      style="background:var(--color-sage);color:var(--color-grove)">{i+1}</span>
                <span class="leading-relaxed opacity-75">{tip[locale as 'en'] ?? tip.en}</span>
              </li>
            {/each}
          </ol>
        </div>

        <!-- Pest alerts -->
        <div class="card p-7">
          <h3 class="font-serif text-xl font-bold mb-6 flex items-center gap-2" style="color:var(--color-forest)">
            <Bug size={20} color="var(--color-harvest)" /> {t('pest_title')}
          </h3>
          <div class="space-y-4">
            {#each pests as pest, i}
              <div class="p-4 rounded-xl"
                   style="animation:fadeUp 0.5s ease both;animation-delay:{i*0.1}s;
                          background:{pest.level==='high'?'#fffbeb':'#f0fdf4'};
                          border:1px solid {pest.level==='high'?'#fde68a':'#bbf7d0'}">
                <div class="flex items-center gap-2 mb-1.5">
                  <span class="w-2 h-2 rounded-full flex-shrink-0"
                        style="background:{pest.level==='high'?'#d97706':'#16a34a'}"></span>
                  <span class="font-semibold text-sm">{pest.name}</span>
                  <span class="ml-auto px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
                        style="background:{pest.level==='high'?'#fef3c7':'#dcfce7'};
                               color:{pest.level==='high'?'#92400e':'#14532d'}">
                    {t(pest.level)}
                  </span>
                </div>
                <p class="text-xs opacity-70 ml-4 leading-relaxed">{pest[locale as 'en'] ?? pest.en}</p>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <!-- Market prices -->
      <div class="card p-7 mb-14">
        <h3 class="font-serif text-xl font-bold mb-2 flex items-center gap-2" style="color:var(--color-forest)">
          <TrendingUp size={20} color="var(--color-grove)" /> {t('price_title')}
        </h3>
        <p class="text-xs opacity-50 mb-6">{t('updated')}</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {#each prices as row, i}
            <div class="flex items-center justify-between px-4 py-3 rounded-xl"
                 style="animation:fadeUp 0.4s ease both;animation-delay:{i*0.05}s;
                        background:{i%2===0?'var(--color-sage)':'var(--color-parchment)'}">
              <span class="font-medium text-sm" style="color:var(--color-forest)">{row.crop}</span>
              <div class="flex items-center gap-3">
                <span class="font-bold" style="color:var(--color-harvest)">₱{row.min}–{row.max}</span>
                <span class="text-base" title={row.trend}
                      style="color:{row.trend==='up'?'#16a34a':row.trend==='down'?'#dc2626':'#6b7280'}">
                  {row.trend==='up'?'↑':row.trend==='down'?'↓':'→'}
                </span>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Planting Calendar -->
      <div class="card p-7">
        <h3 class="font-serif text-xl font-bold mb-2 flex items-center gap-2" style="color:var(--color-forest)">
          <Calendar size={20} color="var(--color-grove)" /> {t('cal_title')}
        </h3>
        <div class="flex items-center gap-3 mb-6 text-xs opacity-50">
          <span class="w-4 h-4 rounded-sm inline-block" style="background:var(--color-grove)"></span>
          {t('cal_plant')}
        </div>
        <div class="overflow-x-auto -mx-2 px-2">
          <table class="w-full" style="min-width:600px">
            <thead>
              <tr>
                <th class="text-left py-2 pr-6 text-xs font-semibold opacity-50 whitespace-nowrap w-36">Crop</th>
                {#each monthNames as m, mi}
                  <th class="text-center py-2 px-0.5 text-xs font-medium opacity-50 w-9"
                      style="color:{[5,6,7,8,9].includes(mi)?'var(--color-grove)':'var(--color-harvest)'}">{m}</th>
                {/each}
              </tr>
            </thead>
            <tbody>
              {#each calendarData as row, ri}
                <tr class="{ri>0?'border-t':''}" style="border-color:var(--color-sage)">
                  <td class="py-2.5 pr-4 text-sm font-medium whitespace-nowrap" style="color:var(--color-forest)">{row.crop}</td>
                  {#each {length:12} as _, mi}
                    <td class="py-2.5 px-0.5 text-center">
                      {#if row.months.includes(mi)}
                        <span class="w-7 h-7 rounded flex items-center justify-center mx-auto text-white text-xs font-bold"
                              style="background:{row.color}">✓</span>
                      {:else}
                        <span class="w-7 h-7 rounded flex items-center justify-center mx-auto"
                              style="background:var(--color-parchment)"></span>
                      {/if}
                    </td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</div>
