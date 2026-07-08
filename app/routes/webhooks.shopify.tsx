import type {Route} from './+types/webhooks.shopify';
import {verifyShopifyWebhook} from '~/lib/security';

/**
 * Shopify webhook receiver. Verifies the HMAC signature before doing anything
 * with the payload, so unsigned/forged requests are rejected with 401.
 *
 * To use: set SHOPIFY_WEBHOOK_SECRET (your app's webhook signing secret) and
 * register webhooks pointing at /webhooks/shopify. Handle topics in the switch.
 */
export async function action({request, context}: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', {status: 405});
  }

  const secret = context.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) {
    // Fail closed: never process unverifiable webhooks.
    return new Response('Webhook secret not configured', {status: 500});
  }

  const rawBody = await request.text();
  const valid = await verifyShopifyWebhook(
    rawBody,
    request.headers.get('X-Shopify-Hmac-Sha256'),
    secret,
  );
  if (!valid) {
    return new Response('Invalid signature', {status: 401});
  }

  const topic = request.headers.get('X-Shopify-Topic') ?? 'unknown';
  switch (topic) {
    // SWAP POINT: handle the topics you subscribe to, e.g.:
    // case 'products/update': ...
    // case 'orders/create': ...
    default:
      break;
  }

  return new Response('ok', {status: 200});
}

// Webhooks are POST-only; a GET should not expose anything.
export async function loader() {
  return new Response('Not found', {status: 404});
}
