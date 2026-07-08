/**
 * HTTP security headers + CSRF/same-origin helpers.
 *
 * The Content-Security-Policy is built per-render in entry.server.tsx (it needs
 * a nonce). The headers here are static and applied to every response in
 * server.ts. Same-origin checks defend state-changing form posts against CSRF,
 * layered on top of SameSite=Lax cookies.
 */

/** Static security headers applied to every response. */
export function securityHeaders(options: {isHttps: boolean}): Record<string, string> {
  const headers: Record<string, string> = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy':
      'camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
  };
  // Only advertise HSTS over HTTPS — never pin localhost/dev to HTTPS.
  if (options.isHttps) {
    headers['Strict-Transport-Security'] =
      'max-age=31536000; includeSubDomains; preload';
  }
  return headers;
}

export function applySecurityHeaders(response: Response, request: Request): void {
  const isHttps =
    new URL(request.url).protocol === 'https:' ||
    request.headers.get('x-forwarded-proto') === 'https';
  for (const [key, value] of Object.entries(securityHeaders({isHttps}))) {
    // Don't clobber a header a route deliberately set (e.g. CSP from entry.server).
    if (!response.headers.has(key)) {
      response.headers.set(key, value);
    }
  }
}

/**
 * True when the request originates from our own site. Uses the Origin header
 * (always sent by browsers on cross-origin-capable requests like POST), falling
 * back to Referer. Compares against the forwarded/host header.
 */
export function isSameOrigin(request: Request): boolean {
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (!host) return false;

  const source = request.headers.get('origin') ?? request.headers.get('referer');
  if (!source) return false;

  try {
    return new URL(source).host === host;
  } catch {
    return false;
  }
}

/**
 * Guard for state-changing actions. Throws a 403 unless the request is
 * same-origin. Call at the top of every action that mutates state.
 */
export function assertSameOrigin(request: Request): void {
  if (!isSameOrigin(request)) {
    throw new Response('Cross-origin request rejected.', {status: 403});
  }
}

/**
 * Verify a Shopify webhook HMAC. Shopify signs the raw request body with your
 * app's webhook signing secret (HMAC-SHA256, base64). Uses Web Crypto (available
 * in the Oxygen/Workers runtime) and a constant-time comparison.
 */
export async function verifyShopifyWebhook(
  rawBody: string,
  hmacHeader: string | null,
  secret: string,
): Promise<boolean> {
  if (!hmacHeader) return false;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    {name: 'HMAC', hash: 'SHA-256'},
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(rawBody),
  );
  const computed = btoa(String.fromCharCode(...new Uint8Array(signature)));
  return timingSafeEqual(computed, hmacHeader);
}

/** Constant-time string comparison to avoid timing side-channels. */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}
