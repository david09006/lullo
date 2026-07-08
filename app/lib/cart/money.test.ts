import {describe, it, expect} from 'vitest';
import {
  addMoney,
  formatMoney,
  fromCents,
  multiplyMoney,
  subtractMoney,
  toCents,
} from './money';

const usd = (amount: string) => ({amount, currencyCode: 'USD'});

describe('money: parsing', () => {
  it('round-trips decimal strings through cents', () => {
    expect(toCents(usd('78.00'))).toBe(7800);
    expect(toCents(usd('12.5'))).toBe(1250);
    expect(toCents(usd('9'))).toBe(900);
    expect(toCents(usd('-4.20'))).toBe(-420);
    expect(fromCents(7800, 'USD').amount).toBe('78.00');
    expect(fromCents(1250, 'USD').amount).toBe('12.50');
  });
});

describe('money: arithmetic is float-safe', () => {
  it('adds without binary-float drift', () => {
    // The classic 0.1 + 0.2 !== 0.3 trap must not reach a price.
    expect(addMoney(usd('0.10'), usd('0.20')).amount).toBe('0.30');
    expect(addMoney(usd('78.00'), usd('34.00')).amount).toBe('112.00');
  });

  it('multiplies and subtracts', () => {
    expect(multiplyMoney(usd('24.00'), 3).amount).toBe('72.00');
    expect(subtractMoney(usd('136.00'), usd('118.00')).amount).toBe('18.00');
  });

  it('throws when currencies differ', () => {
    expect(() => addMoney(usd('1.00'), {amount: '1.00', currencyCode: 'EUR'})).toThrow();
  });
});

describe('money: formatting', () => {
  it('formats common currencies', () => {
    expect(formatMoney(usd('78.00'))).toBe('$78.00');
    expect(formatMoney({amount: '78', currencyCode: 'EUR'})).toBe('€78.00');
    expect(formatMoney({amount: '1234.5', currencyCode: 'USD'})).toBe('$1,234.50');
  });

  it('falls back to the currency code for unknown currencies', () => {
    expect(formatMoney({amount: '5.00', currencyCode: 'JPY'})).toBe('JPY 5.00');
  });

  it('shows a negative sign', () => {
    expect(formatMoney(usd('-4.20'))).toBe('-$4.20');
  });
});
