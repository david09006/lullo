# Lullo

A design-led, headless storefront for a DTC "dog calm & comfort" brand — calming
beds, snuffle/lick mats, slow feeders, anxiety wraps, calming collars, a modern
crate/den, and curated **Calm Kit** bundles.

Built on **Shopify Hydrogen** (React Router 7 / Remix) + the Storefront API.
Checkout stays on Shopify (PCI-safe). Art direction: **Warm Clay & Oat** —
Fraunces × Hanken Grotesk, a warm earthy palette, editorial layout.

- **Design system:** `app/styles/app.css` (design tokens; no one-off colors)
- **Product catalog:** `app/lib/catalog/` (normalized model + adapter)
- **Cart engine:** `app/lib/cart/` (pure, unit-tested; session-backed)
- **Security:** see [`SECURITY.md`](./SECURITY.md)
- **Build history & decisions:** see [`BUILD_LOG.md`](./BUILD_LOG.md)

---

## Run it locally

Requires Node ≥ 20 (developed on Node 26) and npm.

```bash
npm install
cp .env.example .env   # then edit — see "Environment" below
npm run dev            # http://localhost:3000
```

That's the one command to develop: **`npm run dev`**. With no real Shopify
credentials it runs against Shopify's hosted `mock.shop`, and the storefront
renders the on-brand **local Lullo catalog** (`CATALOG_SOURCE=local`).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with HMR + codegen |
| `npm run build` | Production build (client + Oxygen worker) |
| `npm run preview -- --port 4400` | Serve the production build locally |
| `npm run verify` | **The gate:** typecheck → lint → unit tests → build |
| `npm test` | Unit tests (Vitest) |
| `npm run test:e2e` | End-to-end + accessibility tests (Playwright + axe) |
| `npm run typecheck` / `npm run lint` | Individually |

Before committing, run `npm run verify` — it must be green.

## Testing

- **Unit** (`app/**/*.test.ts`) — cart logic, money math, bundle pricing, catalog
  adapter, validation, security helpers. `npm test`.
- **E2E + a11y** (`e2e/`) — shopping journey, cart, forms, 404, mobile menu, and
  an **axe WCAG 2.1 A/AA** scan of key pages (desktop + mobile). `npm run test:e2e`
  (needs Chromium: `npx playwright install chromium`).
- **Lighthouse** — run against the production preview:
  ```bash
  npm run preview -- --port 4400
  CHROME_PATH="$(node -e "console.log(require('@playwright/test').chromium.executablePath())")" \
    npx lighthouse http://localhost:4400/ --preset=desktop \
    --only-categories=performance,accessibility,best-practices,seo
  ```

## Environment

All configuration is via env vars — see [`.env.example`](./.env.example) for the
annotated list. `.env` is gitignored; never commit it. Only `PUBLIC_*` values
reach the client bundle.

Key variables:

| Variable | Purpose |
| --- | --- |
| `SESSION_SECRET` | Signs the session cookie. **Generate a strong one for any deploy.** |
| `PUBLIC_STORE_DOMAIN` | `mock.shop`, or `your-store.myshopify.com` |
| `PUBLIC_STOREFRONT_API_TOKEN` | Public Storefront API token (client-safe) |
| `CATALOG_SOURCE` | `local` (on-brand mock catalog) or `shopify` (live data) |
| `SHOPIFY_WEBHOOK_SECRET` | HMAC verification for `/webhooks/shopify` (optional) |

## Architecture: the go-live seam

The UI depends on a **normalized catalog model** (`app/lib/catalog/types.ts`),
never on raw Storefront responses. The adapter (`app/lib/catalog/index.ts`)
sources that model from **local data** today, or from the real Storefront API
when you flip the switch — so connecting the real store changes *where* data
comes from, not a single component.

- `CATALOG_SOURCE=local` → renders the authored Lullo catalog. Cart works;
  "checkout" shows a clearly-marked pending state (no fake checkout).
- `CATALOG_SOURCE=shopify` + real token + real products → live Storefront data
  and the real Shopify `checkoutUrl` handoff.

## Deploy (Shopify Oxygen)

```bash
npx shopify hydrogen deploy        # deploys to Oxygen; set env vars in the Shopify admin
```

Set all secrets (`SESSION_SECRET`, tokens, `SHOPIFY_WEBHOOK_SECRET`) in the
hosting environment — not in the repo. Then connect a custom domain to the
deployment (customers see *your* domain, not `*.myshopify.com`).

---

## Manual steps punch list (owner)

Things only you can do, roughly in launch order:

- [ ] **Trademark/domain:** run a formal search for "Lullo" before committing spend.
- [ ] **Session secret:** generate a strong `SESSION_SECRET` for every non-local
      environment (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`).
- [ ] **Products:** add the Lullo products + variants in your Shopify admin (the
      Storefront API is read-only, so this can't be scripted from here — import a
      CSV or enter them). Ask and I can generate a Shopify product-import CSV from
      the local catalog.
- [ ] **Go live on real data:** set `CATALOG_SOURCE=shopify` once products exist;
      verify the Storefront queries + real checkout handoff.
- [ ] **Photography:** replace the SVG placeholder treatment with real product
      photos (every image slot is a marked swap point; set `image.url` / map from
      Storefront).
- [ ] **Reviews:** connect a reviews app (Okendo, Judge.me) to stream real reviews
      into the PDP (currently shows the aggregate placeholder).
- [ ] **Email/ESP:** wire the newsletter + contact form to your provider
      (Klaviyo/Shopify Email/helpdesk) at the marked SWAP POINTs.
- [ ] **Contact inbox + security contact:** set real addresses (contact route,
      `SECURITY.md`).
- [ ] **Webhooks:** set `SHOPIFY_WEBHOOK_SECRET` and register any webhooks to
      `/webhooks/shopify`.
- [ ] **Deploy + domain:** `shopify hydrogen deploy` to Oxygen, connect a custom
      domain, set env vars in the admin.
- [ ] **Re-measure Lighthouse** with real photos over the CDN (images are the
      usual Performance variable).
- [ ] **Legal:** have counsel review the Privacy page and tailor it to your
      jurisdiction (GDPR/CCPA).
- [ ] **Rate limiting at scale:** the in-memory limiter is per-worker; back it
      with Durable Objects/KV if you need strict global limits (see `SECURITY.md`).
- [ ] **Dependency audit:** current `npm audit` findings are build-tooling only
      (not in the deployed bundle); revisit as Shopify updates the CLI toolchain.
