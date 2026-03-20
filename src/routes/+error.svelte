<script lang="ts">
  import { page } from '$app/state';
  import { fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { Sprout, ArrowLeft, AlertTriangle } from 'lucide-svelte';

  let visible = $state(false);
  onMount(() => setTimeout(() => (visible = true), 60));

  let status = $derived(page.status);
  let message = $derived(page.error?.message ?? 'Something went wrong.');
</script>

<svelte:head>
  <title>Error {status} – Unlad Saka</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center px-4 pt-20"
     style="background:linear-gradient(160deg,var(--color-forest),var(--color-grove))">
  {#if visible}
    <div in:fly={{ y: 30, duration: 600 }} class="text-center max-w-lg">
      <!-- Decorative wheat icon -->
      <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-float"
           style="background:rgba(255,255,255,0.1)">
        {#if status === 404}
          <Sprout size={36} color="var(--color-amber)" />
        {:else}
          <AlertTriangle size={36} color="var(--color-amber)" />
        {/if}
      </div>

      <p class="text-7xl font-serif font-bold mb-3" style="color:var(--color-amber)">{status}</p>

      <h1 class="font-serif text-2xl font-bold mb-3" style="color:var(--color-cream)">
        {status === 404 ? 'Page Not Found' : 'An Error Occurred'}
      </h1>

      <p class="mb-8 opacity-70" style="color:var(--color-mint)">
        {status === 404
          ? "The page you're looking for doesn't exist or has been moved."
          : message}
      </p>

      <div class="flex flex-wrap gap-3 justify-center">
        <a href="/" class="btn btn-gold gap-2">
          <ArrowLeft size={16} /> Go Home
        </a>
        <a href="/news" class="btn btn-outline"
           style="color:var(--color-mint);border-color:rgba(255,255,255,0.3)">
          Browse News
        </a>
      </div>
    </div>
  {/if}
</div>
