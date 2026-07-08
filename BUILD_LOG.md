# Lullo — Build Log

A running record of decisions, subagent work, bugs + fixes, and manual steps.
Newest entries at the bottom of each section.

Brand: **Lullo** — a design-led DTC "dog calm & comfort" brand.
Art direction: **Warm Clay & Oat** (terracotta clay, warm oat, sage, dusty rose,
espresso ink). Type: **Fraunces** (display) × **Hanken Grotesk** (body).
Stack: **Shopify Hydrogen** (React Router 7 / Remix) + Storefront API. Checkout
stays on Shopify (PCI-safe). Public Storefront token only — no Admin token.

---

## Decisions

- **D1 — Brand & art direction.** Chose "Warm Clay & Oat" over sage-minimal and
  moody-dusk directions: warmest fit for the brief and hardest to make look
  AI-generated. Name **Lullo** (coined from "lull"); quick web check found no
  existing Lullo pet brand, though "Lulu/Lucy" pet brands exist nearby — flagged
  for a real trademark search before launch.
- **D2 — Scaffold.** Official `npm create @shopify/hydrogen@latest` with
  `--language ts --mock-shop --styling none --markets none --no-shortcut`. Chose
  plain CSS over Tailwind for a bespoke editorial look and full token control.
- **D3 — Product data.** Local on-brand Lullo catalog behind a Storefront-API-
  shaped adapter (`CATALOG_SOURCE=local|shopify`). Keeps every screen on-brand
  now; one env switch repoints to a real store + real Shopify checkoutUrl. No
  fake checkout — "proceed to checkout" shows a connect-your-store state until
  credentials exist.
- **D4 — Imagery.** Designed placeholders with a consistent photo treatment
  (4:5 ratio, soft shadow, oat frame, editorial captions). Every image slot is a
  clearly-marked swap point for real product photography.

## Phase log

### Phase 2 — design system, art direction, Home + Product (+ shell)
- **Design tokens** (`app/styles/app.css`): full Warm Clay & Oat system — palette,
  fluid type scale, spacing, radius/shadow/motion — all CSS custom properties, no
  one-off hex in components. Self-hosted **Fraunces** (display) + **Hanken
  Grotesk** (body) via fontsource (no third-party font requests). Trimmed
  `reset.css` to a true reset; added skip link, visible focus rings,
  reduced-motion support.
- **Product media** (`ProductMedia`): deterministic on-brand SVG treatment per
  category (bed/mat/bowl/vest/collar/crate/kit) — 4:5, soft contact shadow, oat
  ground. Renders a real `<img>` the moment `image.url` is set (photo swap point).
- **Component library**: `ProductCard`, `Price`, `Stars`, `Badges`,
  `ProductPurchase` (variant + qty + add-to-cart), `CartPanel`, `AddToCartButton`.
- **Shell rewired off Storefront menus** to local `nav.ts` + the session cart:
  `root.tsx` (skip link, local cart loader), `PageLayout`, `Header` (wordmark,
  nav, live cart count), `Footer` (considered multi-column + newsletter), cart
  drawer via the reused `Aside`.
- **Routes**: Home (editorial asymmetric hero, category strip, featured grid,
  sage ethos band, Calm Kit spotlight, testimonials), Product (gallery, purchase,
  bundle contents, specs, reviews summary, cross-sell), Collections index +
  detail, Search — all catalog-driven. Added `/cart` action, `/newsletter`
  (validated + honeypot + rate-limited). Removed 13 dead scaffold components/routes.
- **Verified live** (dev server + preview): Home, Product, and the full
  browse→product→add-to-cart→drawer→checkout-pending journey all render on-brand
  with correct behavior. Screenshotted. **Gate green:** typecheck, lint, 39
  tests, build.

### Milestone — real Shopify store linked (2026-07-08)
- Owner ran `npx shopify hydrogen link` → linked Hydrogen storefront **"lullo"**
  on store `jiei0s-jq.myshopify.com` (shop name "Lullo"). `.env` now holds real
  `PUBLIC_STORE_DOMAIN`, `PUBLIC_STOREFRONT_API_TOKEN`, `PUBLIC_STOREFRONT_ID`,
  `PRIVATE_STOREFRONT_API_TOKEN`, and Customer Account API vars. `.env` +
  `.shopify` remain gitignored/untracked (verified); no secrets committed.
- Verified token is valid (read-only Storefront query, API 2025-10) — **but the
  store has 0 products** yet. Set `CATALOG_SOURCE="local"` explicitly so the
  on-brand Lullo catalog keeps rendering. Real checkout is reachable once real
  products exist in Shopify + `CATALOG_SOURCE=shopify`.
- Path chosen: keep building on the local catalog (path 1). Product seeding into
  Shopify (Admin API / CSV import) stays a manual owner step — Storefront token
  is read-only and Admin API is intentionally absent.

### Phase 1 — data layer & catalog adapter
- **D5 — Normalized catalog model as the interface.** Rather than force local
  data through Hydrogen's Storefront-coupled variant utilities
  (`getProductOptions`, `encodedVariantExistence`, …), the app's components
  depend on a normalized internal model (`app/lib/catalog/types.ts`). The adapter
  (`app/lib/catalog/index.ts`) maps _either_ local Lullo data _or_ (later) a real
  Storefront API response into that model — one clean seam, fully unit-testable,
  and the stock Storefront-coupled routes/components get replaced by design-system
  components in Phase 2/3.
- **D6 — Placeholder imagery as SVG treatment.** No real photos yet, so product
  media renders a deterministic, on-brand SVG placeholder (4:5, soft shadow, oat
  ground, per-product palette) via a `ProductMedia` component. Each slot is a
  clearly-marked swap point for real `<Image>`/photography.

Built (`app/lib/catalog/` + `app/lib/cart/`):
- **Catalog** — `types.ts` (normalized model), `build.ts` (money/variant/price
  helpers, cartesian variant builder), `products.ts` (9 single products across
  beds/mats/bowls/vests/collars/crates + 3 Calm Kit bundles, warm vet-informed
  copy), `index.ts` (adapter: featured/related/search/collections, computed
  bundle savings, `resolveSource`/`isCheckoutLive` go-live seam).
- **Cart** — `money.ts` (integer-cents math, no float drift), `logic.ts` (pure
  add/update/remove/clamp + `calculateCartCost` with unavailable-variant
  handling), `resolver.ts` (catalog price resolver + `buildCartView` render
  model), `session-cart.ts` (HttpOnly-cookie persistence, malformed-cookie
  tolerant; stores only line ids + quantities, never prices/PII).
- **Tests: 39 passing** across catalog/money/cart-logic/bridge (bundle-savings
  truthfulness, float-safety, out-of-stock + failed-lookup edge cases). Typecheck
  + lint clean. Routes still render mock.shop data — rewired to the catalog in
  Phase 2/3 alongside the design-system components.

### Phase 0 — scaffold & tooling
- Scaffolded Hydrogen storefront at `/Users/david/lullo` (TypeScript, mock.shop,
  plain CSS). Routes generated for home, products, collections, cart, search,
  policies, blogs, account, robots/sitemap.
- Baseline QA gate — all green:
  - `npm run typecheck` — clean (only React Router v8 future-flag warnings).
  - `npm run lint` — exit 0 (eslint incl. `jsx-a11y`).
  - `npm run build` — exit 0 (codegen against mock.shop).
- Security hygiene: `.env` is gitignored and untracked; wrote `.env.example`
  documenting every var and the real-store swap-in points. `SESSION_SECRET` is a
  placeholder locally — must be regenerated for any deploy (see punch list).
- Test infra: Vitest (`vitest.config.ts`, jsdom, `~` alias, jest-dom matchers,
  smoke test passing) + Playwright (`playwright.config.ts`, desktop + mobile
  chromium projects, dev-server autostart). Added `test`, `test:watch`,
  `test:e2e`, and a combined `verify` (typecheck → lint → test → build) script.
- Fixes in scaffold config: added `test/**` + `e2e/**` to `tsconfig` include so
  tests are typechecked and lintable; pinned `eslint-plugin-jest` version (we run
  Vitest, so its Jest-version auto-detect crashed) — see Bugs.
- **Phase 0 gate: green** — `npm run verify` exits 0 (typecheck, lint, unit,
  build all pass). Chose `@vitejs/plugin-react` be omitted (peer conflict with
  Hydrogen's rolldown-vite); Vitest transforms TSX via esbuild without it.

## Bugs found & fixed
- **B1 — `npm install` ERESOLVE.** `@vitejs/plugin-react@6` pulled a babel peer
  incompatible with Hydrogen's rolldown-vite. _Fix:_ dropped the plugin; Vitest
  transforms TSX via esbuild on its own. (Phase 0)
- **B2 — ESLint parsing error on test files.** Type-aware lint couldn't find
  `test/**` and `e2e/**` in the TS project. _Fix:_ added those globs to
  `tsconfig.json` include. (Phase 0)
- **B3 — ESLint crash: "Unable to detect Jest version".**
  `eslint-plugin-jest`'s `no-deprecated-functions` rule failed because Jest isn't
  installed (we use Vitest). _Fix:_ pinned `settings.jest.version` in
  `eslint.config.js`. (Phase 0)
- **B4 — Console error: `Analytics.Provider` requires `consent.checkoutDomain`.**
  Surfaced on every page. Since the app uses a local cart (not Shopify's analytics
  events), _fix:_ removed `Analytics.Provider` from `root.tsx` entirely (also
  trims the client bundle). Reintroduce with a real checkout domain if/when live
  Shopify analytics are wanted. (Phase 2)
- **B5 — Typecheck break after search rewrite.** Rewriting `search.tsx` made
  codegen drop `PredictiveSearchQuery`/`RegularSearchQuery`, orphaning the unused
  scaffold helper `app/lib/search.ts`. _Fix:_ deleted the dead helper. (Phase 2)
- **B6 — `sanitizeText` control-char regex.** Initial regex matched literal
  space/dash instead of control chars. _Fix:_ filter by char code
  (`< 0x20 || 0x7F`) instead of a regex range. (Phase 2)

## Manual steps for the owner (punch list)
See `README.md` → "Manual steps" for the authoritative list. Highlights so far:
- [ ] Run a formal trademark/domain search for "Lullo" before committing spend.
- [ ] Generate a strong `SESSION_SECRET` for any non-local environment.
- [ ] Provide real `PUBLIC_STORE_DOMAIN` + `PUBLIC_STOREFRONT_API_TOKEN`, then
      set `CATALOG_SOURCE=shopify` to go live on real Shopify data + checkout.
- [ ] Replace placeholder product imagery with real product photography.
