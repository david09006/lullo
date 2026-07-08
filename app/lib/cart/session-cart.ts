import {EMPTY_CART, type Cart, type CartLine} from './logic';

/**
 * Persists the local cart in the signed, HttpOnly session cookie. Only line ids
 * + quantities are stored (a few bytes), never prices or PII — totals are always
 * recomputed from the catalog so a stale cookie can't misprice anything.
 */

const CART_KEY = 'localCart';

/** Minimal structural view of the app session (see app/lib/session.ts). */
export interface CartSession {
  get: (key: string) => unknown;
  set: (key: string, value: unknown) => void;
  unset: (key: string) => void;
}

function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== 'object') return false;
  const line = value as Record<string, unknown>;
  return (
    typeof line.id === 'string' &&
    typeof line.merchandiseId === 'string' &&
    typeof line.quantity === 'number' &&
    Number.isFinite(line.quantity)
  );
}

/** Read + validate the cart from the session, tolerating any malformed cookie. */
export function getSessionCart(session: CartSession): Cart {
  const raw = session.get(CART_KEY) as {lines?: unknown} | undefined;
  if (!raw || !Array.isArray(raw.lines)) return EMPTY_CART;
  const lines = raw.lines.filter(isCartLine);
  return {lines};
}

export function setSessionCart(session: CartSession, cart: Cart): void {
  session.set(CART_KEY, cart);
}

export function clearSessionCart(session: CartSession): void {
  session.unset(CART_KEY);
}
