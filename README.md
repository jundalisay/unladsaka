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
