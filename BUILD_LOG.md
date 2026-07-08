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

## Manual steps for the owner (punch list)
See `README.md` → "Manual steps" for the authoritative list. Highlights so far:
- [ ] Run a formal trademark/domain search for "Lullo" before committing spend.
- [ ] Generate a strong `SESSION_SECRET` for any non-local environment.
- [ ] Provide real `PUBLIC_STORE_DOMAIN` + `PUBLIC_STOREFRONT_API_TOKEN`, then
      set `CATALOG_SOURCE=shopify` to go live on real Shopify data + checkout.
- [ ] Replace placeholder product imagery with real product photography.
