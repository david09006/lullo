import type {Money} from '~/lib/catalog/types';
import {fromCents, toCents} from './money';

/**
 * Local cart logic — pure and framework-free so it unit-tests in isolation.
 * Prices are resolved via an injected `PriceResolver`, so this module never
 * imports the catalog and totals always reflect live prices (not a stale
 * snapshot taken at add-time).
 */

export const MAX_LINE_QUANTITY = 99;

export interface CartLine {
  id: string;
  merchandiseId: string;
  quantity: number;
}

export interface Cart {
  lines: CartLine[];
}

export const EMPTY_CART: Cart = {lines: []};

/** Deterministic line id from the variant, so one variant = one merged line. */
export function lineIdFor(merchandiseId: string): string {
  return `line:${merchandiseId}`;
}

function clampQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return 1;
  const rounded = Math.round(quantity);
  if (rounded < 1) return 1;
  return Math.min(rounded, MAX_LINE_QUANTITY);
}

/** Add a variant. If already present, quantities merge (clamped to the cap). */
export function addLine(
  cart: Cart,
  input: {merchandiseId: string; quantity?: number},
): Cart {
  const quantity = clampQuantity(input.quantity ?? 1);
  const id = lineIdFor(input.merchandiseId);
  const existing = cart.lines.find((l) => l.id === id);
  if (existing) {
    return updateLineQuantity(cart, id, existing.quantity + quantity);
  }
  return {lines: [...cart.lines, {id, merchandiseId: input.merchandiseId, quantity}]};
}

/** Set a line's quantity. Quantity <= 0 removes the line. */
export function updateLineQuantity(cart: Cart, lineId: string, quantity: number): Cart {
  if (quantity <= 0) return removeLine(cart, lineId);
  return {
    lines: cart.lines.map((l) =>
      l.id === lineId ? {...l, quantity: clampQuantity(quantity)} : l,
    ),
  };
}

export function removeLine(cart: Cart, lineId: string): Cart {
  return {lines: cart.lines.filter((l) => l.id !== lineId)};
}

export function totalQuantity(cart: Cart): number {
  return cart.lines.reduce((sum, l) => sum + l.quantity, 0);
}

export function isEmpty(cart: Cart): boolean {
  return cart.lines.length === 0;
}

// --- Cost calculation --------------------------------------------------------

export interface ResolvedPrice {
  price: Money;
  compareAtPrice?: Money | null;
  availableForSale?: boolean;
}

export type PriceResolver = (merchandiseId: string) => ResolvedPrice | undefined;

export interface CartLineCost {
  lineId: string;
  merchandiseId: string;
  quantity: number;
  /** Present when the variant still resolves; absent = unavailable/removed. */
  unitPrice?: Money;
  linePrice?: Money;
  available: boolean;
}

export interface CartCost {
  currencyCode: string;
  subtotal: Money; // sum of line prices
  compareAtSubtotal: Money; // sum using compareAtPrice where present
  savings: Money; // compareAtSubtotal - subtotal (>= 0)
  totalQuantity: number;
  lines: CartLineCost[];
  /** merchandiseIds that could not be resolved (e.g. out of stock / API drop). */
  unavailableLineIds: string[];
}

/**
 * Compute cart cost. Lines whose merchandise can't be resolved (variant pulled,
 * failed lookup) are surfaced via `unavailableLineIds` and contribute nothing to
 * the totals — the edge case the brief calls out (out-of-stock / failed API).
 */
export function calculateCartCost(
  cart: Cart,
  resolve: PriceResolver,
  currencyCode = 'USD',
): CartCost {
  let subtotalCents = 0;
  let compareCents = 0;
  const lines: CartLineCost[] = [];
  const unavailableLineIds: string[] = [];

  for (const line of cart.lines) {
    const resolved = resolve(line.merchandiseId);
    if (!resolved || resolved.availableForSale === false) {
      unavailableLineIds.push(line.id);
      lines.push({
        lineId: line.id,
        merchandiseId: line.merchandiseId,
        quantity: line.quantity,
        available: false,
      });
      continue;
    }
    const unitCents = toCents(resolved.price);
    const lineCents = unitCents * line.quantity;
    const compareUnit = resolved.compareAtPrice
      ? toCents(resolved.compareAtPrice)
      : unitCents;
    subtotalCents += lineCents;
    compareCents += compareUnit * line.quantity;
    lines.push({
      lineId: line.id,
      merchandiseId: line.merchandiseId,
      quantity: line.quantity,
      unitPrice: resolved.price,
      linePrice: fromCents(lineCents, currencyCode),
      available: true,
    });
  }

  const savingsCents = Math.max(0, compareCents - subtotalCents);
  return {
    currencyCode,
    subtotal: fromCents(subtotalCents, currencyCode),
    compareAtSubtotal: fromCents(compareCents, currencyCode),
    savings: fromCents(savingsCents, currencyCode),
    totalQuantity: totalQuantity(cart),
    lines,
    unavailableLineIds,
  };
}
