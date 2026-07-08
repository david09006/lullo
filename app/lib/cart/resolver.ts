import {getAllProducts} from '~/lib/catalog';
import type {CatalogImage, CatalogProduct, CatalogVariant, Money} from '~/lib/catalog/types';
import {calculateCartCost, type Cart, type CartCost, type PriceResolver, type ResolvedPrice} from './logic';

/**
 * Bridge between the pure cart logic and the catalog. Builds fast lookup
 * indexes once, then exposes:
 *  - a `PriceResolver` for cost math, and
 *  - a `CartView` read-model (line + product/variant + cost) the UI renders.
 *
 * When `CATALOG_SOURCE=shopify`, these indexes would be built from a Storefront
 * response instead — same shapes, so nothing downstream changes.
 */

interface MerchandiseEntry {
  product: CatalogProduct;
  variant: CatalogVariant;
}

let merchandiseIndex: Map<string, MerchandiseEntry> | null = null;

function index(): Map<string, MerchandiseEntry> {
  if (merchandiseIndex) return merchandiseIndex;
  const map = new Map<string, MerchandiseEntry>();
  for (const product of getAllProducts()) {
    for (const variant of product.variants) {
      map.set(variant.id, {product, variant});
    }
  }
  merchandiseIndex = map;
  return map;
}

export function resolveMerchandise(merchandiseId: string): MerchandiseEntry | undefined {
  return index().get(merchandiseId);
}

export function createCatalogPriceResolver(): PriceResolver {
  const map = index();
  return (merchandiseId): ResolvedPrice | undefined => {
    const entry = map.get(merchandiseId);
    if (!entry) return undefined;
    return {
      price: entry.variant.price,
      compareAtPrice: entry.variant.compareAtPrice,
      availableForSale: entry.variant.availableForSale,
    };
  };
}

export interface CartViewLine {
  lineId: string;
  merchandiseId: string;
  quantity: number;
  available: boolean;
  productHandle: string;
  productTitle: string;
  variantTitle: string;
  selectedOptions: {name: string; value: string}[];
  image: CatalogImage | null;
  isBundle: boolean;
  unitPrice?: Money;
  linePrice?: Money;
  compareAtUnitPrice?: Money | null;
}

export interface CartView {
  lines: CartViewLine[];
  cost: CartCost;
  totalQuantity: number;
  empty: boolean;
}

/** Build the full render model for a cart (drawer, cart page, mini-cart). */
export function buildCartView(cart: Cart, currencyCode = 'USD'): CartView {
  const resolver = createCatalogPriceResolver();
  const cost = calculateCartCost(cart, resolver, currencyCode);
  const costByLine = new Map(cost.lines.map((l) => [l.lineId, l]));

  const lines: CartViewLine[] = cart.lines.map((line) => {
    const entry = resolveMerchandise(line.merchandiseId);
    const lineCost = costByLine.get(line.id);
    const product = entry?.product;
    const variant = entry?.variant;
    return {
      lineId: line.id,
      merchandiseId: line.merchandiseId,
      quantity: line.quantity,
      available: lineCost?.available ?? false,
      productHandle: product?.handle ?? '',
      productTitle: product?.title ?? 'This item is no longer available',
      variantTitle: variant?.title ?? '',
      selectedOptions: variant?.selectedOptions ?? [],
      image: variant?.image ?? product?.featuredImage ?? null,
      isBundle: Boolean(product?.bundle),
      unitPrice: variant?.price,
      linePrice: lineCost?.linePrice,
      compareAtUnitPrice: variant?.compareAtPrice,
    };
  });

  return {
    lines,
    cost,
    totalQuantity: cost.totalQuantity,
    empty: cart.lines.length === 0,
  };
}
