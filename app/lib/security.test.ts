import {describe, it, expect} from 'vitest';
import {
  isSameOrigin,
  securityHeaders,
  timingSafeEqual,
  verifyShopifyWebhook,
} from './security';

function req(headers: Record<string, string>): Request {
  return new Request('https://lullo.test/cart', {method: 'POST', headers});
}

describe('security: same-origin (CSRF)', () => {
  it('accepts a matching Origin', () => {
    expect(
      isSameOrigin(req({origin: 'https://lullo.test', 'x-forwarded-host': 'lullo.test'})),
    ).toBe(true);
  });

  it('falls back to Referer', () => {
    expect(
      isSameOrigin(req({referer: 'https://lullo.test/product', 'x-forwarded-host': 'lullo.test'})),
    ).toBe(true);
  });

  it('rejects a cross-origin request', () => {
    expect(
      isSameOrigin(req({origin: 'https://evil.example', 'x-forwarded-host': 'lullo.test'})),
    ).toBe(false);
  });

  it('rejects when Origin/Referer are absent', () => {
    expect(isSameOrigin(req({'x-forwarded-host': 'lullo.test'}))).toBe(false);
  });
});

describe('security: headers', () => {
  it('includes the core headers and omits HSTS on http', () => {
    const h = securityHeaders({isHttps: false});
    expect(h['X-Content-Type-Options']).toBe('nosniff');
    expect(h['X-Frame-Options']).toBe('DENY');
    expect(h['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
    expect(h['Permissions-Policy']).toContain('geolocation=()');
    expect(h['Strict-Transport-Security']).toBeUndefined();
  });

  it('adds HSTS on https', () => {
    expect(securityHeaders({isHttps: true})['Strict-Transport-Security']).toContain(
      'max-age=31536000',
    );
  });
});

describe('security: timing-safe compare', () => {
  it('matches equal strings and rejects others', () => {
    expect(timingSafeEqual('abc123', 'abc123')).toBe(true);
    expect(timingSafeEqual('abc123', 'abc124')).toBe(false);
    expect(timingSafeEqual('abc', 'abcd')).toBe(false);
  });
});

describe('security: Shopify webhook HMAC', () => {
  const secret = 'shhh-super-secret';
  const body = JSON.stringify({id: 123, topic: 'orders/create'});

  async function sign(payload: string, key: string): Promise<string> {
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(key),
      {name: 'HMAC', hash: 'SHA-256'},
      false,
      ['sign'],
    );
    const sig = await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(payload));
    return btoa(String.fromCharCode(...new Uint8Array(sig)));
  }

  it('accepts a correctly signed payload', async () => {
    const header = await sign(body, secret);
    expect(await verifyShopifyWebhook(body, header, secret)).toBe(true);
  });

  it('rejects a tampered body', async () => {
    const header = await sign(body, secret);
    expect(await verifyShopifyWebhook(body + 'x', header, secret)).toBe(false);
  });

  it('rejects a wrong secret and a missing header', async () => {
    const header = await sign(body, secret);
    expect(await verifyShopifyWebhook(body, header, 'wrong')).toBe(false);
    expect(await verifyShopifyWebhook(body, null, secret)).toBe(false);
  });
});
