import type {
  CatalogCollection,
  CatalogProduct,
  CategoryHandle,
  CatalogSource,
} from './types';
import {media, usd} from './build';
import {BUNDLE_SEEDS, SINGLE_PRODUCTS} from './products';

export * from './types';

/**
 * Catalog adapter — the ONE place the app reads products/collections from.
 *
 * Today it serves the local Lullo catalog (`CATALOG_SOURCE=local`). To go live,
 * set `CATALOG_SOURCE=shopify` + real Storefront credentials and implement the
 * mapper in `./shopify` (see `resolveSource`). Because every function returns the
 * normalized model in `./types`, wiring the real store changes only the source —
 * not a single component.
 */

// --- Assemble the full product list (singles + computed bundles) -------------

function sumComponentMinPrices(componentHandles: string[]): number {
  return componentHandles.reduce((sum, handle) => {
    const p = SINGLE_PRODUCTS.find((x) => x.handle === handle);
    return sum + (p ? Number(p.priceRange.minVariantPrice.amount) : 0);
  }, 0);
}

const BUNDLES: CatalogProduct[] = BUNDLE_SEEDS.map(({seed, price}) => {
  const componentTotal = sumComponentMinPrices(seed.bundle!.componentHandles);
  const saving = Math.max(0, Math.round(componentTotal - price));
  const variants = seed.variants.map((v) => ({
    ...v,
    price: usd(price),
    // Show the honest "was" price (sum of components) as compareAtPrice.
    compareAtPrice: saving > 0 ? usd(componentTotal) : null,
  }));
  return {
    ...seed,
    variants,
    priceRange: {minVariantPrice: usd(price), maxVariantPrice: usd(price)},
    bundle: {
      ...seed.bundle!,
      savingsLabel: saving > 0 ? `Save $${saving} vs. buying separately` : undefined,
    },
  };
});

const ALL_PRODUCTS: CatalogProduct[] = [...SINGLE_PRODUCTS, ...BUNDLES];
const PRODUCT_BY_HANDLE = new Map(ALL_PRODUCTS.map((p) => [p.handle, p]));

// --- Collections -------------------------------------------------------------

const CATEGORY_META: Record<CategoryHandle, {title: string; description: string}> = {
  beds: {
    title: 'Beds & Blankets',
    description: 'Places to burrow, lean, and finally switch off.',
  },
  mats: {
    title: 'Enrichment Mats',
    description: 'Sniff, lick, forage — the calm that comes from a working nose.',
  },
  bowls: {
    title: 'Slow Feeders',
    description: 'Mealtime, unhurried. Better digestion, calmer dog.',
  },
  vests: {
    title: 'Calming Wraps',
    description: 'Gentle pressure for the storms, drives, and vet days.',
  },
  collars: {
    title: 'Calming Collars',
    description: 'All-day, low-key reassurance — no pills, no fuss.',
  },
  crates: {
    title: 'Crates & Dens',
    description: 'A real den you’re happy to keep in the living room.',
  },
  kits: {
    title: 'Calm Kits',
    description: 'Our curated bundles — the fastest way to a calmer baseline.',
  },
};

function categoryCollection(category: CategoryHandle): CatalogCollection {
  const meta = CATEGORY_META[category];
  const handles = ALL_PRODUCTS.filter((p) => p.category === category).map((p) => p.handle);
  return {
    id: `gid://shopify/Collection/${category}`,
    handle: category,
    title: meta.title,
    description: meta.description,
    image: media(`collection-${category}`, `${meta.title} collection`, {
      ground: 'oatDeep',
      object: 'clay',
      shape: category === 'kits' ? 'kit' : 'bed',
    }),
    productHandles: handles,
  };
}

const CURATED_COLLECTIONS: CatalogCollection[] = [
  {
    id: 'gid://shopify/Collection/for-anxious-dogs',
    handle: 'for-anxious-dogs',
    title: 'For Anxious Dogs',
    description:
      'Our most-reached-for calming gear — vet-informed picks for storms, separation, and the wired 5pm hour.',
    image: media('collection-anxious', 'For Anxious Dogs collection', {
      ground: 'oat',
      object: 'clay',
      shape: 'vest',
    }),
    productHandles: [
      'hush-anxiety-vest',
      'drift-weighted-blanket',
      'amble-calming-collar',
      'nook-calming-bed',
      'forage-snuffle-mat',
    ],
  },
];

const CATEGORY_ORDER: CategoryHandle[] = [
  'beds',
  'mats',
  'bowls',
  'vests',
  'collars',
  'crates',
  'kits',
];

const COLLECTIONS: CatalogCollection[] = [
  ...CURATED_COLLECTIONS,
  ...CATEGORY_ORDER.map(categoryCollection),
];
const COLLECTION_BY_HANDLE = new Map(COLLECTIONS.map((c) => [c.handle, c]));

// --- Source resolution (the go-live seam) ------------------------------------

export function resolveSource(env?: {
  CATALOG_SOURCE?: string;
  PUBLIC_STOREFRONT_API_TOKEN?: string;
}): CatalogSource {
  const requested = env?.CATALOG_SOURCE === 'shopify' ? 'shopify' : 'local';
  if (requested === 'shopify' && !env?.PUBLIC_STOREFRONT_API_TOKEN) {
    // Fail safe, loudly: asked for live data but no token yet.
    console.warn(
      '[catalog] CATALOG_SOURCE=shopify but PUBLIC_STOREFRONT_API_TOKEN is empty — falling back to local catalog.',
    );
    return 'local';
  }
  return requested;
}

/** Whether real Shopify checkout is reachable (drives the checkout CTA state). */
export function isCheckoutLive(env?: {
  CATALOG_SOURCE?: string;
  PUBLIC_STOREFRONT_API_TOKEN?: string;
  PUBLIC_STORE_DOMAIN?: string;
}): boolean {
  return (
    resolveSource(env) === 'shopify' &&
    Boolean(env?.PUBLIC_STORE_DOMAIN) &&
    env?.PUBLIC_STORE_DOMAIN !== 'mock.shop'
  );
}

// --- Public read API (local implementation) ----------------------------------

export function getAllProducts(): CatalogProduct[] {
  return ALL_PRODUCTS;
}

export function getSingleProducts(): CatalogProduct[] {
  return SINGLE_PRODUCTS;
}

export function getBundles(): CatalogProduct[] {
  return BUNDLES;
}

export function getProductByHandle(handle: string): CatalogProduct | undefined {
  return PRODUCT_BY_HANDLE.get(handle);
}

export function getFeaturedProducts(limit = 4): CatalogProduct[] {
  const ranked = [...SINGLE_PRODUCTS].sort(
    (a, b) => scoreForFeatured(b) - scoreForFeatured(a),
  );
  return ranked.slice(0, limit);
}

function scoreForFeatured(p: CatalogProduct): number {
  const bestseller = p.badges.includes('bestseller') ? 100 : 0;
  return bestseller + p.reviews.rating * 10 + Math.min(p.reviews.count, 300) / 10;
}

export function getCollections(): CatalogCollection[] {
  return COLLECTIONS;
}

export function getCollectionByHandle(handle: string): CatalogCollection | undefined {
  if (handle === 'all') {
    return {
      id: 'gid://shopify/Collection/all',
      handle: 'all',
      title: 'Shop All',
      description: 'The whole Lullo line — everything calm, in one place.',
      image: media('collection-all', 'Shop all collection', {
        ground: 'oatDeep',
        object: 'sage',
        shape: 'bed',
      }),
      productHandles: ALL_PRODUCTS.map((p) => p.handle),
    };
  }
  return COLLECTION_BY_HANDLE.get(handle);
}

export function getProductsForCollection(handle: string): CatalogProduct[] {
  const collection = getCollectionByHandle(handle);
  if (!collection) return [];
  return collection.productHandles
    .map((h) => PRODUCT_BY_HANDLE.get(h))
    .filter((p): p is CatalogProduct => Boolean(p));
}

export function getRelatedProducts(handle: string, limit = 3): CatalogProduct[] {
  const product = getProductByHandle(handle);
  if (!product) return [];
  return product.relatedHandles
    .map((h) => PRODUCT_BY_HANDLE.get(h))
    .filter((p): p is CatalogProduct => Boolean(p))
    .slice(0, limit);
}

/** Expand a bundle into its component products (for the PDP "what's inside"). */
export function getBundleComponents(handle: string): CatalogProduct[] {
  const product = getProductByHandle(handle);
  if (!product?.bundle) return [];
  return product.bundle.componentHandles
    .map((h) => PRODUCT_BY_HANDLE.get(h))
    .filter((p): p is CatalogProduct => Boolean(p));
}

/** Lightweight case-insensitive search over title, subtitle, tags, category. */
export function searchProducts(query: string): CatalogProduct[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return ALL_PRODUCTS.map((p) => ({p, score: searchScore(p, terms)}))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p);
}

function searchScore(p: CatalogProduct, terms: string[]): number {
  const haystacks: Array<[string, number]> = [
    [p.title.toLowerCase(), 5],
    [p.subtitle.toLowerCase(), 2],
    [p.category, 3],
    [p.tags.join(' '), 2],
    [p.description.toLowerCase(), 1],
  ];
  let score = 0;
  for (const term of terms) {
    for (const [text, weight] of haystacks) {
      if (text.includes(term)) score += weight;
    }
  }
  return score;
}
