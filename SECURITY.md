# Security posture — Lullo

This documents how the Lullo storefront is hardened. It reflects the code as
built; items marked **(go-live)** need action before a production launch.

## Secrets & credentials

- **Secrets only in env vars.** `.env` is gitignored and never committed
  (verified: not tracked). `.env.example` documents every variable.
- **No Admin API token anywhere.** A storefront never needs it. Only the public
  Storefront token (client-safe) and server-only tokens are used.
- **Client bundle contains no private secrets.** Verified at build time by
  scanning `dist/client` for `PRIVATE_STOREFRONT_API_TOKEN`, `SESSION_SECRET`,
  and `SHOPIFY_WEBHOOK_SECRET` — none present. Only `PUBLIC_*` values (designed
  to be public) reach the client.
- **(go-live)** Generate a strong `SESSION_SECRET`
  (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
  and set it in the Oxygen/hosting environment — the local placeholder must not
  ship.

## HTTP security headers

Set on every response (`app/lib/security.ts` → applied in `server.ts`; CSP is
per-render in `app/entry.server.tsx` because it carries a nonce):

| Header | Value |
| --- | --- |
| `Content-Security-Policy` | nonce-based scripts; `frame-ancestors 'none'`; `font-src 'self'` (self-hosted fonts); `img-src 'self' data: https://cdn.shopify.com`; `connect-src` limited to Shopify + self |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` (HTTPS only — omitted on local http) |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` (paired with CSP `frame-ancestors`) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | camera/microphone/geolocation/browsing-topics/interest-cohort disabled |
| `Cross-Origin-Opener-Policy` | `same-origin` |

## Input handling & XSS

- All form input is **validated and sanitized server-side** (`app/lib/validation.ts`):
  length caps, email format, control-character stripping. The contact and
  newsletter actions reject malformed input with field-level errors.
- **Output is escaped by default** — React escapes all interpolated content.
  The only `dangerouslySetInnerHTML` is product `descriptionHtml`, which is
  **authored brand copy in our own catalog**, never user input.
- No `eval`, no dynamic script construction.

## CSRF

- **Same-origin checks** (`assertSameOrigin`) guard every state-changing action:
  cart mutations, contact, newsletter. Cross-origin POSTs are rejected with 403.
- Session cookie is `SameSite=Lax`, layering with the origin check.

## Cookies & sessions

- Session cookie is `HttpOnly`, `SameSite=Lax`, signed with `SESSION_SECRET`.
  Hydrogen marks it `Secure` in production (HTTPS).
- The cart cookie stores only line ids + quantities — **no prices, no PII**.
  Totals are always recomputed server-side from the catalog, so a tampered
  cookie cannot mis-price an order.
- No personal data is placed in URLs or query strings.

## Rate limiting

- Fixed-window limiter (`app/lib/rate-limit.ts`) on the newsletter and contact
  endpoints (5 requests / minute / client). Plus a hidden **honeypot** field on
  both forms to trap bots.
- **(go-live)** The limiter is per worker isolate (in-memory). For strict,
  globally-consistent limits across all Oxygen instances, back it with Durable
  Objects or KV — the `checkRateLimit` interface stays the same.

## Webhooks

- `/webhooks/shopify` verifies the **HMAC-SHA256 signature** (Web Crypto,
  constant-time compare) against `SHOPIFY_WEBHOOK_SECRET` before processing.
  Fails closed if the secret is unset or the signature is invalid (401).
- **(go-live)** Set `SHOPIFY_WEBHOOK_SECRET` and register the webhooks you need.

## Checkout / PCI

- Checkout stays entirely on **Shopify** (PCI-DSS compliant). There is no custom
  payment flow and the app never sees card data. Until real products + live
  Storefront data are connected, checkout shows a clearly-marked pending state
  (no fake checkout).

## Dependency audit

`npm audit` was reviewed. The remaining advisories (lodash, esbuild, ws,
undici via miniflare) are **all in build-time / dev tooling** —
`@graphql-codegen/cli`, `@react-router/dev`, `@shopify/cli`, `vite`,
`@shopify/mini-oxygen`. Verified they are **not** in the deployed Oxygen worker
bundle (`dist/server` contains no lodash/esbuild). They are transitive deps
pinned by Shopify's toolchain; `npm audit fix --force` would break the build, so
they are tracked to be resolved as Shopify updates the CLI. No known-vulnerable
package ships in the production runtime.

## Reporting

Found an issue? Email security@lullo.example (**(go-live)** replace with a real
inbox) with details and steps to reproduce.
