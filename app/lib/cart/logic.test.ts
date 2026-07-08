import {describe, it, expect} from 'vitest';
import type {PriceResolver} from './logic';
import {
  addLine,
  calculateCartCost,
  EMPTY_CART,
  isEmpty,
  lineIdFor,
  MAX_LINE_QUANTITY,
  removeLine,
  totalQuantity,
  updateLineQuantity,
} from './logic';

const usd = (amount: string) => ({amount, currencyCode: 'USD'});

describe('cart: line operations', () => {
  it('adds a variant to an empty cart', () => {
    const cart = addLine(EMPTY_CART, {merchandiseId: 'v1'});
    expect(cart.lines).toHaveLength(1);
    expect(cart.lines[0]).toMatchObject({merchandiseId: 'v1', quantity: 1});
    expect(isEmpty(EMPTY_CART)).toBe(true);
  });

  it('merges quantity when the same variant is added again', () => {
    let cart = addLine(EMPTY_CART, {merchandiseId: 'v1', quantity: 2});
    cart = addLine(cart, {merchandiseId: 'v1', quantity: 3});
    expect(cart.lines).toHaveLength(1);
    expect(cart.lines[0].quantity).toBe(5);
  });

  it('keeps different variants as separate lines', () => {
    let cart = addLine(EMPTY_CART, {merchandiseId: 'v1'});
    cart = addLine(cart, {merchandiseId: 'v2'});
    expect(cart.lines).toHaveLength(2);
    expect(totalQuantity(cart)).toBe(2);
  });

  it('clamps quantities to [1, MAX] and rounds', () => {
    const zero = addLine(EMPTY_CART, {merchandiseId: 'v1', quantity: 0});
    expect(zero.lines[0].quantity).toBe(1);
    const huge = addLine(EMPTY_CART, {merchandiseId: 'v1', quantity: 500});
    expect(huge.lines[0].quantity).toBe(MAX_LINE_QUANTITY);
    const frac = addLine(EMPTY_CART, {merchandiseId: 'v1', quantity: 2.6});
    expect(frac.lines[0].quantity).toBe(3);
  });

  it('updates and removes lines; quantity 0 removes', () => {
    let cart = addLine(EMPTY_CART, {merchandiseId: 'v1', quantity: 2});
    const id = lineIdFor('v1');
    cart = updateLineQuantity(cart, id, 4);
    expect(cart.lines[0].quantity).toBe(4);
    cart = updateLineQuantity(cart, id, 0);
    expect(cart.lines).toHaveLength(0);
    cart = addLine(cart, {merchandiseId: 'v2'});
    cart = removeLine(cart, lineIdFor('v2'));
    expect(isEmpty(cart)).toBe(true);
  });

  it('does not mutate the input cart', () => {
    const before = addLine(EMPTY_CART, {merchandiseId: 'v1'});
    const snapshot = JSON.stringify(before);
    addLine(before, {merchandiseId: 'v2'});
    updateLineQuantity(before, lineIdFor('v1'), 9);
    expect(JSON.stringify(before)).toBe(snapshot);
  });
});

describe('cart: cost calculation', () => {
  const resolve: PriceResolver = (id) => {
    const table: Record<string, ReturnType<PriceResolver>> = {
      bed: {price: usd('78.00'), compareAtPrice: null, availableForSale: true},
      collar: {price: usd('24.00'), compareAtPrice: null, availableForSale: true},
      kit: {price: usd('118.00'), compareAtPrice: usd('136.00'), availableForSale: true},
    };
    return table[id];
  };

  it('sums line prices and quantities', () => {
    let cart = addLine(EMPTY_CART, {merchandiseId: 'bed', quantity: 2}); // 156
    cart = addLine(cart, {merchandiseId: 'collar'}); // 24
    const cost = calculateCartCost(cart, resolve);
    expect(cost.subtotal.amount).toBe('180.00');
    expect(cost.totalQuantity).toBe(3);
    expect(cost.unavailableLineIds).toHaveLength(0);
  });

  it('computes savings from compareAtPrice', () => {
    const cart = addLine(EMPTY_CART, {merchandiseId: 'kit'});
    const cost = calculateCartCost(cart, resolve);
    expect(cost.subtotal.amount).toBe('118.00');
    expect(cost.compareAtSubtotal.amount).toBe('136.00');
    expect(cost.savings.amount).toBe('18.00');
  });

  it('flags unresolved variants as unavailable and excludes them from totals', () => {
    let cart = addLine(EMPTY_CART, {merchandiseId: 'bed'});
    cart = addLine(cart, {merchandiseId: 'ghost'}); // resolver returns undefined
    const cost = calculateCartCost(cart, resolve);
    expect(cost.subtotal.amount).toBe('78.00');
    expect(cost.unavailableLineIds).toEqual([lineIdFor('ghost')]);
    const ghostLine = cost.lines.find((l) => l.lineId === lineIdFor('ghost'));
    expect(ghostLine?.available).toBe(false);
    expect(ghostLine?.linePrice).toBeUndefined();
  });

  it('treats availableForSale:false as unavailable', () => {
    const oos: PriceResolver = () => ({price: usd('10.00'), availableForSale: false});
    const cart = addLine(EMPTY_CART, {merchandiseId: 'x'});
    const cost = calculateCartCost(cart, oos);
    expect(cost.subtotal.amount).toBe('0.00');
    expect(cost.unavailableLineIds).toHaveLength(1);
  });

  it('handles an empty cart', () => {
    const cost = calculateCartCost(EMPTY_CART, resolve);
    expect(cost.subtotal.amount).toBe('0.00');
    expect(cost.totalQuantity).toBe(0);
  });
});
