<script lang="ts">
  import { enhance } from '$app/forms';
  import { fly, fade, scale } from 'svelte/transition';
  import { onMount } from 'svelte';
  import {
    Lock, Users, TrendingUp, Download, LogOut, Eye, EyeOff,
    Search, ChevronUp, ChevronDown, Shield,
    MapPin, Wheat, Sprout, BarChart3
  } from 'lucide-svelte';
  import type { PageData, ActionData } from './$types';
  import type { Registration } from '$lib/db/schema';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  let showPw = $state(false);
  let searchQ = $state('');
  let sortField: 'createdAt' | 'fullName' | 'region' = $state('createdAt');
  let sortDir: 'asc' | 'desc' = $state('desc');
  let visible = $state(false);
  let activeView: 'table' | 'cards' = $state('table');

  onMount(() => setTimeout(() => (visible = true), 80));

  let rows = $derived((data.rows ?? []) as Registration[]);
  let filtered = $derived(rows
    .filter(r => {
      const q = searchQ.toLowerCase();
      return !q ||
        (r.fullName ?? '').toLowerCase().includes(q) ||
        (r.email ?? '').toLowerCase().includes(q) ||
        (r.region ?? '').toLowerCase().includes(q) ||
        (r.crops ?? '').toLowerCase().includes(q);
    })
    .sort((a, b) => {
      const va = String((a as Record<string,unknown>)[sortField] ?? '');
      const vb = String((b as Record<string,unknown>)[sortField] ?? '');
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    }));

  // Region breakdown
  let regionCounts = $derived(rows.reduce((acc, r) => {
    const region = r.region ?? 'Unknown';
    acc[region] = (acc[region] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>));
  let topRegions = $derived(Object.entries(regionCounts)
    .filter(([k]) => k !== 'Unknown')
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5));

  function toggleSort(field: typeof sortField) {
    if (sortField === field) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    else { sortField = field; sortDir = 'asc'; }
  }

  function exportCSV() {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Region', 'Farm (ha)', 'Crops', 'Message', 'Language', 'Date Registered'];
    const lines = filtered.map(r =>
      [r.id, r.fullName, r.email, r.phone, r.region, r.farmSize, r.crops, r.message, r.locale, r.createdAt]
        .map(v => `"${String(v ?? '').replace(/"/g, '""')}"`)
        .join(',')
    );
    const csv = [headers.join(','), ...lines].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `unlad-saka-members-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function formatDate(d: string | null) {
    if (!d) return '—';
    try {
      return new Date(d).toLocaleDateString('en-PH', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch { return d; }
  }

  function formatDateShort(d: string | null) {
    if (!d) return '—';
    try {
      return new Date(d).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch { return d; }
  }

  let localeBreakdown = $derived(rows.reduce((acc, r) => {
    const l = r.locale ?? 'en';
    acc[l] = (acc[l] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>));
</script>

<svelte:head>
  <title>Admin – Unlad Saka</title>
</svelte:head>

<div class="pt-20 min-h-screen" style="background:var(--color-parchment)">

  {#if !data.authed}
    <!-- ── Login ─────────────────────────────────────────────────── -->
    <div class="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12">
      <div in:fly={{ y: 30, duration: 600 }} class="w-full max-w-md">
        <div class="card p-10">
          <div class="text-center mb-8">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                 style="background:linear-gradient(135deg,var(--color-forest),var(--color-grove))">
              <Shield size={30} color="white" />
            </div>
            <h1 class="font-serif text-3xl font-bold mb-1" style="color:var(--color-forest)">Admin Login</h1>
            <p class="text-sm opacity-50">Unlad Saka Member Dashboard</p>
          </div>

          {#if form?.error}
            <div in:fly={{ y: -8, duration: 300 }}
                 class="mb-5 p-4 rounded-xl text-sm flex items-center gap-2"
                 style="background:#fef2f2;color:#dc2626;border:1px solid #fecaca">
              <Lock size={15} /> Incorrect password. Please try again.
            </div>
          {/if}

          <form method="POST" action="?/login" use:enhance>
            <label class="label" for="pw">Admin Password</label>
            <div class="relative mb-6">
              <input class="input pr-12" id="pw" name="password"
                     type={showPw ? 'text' : 'password'}
                     placeholder="Enter admin password" required
                     autocomplete="current-password" />
              <button type="button"
                      onclick={() => showPw = !showPw}
                      class="absolute right-3 top-1/2 -translate-y-1/2 p-1 opacity-40 hover:opacity-80 transition-opacity"
                      aria-label={showPw ? 'Hide password' : 'Show password'}>
                {#if showPw}<EyeOff size={18} />{:else}<Eye size={18} />{/if}
              </button>
            </div>
            <button type="submit" class="btn btn-primary w-full justify-center" style="padding:0.9rem;font-size:1rem">
              <Lock size={16} /> Log In
            </button>
          </form>
        </div>
      </div>
    </div>

  {:else}
    <!-- ── Dashboard ─────────────────────────────────────────────── -->
    <div class="container py-10">

      <!-- Header row -->
      <div in:fly={{ y: 20, duration: 500 }} class="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <div class="flex items-center gap-3 mb-1">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center"
                 style="background:var(--color-grove)">
              <BarChart3 size={18} color="white" />
            </div>
            <h1 class="font-serif text-3xl font-bold" style="color:var(--color-forest)">Admin Dashboard</h1>
          </div>
          <p class="text-sm opacity-50 ml-12">Unlad Saka · Member Registration Data</p>
        </div>
        <form method="POST" action="?/logout" use:enhance>
          <button type="submit" class="btn btn-outline gap-2 text-sm">
            <LogOut size={15} /> Log Out
          </button>
        </form>
      </div>

      <!-- Stats row -->
      <div in:fly={{ y: 20, duration: 500, delay: 100 }}
           class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="card p-5">
          <div class="flex items-center gap-2.5 mb-3">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                 style="background:var(--color-sage)">
              <Users size={18} color="var(--color-grove)" />
            </div>
            <span class="text-xs font-semibold uppercase tracking-wide opacity-55">Total Members</span>
          </div>
          <div class="font-serif text-4xl font-bold" style="color:var(--color-forest)">{data.total}</div>
        </div>
        <div class="card p-5">
          <div class="flex items-center gap-2.5 mb-3">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                 style="background:var(--color-flax)">
              <TrendingUp size={18} color="var(--color-harvest)" />
            </div>
            <span class="text-xs font-semibold uppercase tracking-wide opacity-55">This Month</span>
          </div>
          <div class="font-serif text-4xl font-bold" style="color:var(--color-forest)">{data.thisMonth}</div>
        </div>
        <div class="card p-5">
          <div class="flex items-center gap-2.5 mb-3">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                 style="background:var(--color-sage)">
              <MapPin size={18} color="var(--color-grove)" />
            </div>
            <span class="text-xs font-semibold uppercase tracking-wide opacity-55">Regions</span>
          </div>
          <div class="font-serif text-4xl font-bold" style="color:var(--color-forest)">
            {Object.keys(regionCounts).filter(k => k !== 'Unknown').length}
          </div>
        </div>
        <div class="card p-5">
          <div class="flex items-center gap-2.5 mb-3">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                 style="background:var(--color-sage)">
              <Search size={18} color="var(--color-grove)" />
            </div>
            <span class="text-xs font-semibold uppercase tracking-wide opacity-55">Filtered</span>
          </div>
          <div class="font-serif text-4xl font-bold" style="color:var(--color-forest)">{filtered.length}</div>
        </div>
      </div>

      <!-- Side panels + table -->
      <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">

        <!-- Side: Top regions + locale breakdown -->
        <div class="xl:col-span-1 space-y-4">
          <!-- Top regions -->
          {#if topRegions.length > 0}
            <div class="card p-5">
              <h3 class="font-serif text-base font-bold mb-4 flex items-center gap-2" style="color:var(--color-forest)">
                <MapPin size={16} color="var(--color-grove)" /> Top Regions
              </h3>
              <div class="space-y-2.5">
                {#each topRegions as [region, count]}
                  {@const pct = Math.round((count / (data.total || 1)) * 100)}
                  <div>
                    <div class="flex justify-between text-xs mb-1">
                      <span class="font-medium opacity-70 truncate mr-2" title={region}>{region}</span>
                      <span class="font-bold flex-shrink-0" style="color:var(--color-grove)">{count}</span>
                    </div>
                    <div class="h-1.5 rounded-full overflow-hidden" style="background:var(--color-sage)">
                      <div class="h-full rounded-full transition-all duration-700"
                           style="width:{pct}%;background:linear-gradient(90deg,var(--color-grove),var(--color-fern))"></div>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}

          <!-- Language breakdown -->
          {#if Object.keys(localeBreakdown).length > 0}
            <div class="card p-5">
              <h3 class="font-serif text-base font-bold mb-4" style="color:var(--color-forest)">Language</h3>
              <div class="space-y-2">
                {#each Object.entries(localeBreakdown) as [lang, count]}
                  <div class="flex items-center justify-between">
                    <span class="px-2 py-0.5 rounded text-xs font-bold uppercase"
                          style="background:var(--color-sage);color:var(--color-grove)">{lang}</span>
                    <span class="text-sm font-bold" style="color:var(--color-forest)">{count}</span>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>

        <!-- Main table -->
        <div in:fly={{ y: 20, duration: 500, delay: 200 }} class="xl:col-span-3 card overflow-hidden">
          <!-- Table toolbar -->
          <div class="p-4 flex flex-wrap items-center gap-3 border-b" style="border-color:var(--color-sage)">
            <div class="relative flex-1 min-w-48">
              <Search size={15} class="absolute left-3 top-1/2 -translate-y-1/2 opacity-40"
                      style="pointer-events:none" />
              <input type="text" bind:value={searchQ}
                     placeholder="Search name, email, region, crops…"
                     class="input pl-9" style="padding:0.5rem 0.75rem 0.5rem 2.25rem;font-size:0.8rem" />
            </div>
            <button onclick={exportCSV}
                    class="btn btn-gold gap-2 flex-shrink-0" style="padding:0.5rem 1.25rem;font-size:0.8rem">
              <Download size={14} /> Export CSV
            </button>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="w-full text-sm" style="min-width:800px">
              <thead style="background:var(--color-sage)">
                <tr>
                  {#each [
                    { label: '#',        field: null          },
                    { label: 'Name',     field: 'fullName'    },
                    { label: 'Email',    field: null          },
                    { label: 'Phone',    field: null          },
                    { label: 'Region',   field: 'region'      },
                    { label: 'Farm ha',  field: null          },
                    { label: 'Crops',    field: null          },
                    { label: 'Lang',     field: null          },
                    { label: 'Joined',   field: 'createdAt'   },
                  ] as col}
                    <th class="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wide opacity-60 whitespace-nowrap"
                        class:cursor-pointer={!!col.field}
                        onclick={() => col.field && toggleSort(col.field as typeof sortField)}>
                      <span class="flex items-center gap-1">
                        {col.label}
                        {#if col.field === sortField}
                          {#if sortDir === 'asc'}<ChevronUp size={12} />{:else}<ChevronDown size={12} />{/if}
                        {/if}
                      </span>
                    </th>
                  {/each}
                </tr>
              </thead>
              <tbody>
                {#if filtered.length === 0}
                  <tr>
                    <td colspan="9" class="text-center py-16">
                      <div class="opacity-30">
                        <Sprout size={36} class="mx-auto mb-3" />
                        <p class="font-serif text-lg">
                          {rows.length === 0 ? 'No registrations yet.' : 'No results for your search.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                {:else}
                  {#each filtered as row, i}
                    <tr class="border-b hover:bg-sage/20 transition-colors"
                        style="border-color:var(--color-sage)"
                        in:fade={{ duration: 150, delay: i < 20 ? i * 20 : 0 }}>
                      <td class="py-3 px-4 text-xs opacity-35">{i + 1}</td>
                      <td class="py-3 px-4 font-semibold whitespace-nowrap" style="color:var(--color-forest)">
                        {row.fullName}
                      </td>
                      <td class="py-3 px-4 opacity-65 text-xs">
                        <a href="mailto:{row.email}" class="hover:underline">{row.email}</a>
                      </td>
                      <td class="py-3 px-4 opacity-55 text-xs whitespace-nowrap">{row.phone || '—'}</td>
                      <td class="py-3 px-4 opacity-65 text-xs whitespace-nowrap">{row.region || '—'}</td>
                      <td class="py-3 px-4 opacity-55 text-xs text-center">{row.farmSize || '—'}</td>
                      <td class="py-3 px-4 opacity-60 text-xs max-w-28 truncate" title={row.crops ?? ''}>
                        {row.crops || '—'}
                      </td>
                      <td class="py-3 px-4">
                        <span class="px-2 py-0.5 rounded text-xs font-bold uppercase"
                              style="background:var(--color-sage);color:var(--color-grove)">{row.locale}</span>
                      </td>
                      <td class="py-3 px-4 opacity-45 text-xs whitespace-nowrap">{formatDateShort(row.createdAt)}</td>
                    </tr>
                  {/each}
                {/if}
              </tbody>
            </table>
          </div>

          <!-- Table footer -->
          {#if filtered.length > 0}
            <div class="px-4 py-3 border-t text-xs opacity-40 flex justify-between"
                 style="border-color:var(--color-sage)">
              <span>Showing {filtered.length} of {rows.length} members</span>
              <span>Last updated: {new Date().toLocaleTimeString('en-PH')}</span>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>
