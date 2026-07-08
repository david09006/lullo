import type {Money} from '~/lib/catalog/types';

/**
 * Money helpers. All arithmetic happens in integer minor units (cents) so we
 * never leak binary-float artifacts (0.1 + 0.2) into a displayed price.
 */

export function toCents(money: Money): number {
  // Money.amount is a decimal string like "78.00" / "12.5" / "9" / "-4.20".
  const raw = money.amount.trim();
  const negative = raw.startsWith('-');
  const [whole, fraction = ''] = raw.replace('-', '').split('.');
  const cents = (fraction + '00').slice(0, 2);
  const total = (parseInt(whole || '0', 10) || 0) * 100 + (parseInt(cents, 10) || 0);
  return negative ? -total : total;
}

export function fromCents(cents: number, currencyCode: string): Money {
  const rounded = Math.round(cents);
  const sign = rounded < 0 ? '-' : '';
  const abs = Math.abs(rounded);
  const amount = `${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, '0')}`;
  return {amount: `${sign}${amount}`, currencyCode};
}

export function addMoney(a: Money, b: Money): Money {
  assertSameCurrency(a, b);
  return fromCents(toCents(a) + toCents(b), a.currencyCode);
}

export function subtractMoney(a: Money, b: Money): Money {
  assertSameCurrency(a, b);
  return fromCents(toCents(a) - toCents(b), a.currencyCode);
}

export function multiplyMoney(money: Money, factor: number): Money {
  return fromCents(toCents(money) * factor, money.currencyCode);
}

export function zeroMoney(currencyCode = 'USD'): Money {
  return {amount: '0.00', currencyCode};
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  CAD: 'CA$',
  EUR: '€',
  GBP: '£',
};

/** Human-readable price, e.g. "$78.00". Falls back to the currency code. */
export function formatMoney(money: Money): string {
  const cents = toCents(money);
  const symbol = CURRENCY_SYMBOLS[money.currencyCode] ?? `${money.currencyCode} `;
  const value = (Math.abs(cents) / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${cents < 0 ? '-' : ''}${symbol}${value}`;
}

function assertSameCurrency(a: Money, b: Money) {
  if (a.currencyCode !== b.currencyCode) {
    throw new Error(
      `Cannot combine money of different currencies: ${a.currencyCode} vs ${b.currencyCode}`,
    );
  }
}
