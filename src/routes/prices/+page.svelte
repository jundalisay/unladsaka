<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { TrendingUp, Calendar, Droplets, Truck, ChartLine, Table2, Leaf, Coffee } from 'lucide-svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  let locale = $derived((data.locale ?? 'en') as 'en' | 'tl' | 'cb');

  let visible = $state(false);
  let activeView = $state('chart'); // 'chart' or 'table'
  let activeProduct = $state('all'); // 'all', 'copra', 'nuts', 'buko'

  onMount(() => setTimeout(() => (visible = true), 80));

  // Price dataset with dates (sorted chronologically)
  type PriceEntry = {
    date: string;
    timestamp: number;
    copra: number | null;
    dehusked_nuts: number | null;
    buko: number | null;
  };

  let rawData: PriceEntry[] = [
    { date: 'Dec 22, 2019', timestamp: new Date(2019, 11, 22).getTime(), copra: 30, dehusked_nuts: null, buko: null },
    { date: 'Jan 20, 2020', timestamp: new Date(2020, 0, 20).getTime(), copra: 29, dehusked_nuts: 7, buko: 10 },
    { date: 'Feb 2, 2020', timestamp: new Date(2020, 1, 2).getTime(), copra: 26.5, dehusked_nuts: 7, buko: 10 },
    { date: 'Mar 7, 2020', timestamp: new Date(2020, 2, 7).getTime(), copra: 25, dehusked_nuts: 8.2, buko: null },
    { date: 'Mar 19, 2020', timestamp: new Date(2020, 2, 19).getTime(), copra: 24, dehusked_nuts: 8, buko: null },
    { date: 'Mar 27, 2020', timestamp: new Date(2020, 2, 27).getTime(), copra: 24, dehusked_nuts: 7, buko: null },
    { date: 'Apr 23, 2020', timestamp: new Date(2020, 3, 23).getTime(), copra: 25.5, dehusked_nuts: null, buko: null },
    { date: 'Jun 12, 2020', timestamp: new Date(2020, 5, 12).getTime(), copra: 28, dehusked_nuts: 8.1, buko: null },
    { date: 'Oct 14, 2021', timestamp: new Date(2021, 9, 14).getTime(), copra: 46.5, dehusked_nuts: 9.5, buko: null },
    { date: 'Feb 3, 2022', timestamp: new Date(2022, 1, 3).getTime(), copra: 55, dehusked_nuts: null, buko: null },
    { date: 'Nov 7, 2015', timestamp: new Date(2015, 10, 7).getTime(), copra: 30, dehusked_nuts: 8, buko: null },
    { date: 'Nov 10, 2015', timestamp: new Date(2015, 10, 10).getTime(), copra: 30, dehusked_nuts: 10, buko: null },
    { date: 'Nov 26, 2015', timestamp: new Date(2015, 10, 26).getTime(), copra: 31, dehusked_nuts: 9, buko: null }
  ];

  // Sort by date (oldest first for proper line connection)
  let priceData = $derived([...rawData].sort((a, b) => a.timestamp - b.timestamp));

  // Get min/max values for chart scaling (excluding nulls)
  let allValues = $derived(priceData.flatMap(d => [d.copra, d.dehusked_nuts, d.buko].filter(v => v !== null) as number[]));
  let maxPrice = $derived(Math.max(...allValues, 60));
  let minPrice = $derived(Math.min(...allValues, 20));
  let priceRange = $derived(maxPrice - minPrice);

  // Filter data based on active product for table
  let filteredTableData = $derived(
    priceData.filter(d => 
      (activeProduct === 'all' || activeProduct === 'copra' && d.copra !== null ||
       activeProduct === 'nuts' && d.dehusked_nuts !== null ||
       activeProduct === 'buko' && d.buko !== null)
    ).map(d => ({
      date: d.date,
      copra: d.copra !== null ? `₱${d.copra.toFixed(2)}` : '—',
      dehusked_nuts: d.dehusked_nuts !== null ? `₱${d.dehusked_nuts.toFixed(2)}` : '—',
      buko: d.buko !== null ? `₱${d.buko.toFixed(2)}` : '—'
    }))
  );

  // Translation helper
  const t = (key: string): string => {
    const translations: Record<string, Record<'en' | 'tl' | 'cb', string>> = {
      title: { en: 'Copra & Coconut Market', tl: 'Merkado ng Kopra at Niyog', cb: 'Pamilihan sa Kopra ug Niyog' },
      subtitle: { en: 'Historical farmgate prices in Lucena Philippines', tl: 'Makasaysayang mga presyo sa bukid sa Lucena Philippines', cb: 'Mga presyo sa uma sa kasaysayan sa Lucena Philippines' },
      chart: { en: 'Price Trends', tl: 'Trend ng Presyo', cb: 'Uso sa Presyo' },
      table: { en: 'Price Table', tl: 'Talahanayan ng Presyo', cb: 'Lamesa sa Presyo' },
      date: { en: 'Date', tl: 'Petsa', cb: 'Petsa' },
      copra: { en: 'Copra (₱/kg)', tl: 'Kopra (₱/kg)', cb: 'Kopra (₱/kg)' },
      dehusked: { en: 'Dehusked Nuts (₱/pc)', tl: 'Dehusked na Niyog (₱/pc)', cb: 'Dehusked nga Niyog (₱/pc)' },
      buko: { en: 'Young Coconut / Buko (₱/pc)', tl: 'Buko (₱/pc)', cb: 'Buko (₱/pc)' },
      filter_all: { en: 'All Products', tl: 'Lahat ng Produkto', cb: 'Tanang Produkto' },
      filter_copra: { en: 'Copra Only', tl: 'Kopra Lang', cb: 'Kopra Lang' },
      filter_nuts: { en: 'Dehusked Nuts', tl: 'Dehusked na Niyog', cb: 'Dehusked nga Niyog' },
      filter_buko: { en: 'Young Coconut', tl: 'Buko', cb: 'Buko' },
      updated: { en: 'Data from 2015–2022', tl: 'Datos mula 2015–2022', cb: 'Datos gikan 2015–2022' },
      harvest_tips: { en: 'Harvesting Tips', tl: 'Mga Tip sa Pag-aani', cb: 'Mga Tip sa Pag-ani' },
      tip1: { en: 'Harvest mature nuts (11-12 months old) for higher copra yield', tl: 'Anihin ang matandang niyog (11-12 buwan) para mas mataas na ani ng kopra', cb: 'Aniha ang hamtong nga niyog (11-12 ka bulan) para mas taas nga ani sa kopra' },
      tip2: { en: 'Dry copra to 6-8% moisture for best prices', tl: 'Patuyuin ang kopra hanggang 6-8% na kahalumigmigan para sa pinakamagandang presyo', cb: 'Paugaha ang kopra hangtod 6-8% kaumog para sa labing maayong presyo' },
      tip3: { en: 'Young coconuts (buko) are best harvested at 6-8 months', tl: 'Ang batang niyog (buko) ay pinakamainam anihin sa 6-8 buwan', cb: 'Ang batan-ong niyog (buko) labing maayo anihon sa 6-8 ka bulan' },
      market_outlook: { en: 'Market Outlook', tl: 'Pananaw sa Merkado', cb: 'Panglantaw sa Merkado' },
      outlook_desc: { en: 'Copra prices surged in 2022 due to global coconut oil demand. Dehusked nuts remain steady for local desiccated coconut production.', tl: 'Tumaas ang presyo ng kopra noong 2022 dahil sa pandaigdigang pangangailangan ng langis ng niyog. Ang dehusked nuts ay matatag para sa lokal na produksyon ng desiccated coconut.', cb: 'Mitaas ang presyo sa kopra sa 2022 tungod sa pangkalibutang panginahanglan sa lana sa niyog. Ang dehusked nuts lig-on alang sa lokal nga produksyon sa desiccated coconut.' }
    };
    return translations[key]?.[locale] ?? translations[key]?.['en'] ?? key;
  };

  // Helper to generate SVG points for a product line
  function getLinePoints(product: 'copra' | 'dehusked_nuts' | 'buko', width: number, height: number, leftMargin: number, rightMargin: number) {
    const points: string[] = [];
    const xStep = (width - leftMargin - rightMargin) / (priceData.length - 1);
    
    priceData.forEach((d, idx) => {
      const price = d[product];
      if (price !== null && price !== undefined) {
        const x = leftMargin + (idx * xStep);
        const y = height - ((price - minPrice) / priceRange) * (height - 60) - 30;
        points.push(`${x},${y}`);
      }
    });
    return points.join(' ');
  }

  // Check if product has any data
  const hasCopraData = $derived(priceData.some(d => d.copra !== null));
  const hasNutsData = $derived(priceData.some(d => d.dehusked_nuts !== null));
  const hasBukoData = $derived(priceData.some(d => d.buko !== null));
</script>

<svelte:head>
  <title>Copra & Coconut Prices – Unlad Saka</title>
  <meta name="description" content="Historical farmgate prices for copra, dehusked nuts, and young coconut (buko) from 2015 to 2022." />
</svelte:head>

<div class="pt-20">
  <!-- Hero Header -->
  <section class="py-16" style="background:linear-gradient(135deg, #2d5a3b, #1e3a2f)">
    <div class="container text-center">
      {#if visible}
        <h1 in:fly={{ y: 30, duration: 600 }} class="font-serif text-5xl font-bold mb-4"
            style="color:#fef3c7">{t('title')}</h1>
        <span class="gold-line mx-auto"></span>
        <p in:fly={{ y: 20, duration: 600, delay: 200 }} class="text-lg max-w-xl mx-auto"
           style="color:rgba(254,243,199,0.85)">{t('subtitle')}</p>
      {/if}
    </div>
  </section>

  <div class="section">
    <div class="container">
      <!-- Last Updated Badge -->
      <div class="flex justify-center mb-8">
        <div class="flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-white shadow-sm" style="color:#5a6e4a">
          <Calendar size={16} /> {t('updated')}
        </div>
      </div>

      <!-- View Toggle: Chart / Table -->
      <div class="flex justify-center gap-3 mb-8">
        <button onclick={() => activeView = 'chart'}
                class="btn gap-2.5 transition-all"
                style="padding:0.75rem 1.75rem;font-size:0.95rem;
                       background:{activeView==='chart'?'#2d5a3b':'transparent'};
                       color:{activeView==='chart'?'white':'#2d5a3b'};
                       border:2px solid #2d5a3b">
          <ChartLine size={18} /> {t('chart')}
        </button>
        <button onclick={() => activeView = 'table'}
                class="btn gap-2.5 transition-all"
                style="padding:0.75rem 1.75rem;font-size:0.95rem;
                       background:{activeView==='table'?'#b8860b':'transparent'};
                       color:{activeView==='table'?'white':'#b8860b'};
                       border:2px solid #b8860b">
          <Table2 size={18} /> {t('table')}
        </button>
      </div>

      <!-- Product Filter (for table view) -->
      {#if activeView === 'table'}
        <div class="flex justify-center gap-2 mb-6 flex-wrap">
          <button onclick={() => activeProduct = 'all'}
                  class="text-xs px-3 py-1.5 rounded-full transition-all"
                  style="background:{activeProduct==='all'?'#2d5a3b':'#e8f0e3'}; color:{activeProduct==='all'?'white':'#2d5a3b'}">
            {t('filter_all')}
          </button>
          <button onclick={() => activeProduct = 'copra'}
                  class="text-xs px-3 py-1.5 rounded-full transition-all"
                  style="background:{activeProduct==='copra'?'#2d5a3b':'#e8f0e3'}; color:{activeProduct==='copra'?'white':'#2d5a3b'}">
            {t('filter_copra')}
          </button>
          <button onclick={() => activeProduct = 'nuts'}
                  class="text-xs px-3 py-1.5 rounded-full transition-all"
                  style="background:{activeProduct==='nuts'?'#b8860b':'#e8f0e3'}; color:{activeProduct==='nuts'?'#b8860b':'#2d5a3b'}">
            {t('filter_nuts')}
          </button>
          <button onclick={() => activeProduct = 'buko'}
                  class="text-xs px-3 py-1.5 rounded-full transition-all"
                  style="background:{activeProduct==='buko'?'#d4a017':'#e8f0e3'}; color:{activeProduct==='buko'?'white':'#2d5a3b'}">
            {t('filter_buko')}
          </button>
        </div>
      {/if}

      <!-- Dynamic Content: Chart or Table -->
      {#key activeView}
        <div in:fade={{ duration: 250 }}>
          {#if activeView === 'chart'}
            <!-- Line Chart -->
            <div class="card p-6 mb-12">
              <h3 class="font-serif text-xl font-bold mb-6 flex items-center gap-2" style="color:#2d5a3b">
                <TrendingUp size={20} color="#b8860b" /> {t('chart')}
              </h3>
              <div class="relative overflow-x-auto">
                <div class="min-w-[700px]">
                  <svg viewBox="0 0 900 450" class="w-full h-auto" style="background:#fefcf8; border-radius:1rem;">
                    <!-- Y-axis labels -->
                    {#each [maxPrice, maxPrice - priceRange/2, minPrice] as price}
                      <line x1="50" y1={30 + ((maxPrice - price) / priceRange) * 380} x2="870" y2={30 + ((maxPrice - price) / priceRange) * 380}
                            stroke="#e5e0d5" stroke-width="0.8" stroke-dasharray="4" />
                    {/each}
                    
                    <!-- Y-axis text -->
                    <text x="40" y="35" text-anchor="end" font-size="10" fill="#8b7a5b">₱{maxPrice.toFixed(0)}</text>
                    <text x="40" y="225" text-anchor="end" font-size="10" fill="#8b7a5b">₱{(maxPrice - priceRange/2).toFixed(0)}</text>
                    <text x="40" y="415" text-anchor="end" font-size="10" fill="#8b7a5b">₱{minPrice.toFixed(0)}</text>
                    
                    <!-- X-axis labels (dates) -->
                    {#each priceData as entry, idx}
                      <text x={60 + (idx * (810 / (priceData.length - 1)))} y="435" text-anchor="middle" font-size="9" fill="#8b7a5b" transform="rotate(-15, {60 + (idx * (810 / (priceData.length - 1)))}, 435)">
                        {entry.date.slice(0,6)} {entry.date.slice(-4)}
                      </text>
                    {/each}
                    
                    <!-- Copra Line (forest green) -->
                    {#if hasCopraData}
                      <polyline
                        points={priceData.map((d, i) => {
                          if (d.copra !== null) {
                            const x = 60 + (i * (810 / (priceData.length - 1)));
                            const y = 30 + ((maxPrice - d.copra) / priceRange) * 380;
                            return `${x},${y}`;
                          }
                          return null;
                        }).filter(p => p !== null).join(' ')}
                        fill="none" stroke="#2d5a3b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
                      />
                      <!-- Copra data points -->
                      {#each priceData as d, i}
                        {#if d.copra !== null}
                          <circle cx={60 + (i * (810 / (priceData.length - 1)))} cy={30 + ((maxPrice - d.copra) / priceRange) * 380} r="5" fill="#2d5a3b" stroke="white" stroke-width="2" />
                        {/if}
                      {/each}
                    {/if}
                    
                    <!-- Dehusked Nuts Line (amber/gold) -->
                    {#if hasNutsData}
                      <polyline
                        points={priceData.map((d, i) => {
                          if (d.dehusked_nuts !== null) {
                            const x = 60 + (i * (810 / (priceData.length - 1)));
                            const y = 30 + ((maxPrice - d.dehusked_nuts) / priceRange) * 380;
                            return `${x},${y}`;
                          }
                          return null;
                        }).filter(p => p !== null).join(' ')}
                        fill="none" stroke="#b8860b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
                      />
                      {#each priceData as d, i}
                        {#if d.dehusked_nuts !== null}
                          <circle cx={60 + (i * (810 / (priceData.length - 1)))} cy={30 + ((maxPrice - d.dehusked_nuts) / priceRange) * 380} r="5" fill="#b8860b" stroke="white" stroke-width="2" />
                        {/if}
                      {/each}
                    {/if}
                    
                    <!-- Buko Line (goldenrod) -->
                    {#if hasBukoData}
                      <polyline
                        points={priceData.map((d, i) => {
                          if (d.buko !== null) {
                            const x = 60 + (i * (810 / (priceData.length - 1)));
                            const y = 30 + ((maxPrice - d.buko) / priceRange) * 380;
                            return `${x},${y}`;
                          }
                          return null;
                        }).filter(p => p !== null).join(' ')}
                        fill="none" stroke="#d4a017" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="6,4"
                      />
                      {#each priceData as d, i}
                        {#if d.buko !== null}
                          <circle cx={60 + (i * (810 / (priceData.length - 1)))} cy={30 + ((maxPrice - d.buko) / priceRange) * 380} r="5" fill="#d4a017" stroke="white" stroke-width="2" />
                        {/if}
                      {/each}
                    {/if}
                  </svg>
                </div>
                
                <!-- Legend -->
                <div class="flex flex-wrap justify-center gap-6 mt-4">
                  {#if hasCopraData}<div class="flex items-center gap-2"><div class="w-5 h-0.5" style="border-bottom:3px solid #2d5a3b"></div><span class="text-sm">Copra (₱/kg)</span></div>{/if}
                  {#if hasNutsData}<div class="flex items-center gap-2"><div class="w-5 h-0.5" style="border-bottom:3px solid #b8860b"></div><span class="text-sm">Dehusked Nuts (₱/pc)</span></div>{/if}
                  {#if hasBukoData}<div class="flex items-center gap-2"><div class="w-5 h-0.5" style="border-bottom:3px dashed #d4a017"></div><span class="text-sm">Young Coconut / Buko (₱/pc)</span></div>{/if}
                </div>
              </div>
            </div>
          {:else}
            <!-- Price Table -->
            <div class="card p-6 mb-12 overflow-x-auto">
              <h3 class="font-serif text-xl font-bold mb-6 flex items-center gap-2" style="color:#2d5a3b">
                <Table2 size={20} color="#b8860b" /> {t('table')}
              </h3>
              <table class="w-full min-w-[500px] border-collapse">
                <thead>
                  <tr style="border-bottom:2px solid #e5e0d5">
                    <th class="text-left py-3 px-4 font-semibold" style="color:#2d5a3b">{t('date')}</th>
                    {#if activeProduct === 'all' || activeProduct === 'copra'}<th class="text-left py-3 px-4 font-semibold" style="color:#2d5a3b">{t('copra')}</th>{/if}
                    {#if activeProduct === 'all' || activeProduct === 'nuts'}<th class="text-left py-3 px-4 font-semibold" style="color:#2d5a3b">{t('dehusked')}</th>{/if}
                    {#if activeProduct === 'all' || activeProduct === 'buko'}<th class="text-left py-3 px-4 font-semibold" style="color:#2d5a3b">{t('buko')}</th>{/if}
                  </tr>
                </thead>
                <tbody>
                  {#each filteredTableData as row}
                    <tr class="transition-colors hover:bg-amber-50" style="border-bottom:1px solid #f0ecd9">
                      <td class="py-2.5 px-4 text-sm font-medium" style="color:#4a3b1c">{row.date}</td>
                      {#if activeProduct === 'all' || activeProduct === 'copra'}
                        <td class="py-2.5 px-4">
                          {#if row.copra !== '—'}
                            <span class="font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-800 text-sm">{row.copra}</span>
                          {:else}
                            <span class="text-gray-300 text-sm">—</span>
                          {/if}
                        </td>
                      {/if}
                      {#if activeProduct === 'all' || activeProduct === 'nuts'}
                        <td class="py-2.5 px-4">
                          {#if row.dehusked_nuts !== '—'}
                            <span class="font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-sm">{row.dehusked_nuts}</span>
                          {:else}
                            <span class="text-gray-300 text-sm">—</span>
                          {/if}
                        </td>
                      {/if}
                      {#if activeProduct === 'all' || activeProduct === 'buko'}
                        <td class="py-2.5 px-4">
                          {#if row.buko !== '—'}
                            <span class="font-medium px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-800 text-sm">{row.buko}</span>
                          {:else}
                            <span class="text-gray-300 text-sm">—</span>
                          {/if}
                        </td>
                      {/if}
                    </tr>
                  {/each}
                </tbody>
              </table>
              <p class="text-xs text-center opacity-40 mt-4">Showing {filteredTableData.length} records • Data from 2015–2022</p>
            </div>
          {/if}
        </div>
      {/key}

      <!-- Harvesting Tips & Market Outlook -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        <div class="card p-7">
          <h3 class="font-serif text-xl font-bold mb-6 flex items-center gap-2" style="color:#2d5a3b">
            <Droplets size={20} color="#b8860b" /> {t('harvest_tips')}
          </h3>
          <div class="space-y-4">
            <div class="flex gap-3 items-start">
              <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5" style="background:#e6dcc0; color:#2d5a3b">1</span>
              <span class="text-sm leading-relaxed opacity-75">{t('tip1')}</span>
            </div>
            <div class="flex gap-3 items-start">
              <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5" style="background:#e6dcc0; color:#2d5a3b">2</span>
              <span class="text-sm leading-relaxed opacity-75">{t('tip2')}</span>
            </div>
            <div class="flex gap-3 items-start">
              <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5" style="background:#e6dcc0; color:#2d5a3b">3</span>
              <span class="text-sm leading-relaxed opacity-75">{t('tip3')}</span>
            </div>
          </div>
        </div>
        <div class="card p-7" style="background:linear-gradient(120deg, #fef5e7, #fdf8ed)">
          <h3 class="font-serif text-xl font-bold mb-3 flex items-center gap-2" style="color:#2d5a3b">
            <Truck size={20} color="#b8860b" /> {t('market_outlook')}
          </h3>
          <p class="text-sm opacity-70 leading-relaxed">{t('outlook_desc')}</p>
          <div class="mt-5 flex flex-wrap gap-2">
            <span class="text-xs px-3 py-1.5 rounded-full bg-green-100 text-green-800">📈 Copra: +83% (2020→2022)</span>
            <span class="text-xs px-3 py-1.5 rounded-full bg-amber-100 text-amber-800">🌏 Export demand strong</span>
            <span class="text-xs px-3 py-1.5 rounded-full bg-blue-50 text-blue-700">🥥 Desiccated coconut steady</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  :global(body) {
    --color-forest: #1e3a2f;
    --color-grove: #2d5a3b;
    --color-harvest: #b8860b;
    --color-amber: #d4a017;
    --color-cream: #fef3c7;
    --color-sage: #e8f0e3;
    --color-parchment: #f9f7f0;
    background-color: var(--color-parchment);
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }

  :global(.container) {
    max-width: 1280px;
    margin-left: auto;
    margin-right: auto;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  :global(.section) {
    padding: 2.5rem 0 4rem 0;
  }

  :global(.gold-line) {
    display: block;
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, #d4a017, #fef3c7);
    margin-bottom: 1rem;
    border-radius: 4px;
  }

  :global(.card) {
    background: white;
    border-radius: 1.5rem;
    box-shadow: 0 8px 20px rgba(0,0,0,0.05);
    transition: all 0.2s ease;
    border: 1px solid rgba(0,0,0,0.05);
  }

  :global(.btn) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  :global(.btn:hover) {
    transform: translateY(-2px);
    filter: brightness(0.97);
  }
</style>
