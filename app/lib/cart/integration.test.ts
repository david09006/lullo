import {describe, it, expect} from 'vitest';
import {getProductByHandle} from '~/lib/catalog';
import {addLine, EMPTY_CART} from './logic';
import {buildCartView, createCatalogPriceResolver} from './resolver';
import {getSessionCart, setSessionCart, type CartSession} from './session-cart';

const bedVariant = getProductByHandle('nook-calming-bed')!.variants[0];
const kitVariant = getProductByHandle('calm-kit-starter')!.variants[0];

describe('resolver: catalog bridge', () => {
  it('resolves real variant ids and rejects unknown ones', () => {
    const resolve = createCatalogPriceResolver();
    expect(resolve(bedVariant.id)?.price.amount).toBe(bedVariant.price.amount);
    expect(resolve('gid://shopify/ProductVariant/nope')).toBeUndefined();
  });

  it('builds a render model with product + variant + line price', () => {
    let cart = addLine(EMPTY_CART, {merchandiseId: bedVariant.id, quantity: 2});
    cart = addLine(cart, {merchandiseId: kitVariant.id});
    const view = buildCartView(cart);
    expect(view.empty).toBe(false);
    expect(view.totalQuantity).toBe(3);

    const bedLine = view.lines.find((l) => l.merchandiseId === bedVariant.id)!;
    expect(bedLine.productTitle).toBe('Nook Calming Bed');
    expect(bedLine.productHandle).toBe('nook-calming-bed');
    expect(bedLine.linePrice?.amount).toBe('156.00'); // 78 * 2

    const kitLine = view.lines.find((l) => l.merchandiseId === kitVariant.id)!;
    expect(kitLine.isBundle).toBe(true);
    expect(kitLine.compareAtUnitPrice?.amount).toBe('136.00');
  });
});

describe('session-cart: persistence + validation', () => {
  function fakeSession(initial?: unknown): CartSession & {store: Record<string, unknown>} {
    const store: Record<string, unknown> = {localCart: initial};
    return {
      store,
      get: (k) => store[k],
      set: (k, v) => {
        store[k] = v;
      },
      unset: (k) => {
        delete store[k];
      },
    };
  }

  it('returns an empty cart for missing or malformed cookies', () => {
    expect(getSessionCart(fakeSession(undefined)).lines).toEqual([]);
    expect(getSessionCart(fakeSession({lines: 'not-an-array'})).lines).toEqual([]);
    expect(
      getSessionCart(fakeSession({lines: [{id: 'x'}, {bogus: true}]})).lines,
    ).toEqual([]); // both entries fail validation
  });

  it('round-trips a valid cart', () => {
    const session = fakeSession();
    const cart = addLine(EMPTY_CART, {merchandiseId: bedVariant.id, quantity: 3});
    setSessionCart(session, cart);
    expect(getSessionCart(session)).toEqual(cart);
  });
});
