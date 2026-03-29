# Unlad Saka 🌾

Philippine Farm Association web app — SvelteKit + Cloudflare Pages + Turso DB

## Stack

| Tool | Version |
|------|---------|
| Framework | SvelteKit 2 + Svelte 5 |
| Adapter | `@sveltejs/adapter-cloudflare` |
| Database | Turso (libSQL) via Drizzle ORM |
| Styling | Tailwind CSS v4 |
| Icons | lucide-svelte |
| Runtime | Bun |

## Quick Start

```bash
# 1. Install dependencies (also runs svelte-kit sync via prepare script)
bun install

# 2. Copy env file and fill in your Turso credentials
cp .env.example .dev.vars    # used by wrangler for local dev
```

### Create Turso Database

```bash
# Install Turso CLI if needed
curl -sSfL https://get.tur.so/install.sh | bash

turso db create unlad-saka
turso db show unlad-saka      # copy the URL
turso db tokens create unlad-saka  # copy the auth token

# Run the schema migration
turso db shell unlad-saka < drizzle/0000_init.sql
```

Edit `.dev.vars`:
```
TURSO_DATABASE_URL=libsql://unlad-saka-<your-org>.turso.io
TURSO_AUTH_TOKEN=<your-token>
ADMIN_PASSWORD=<choose-a-password>
```

### Development

```bash
bun run dev
```

> The first `bun install` runs `svelte-kit sync` automatically (via the `prepare` script),
> which generates `.svelte-kit/tsconfig.json` and route types.

### Build & Deploy to Cloudflare Pages

```bash
bun run build
bun run deploy
```

Then add environment variables in the **Cloudflare Dashboard**:  
Settings → Environment Variables → Production:

| Key | Value |
|-----|-------|
| `TURSO_DATABASE_URL` | `libsql://...turso.io` |
| `TURSO_AUTH_TOKEN` | `...` |
| `ADMIN_PASSWORD` | `your-secure-password` |

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing page — hero, stats, features, registration form |
| `/harvest` | Seasonal planting guide, pest alerts, market prices, calendar |
| `/news` | Multilingual news from Markdown with search + tag filters |
| `/news/[slug]` | Full article view |
| `/training` | Upcoming training sessions with registration |
| `/admin` | Password-protected member dashboard with CSV export |

## Localization

Three languages supported: **English (en)**, **Filipino/Tagalog (tl)**, **Cebuano (cb)**.

Language is stored in a cookie (`locale`) set via `/api/locale`. The switcher is in the navbar.

### Adding News Articles

Create a Markdown file at `src/content/{en|tl|cb}/news/YY-MM-DD.md`:

```markdown
---
title: "Your Article Title"
description: "Short summary shown in news card"
date: "2025-03-01"
author: "Author Name"
tags: "tag1,tag2,tag3"
---

Article body in Markdown...
```

## Admin Access

Visit `/admin` and enter the `ADMIN_PASSWORD` you configured.  
Default dev password (`.dev.vars`): `admin123`

Features:
- Total member count, this-month count, region count
- Top regions bar chart
- Language breakdown
- Searchable, sortable member table
- CSV export

## Database Schema

```sql
CREATE TABLE registrations (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name  TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  region     TEXT,
  farm_size  TEXT,
  crops      TEXT,
  message    TEXT,
  locale     TEXT DEFAULT 'en',
  created_at TEXT DEFAULT (CURRENT_TIMESTAMP)
);
```



,
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



feb 3,2022 copra 55
oct 14,2021 copra 46.50 dehusked nuts 9.5
jun 12, 2020 COPRA 28 NUTS 8.1
apr 23, 2020 copra 25.50
mar 27, 2020 Copra 24 nuts 7
mar 19, 2020 Copra 24 Coconut 8
mar 7, 2020 COPRA 25 Coconut 8.2
feb 2, 2020 COPRA 26.5, fresh coconut 10, nuts 7
jan 20, 2020 COPRA 29 COCONUT DEHUSK 7 BUKO 10
dec 22, 2019 COPRA 30
nov 26, 2015 copras 31, nuts 9
Nov. 10 2015 nuts 10 Copras 30
Nov 7 2015 Copras 30 dehusked nut 8 

A prominent coconut land owner of Jomalig..during coconut summit organize by LGU and DA with Mayor and MAO Dec 12 14