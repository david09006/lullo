import {describe, it, expect, vi} from 'vitest';
import {
  getAllProducts,
  getBundles,
  getProductByHandle,
  getProductsForCollection,
  getRelatedProducts,
  getSingleProducts,
  isCheckoutLive,
  resolveSource,
  searchProducts,
} from './index';

describe('catalog: products', () => {
  it('exposes singles + bundles as the full list', () => {
    const all = getAllProducts();
    expect(all.length).toBe(getSingleProducts().length + getBundles().length);
    // handles are unique
    const handles = all.map((p) => p.handle);
    expect(new Set(handles).size).toBe(handles.length);
  });

  it('resolves a known product and returns undefined for an unknown handle', () => {
    expect(getProductByHandle('nook-calming-bed')?.title).toBe('Nook Calming Bed');
    expect(getProductByHandle('does-not-exist')).toBeUndefined();
  });

  it('computes priceRange from variants', () => {
    const nook = getProductByHandle('nook-calming-bed')!;
    // Small 78, Medium 98, Large 118
    expect(nook.priceRange.minVariantPrice.amount).toBe('78.00');
    expect(nook.priceRange.maxVariantPrice.amount).toBe('118.00');
  });

  it('marks configured variants out of stock', () => {
    const nook = getProductByHandle('nook-calming-bed')!;
    const largeSage = nook.variants.find((v) => v.title === 'Large / Sage');
    expect(largeSage?.availableForSale).toBe(false);
  });
});

describe('catalog: bundle math', () => {
  it('computes an honest saving label and compareAtPrice from live component prices', () => {
    const kit = getProductByHandle('calm-kit-starter')!;
    // nook(78) + forage(34) + amble(24) = 136; bundle price 118; saving 18
    expect(kit.variants[0].price.amount).toBe('118.00');
    expect(kit.variants[0].compareAtPrice?.amount).toBe('136.00');
    expect(kit.bundle?.savingsLabel).toBe('Save $18 vs. buying separately');
  });

  it('never claims a bundle is more expensive than its parts', () => {
    for (const bundle of getBundles()) {
      const price = Number(bundle.variants[0].price.amount);
      const was = Number(bundle.variants[0].compareAtPrice?.amount ?? price);
      expect(was).toBeGreaterThanOrEqual(price);
    }
  });
});

describe('catalog: collections + related', () => {
  it('returns every product for the synthetic "all" collection', () => {
    expect(getProductsForCollection('all').length).toBe(getAllProducts().length);
  });

  it('returns only matching products for a category collection', () => {
    const beds = getProductsForCollection('beds');
    expect(beds.length).toBeGreaterThan(0);
    expect(beds.every((p) => p.category === 'beds')).toBe(true);
  });

  it('limits related products and drops missing handles', () => {
    const related = getRelatedProducts('nook-calming-bed', 2);
    expect(related.length).toBe(2);
    expect(related.every((p) => p.handle !== 'nook-calming-bed')).toBe(true);
  });
});

describe('catalog: search', () => {
  it('returns nothing for an empty query', () => {
    expect(searchProducts('   ')).toEqual([]);
  });

  it('finds beds by keyword, ranked', () => {
    const results = searchProducts('bed');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].tags.concat(results[0].category).join(' ')).toContain('bed');
  });

  it('matches on tags (anxiety)', () => {
    const results = searchProducts('anxiety');
    expect(results.some((p) => p.handle === 'hush-anxiety-vest')).toBe(true);
  });
});

describe('catalog: source + checkout resolution', () => {
  it('defaults to local', () => {
    expect(resolveSource({})).toBe('local');
    expect(resolveSource(undefined)).toBe('local');
  });

  it('falls back to local (loudly) when shopify is requested without a token', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(resolveSource({CATALOG_SOURCE: 'shopify'})).toBe('local');
    expect(warn).toHaveBeenCalledOnce();
    warn.mockRestore();
  });

  it('honors shopify when a token is present', () => {
    expect(
      resolveSource({CATALOG_SOURCE: 'shopify', PUBLIC_STOREFRONT_API_TOKEN: 'tok'}),
    ).toBe('shopify');
  });

  it('treats mock.shop as not-live checkout', () => {
    expect(
      isCheckoutLive({
        CATALOG_SOURCE: 'shopify',
        PUBLIC_STOREFRONT_API_TOKEN: 'tok',
        PUBLIC_STORE_DOMAIN: 'mock.shop',
      }),
    ).toBe(false);
    expect(
      isCheckoutLive({
        CATALOG_SOURCE: 'shopify',
        PUBLIC_STOREFRONT_API_TOKEN: 'tok',
        PUBLIC_STORE_DOMAIN: 'lullo.myshopify.com',
      }),
    ).toBe(true);
  });
});
