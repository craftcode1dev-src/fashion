# Maison Valère

Contemporary luxury fashion storefront — Parisian quiet luxury, built with Next.js.

**Live:** https://maison-valere.netlify.app

## Stack

- Next.js 16 (App Router) + React 19
- Tailwind CSS v4
- TypeScript
- Curated static catalogue (`src/lib/catalog.ts`)
- Cart, wishlist and demo checkout persist in `localStorage`

## Local development

```bash
npm install
npm run dev
```

Runs at http://localhost:3001.

## Production

```bash
npm run build
npm start
```

## Deploy

Hosted on Netlify (free plan) via the Next.js runtime.

- Build command: `npm run build`
- Publish directory: `.next`
- Node: 22
- Configuration: `netlify.toml`

The site URL used for canonical metadata is set with `NEXT_PUBLIC_SITE_URL`.
Checkout is a client-side demonstration; no payment is processed.
