import type {
  CatalogImage,
  CatalogProduct,
  CatalogVariant,
  MediaTreatment,
  Money,
  SelectedOption,
} from './types';

export const CURRENCY = 'USD';

export function usd(amount: number): Money {
  return {amount: amount.toFixed(2), currencyCode: CURRENCY};
}

/** Stable Storefront-style global id so the model matches real Shopify ids. */
export function gid(kind: 'Product' | 'ProductVariant' | 'Collection', key: string): string {
  return `gid://shopify/${kind}/${key}`;
}

export function media(
  key: string,
  altText: string,
  treatment: MediaTreatment,
): CatalogImage {
  return {
    id: gid('ProductVariant', `img-${key}`),
    url: '', // placeholder; ProductMedia renders `treatment`. SWAP POINT for photos.
    altText,
    width: 1200,
    height: 1500, // 4:5
    treatment,
  };
}

/** Compute the min/max price range across a product's variants. */
export function priceRangeFrom(variants: CatalogVariant[]): CatalogProduct['priceRange'] {
  const amounts = variants.map((v) => Number(v.price.amount));
  return {
    minVariantPrice: usd(Math.min(...amounts)),
    maxVariantPrice: usd(Math.max(...amounts)),
  };
}

/**
 * Build the cartesian product of option value lists into variants. Keeps the
 * option/variant matrix consistent (every combination exists) without hand-
 * writing each variant.
 */
export function buildVariants(params: {
  productKey: string;
  optionMatrix: {name: string; values: string[]}[];
  basePrice: number;
  /** Price delta per option value, keyed by value name. */
  priceDeltas?: Record<string, number>;
  compareAtDelta?: number; // if set, compareAtPrice = price + delta (a "was" price)
  unavailable?: string[]; // variant titles ("Large / Clay") that are out of stock
  image: CatalogImage;
}): CatalogVariant[] {
  const {
    productKey,
    optionMatrix,
    basePrice,
    priceDeltas = {},
    compareAtDelta,
    unavailable = [],
    image,
  } = params;

  const combos = optionMatrix.reduce<SelectedOption[][]>(
    (acc, opt) => {
      const next: SelectedOption[][] = [];
      for (const partial of acc) {
        for (const value of opt.values) {
          next.push([...partial, {name: opt.name, value}]);
        }
      }
      return next;
    },
    [[]],
  );

  return combos.map((selectedOptions, i) => {
    const title = selectedOptions.map((o) => o.value).join(' / ');
    const delta = selectedOptions.reduce(
      (sum, o) => sum + (priceDeltas[o.value] ?? 0),
      0,
    );
    const price = basePrice + delta;
    return {
      id: gid('ProductVariant', `${productKey}-${i + 1}`),
      title: title || 'Default',
      sku: `LULLO-${productKey.toUpperCase()}-${i + 1}`,
      availableForSale: !unavailable.includes(title),
      price: usd(price),
      compareAtPrice: compareAtDelta ? usd(price + compareAtDelta) : null,
      selectedOptions,
      image,
    };
  });
}
