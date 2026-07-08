/**
 * Lullo catalog — normalized internal product model.
 *
 * This is the single interface the storefront UI depends on. Field names track
 * the Shopify Storefront API closely (money, handle, priceRange, selectedOptions)
 * so the `shopify` adapter can map a real Storefront response into this shape
 * with almost no translation. Swapping `CATALOG_SOURCE` from `local` to `shopify`
 * changes only where these objects come from — never their shape.
 */

/** Brand palette token keys used to tint on-brand placeholder media. */
export type PaletteToken = 'clay' | 'sage' | 'rose' | 'oat' | 'oatDeep' | 'ink';

export interface Money {
  amount: string; // decimal string, e.g. "78.00"
  currencyCode: string; // e.g. "USD"
}

export interface CatalogImage {
  id: string;
  /**
   * For real photography this is a CDN URL. While using placeholders it is an
   * empty string and `ProductMedia` renders an SVG treatment from `treatment`.
   * SWAP POINT: set a real url here (or map from Storefront) to use photos.
   */
  url: string;
  altText: string;
  width: number;
  height: number;
  /** On-brand placeholder treatment; ignored once `url` is a real photo. */
  treatment?: MediaTreatment;
}

/** Descriptor for a deterministic, on-brand SVG placeholder image. */
export interface MediaTreatment {
  ground: PaletteToken; // background wash
  object: PaletteToken; // product silhouette fill
  /** Coarse silhouette shape, chosen per product category. */
  shape: 'bed' | 'mat' | 'bowl' | 'vest' | 'collar' | 'crate' | 'kit';
}

export interface SelectedOption {
  name: string; // e.g. "Size"
  value: string; // e.g. "Medium"
}

export interface OptionValue {
  name: string;
  /** Hex for color swatches; omitted for non-color options. */
  swatchColor?: string;
  available: boolean;
}

export interface ProductOption {
  name: string; // e.g. "Size" | "Color"
  values: OptionValue[];
}

export interface CatalogVariant {
  id: string; // Storefront-style gid or local id
  title: string; // e.g. "Medium / Clay"
  sku: string;
  availableForSale: boolean;
  price: Money;
  compareAtPrice?: Money | null;
  selectedOptions: SelectedOption[];
  image?: CatalogImage | null;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductReviewSummary {
  rating: number; // 0–5, one decimal
  count: number;
}

export type CategoryHandle =
  | 'beds'
  | 'mats'
  | 'bowls'
  | 'vests'
  | 'collars'
  | 'crates'
  | 'kits';

export interface CatalogProduct {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  /** Short editorial one-liner shown under the title. */
  subtitle: string;
  description: string; // plain text
  descriptionHtml: string; // rich text for the PDP
  tags: string[];
  /** Small editorial labels, e.g. "new", "bestseller", "vet-informed". */
  badges: string[];
  category: CategoryHandle;
  featuredImage: CatalogImage;
  images: CatalogImage[];
  options: ProductOption[];
  variants: CatalogVariant[];
  priceRange: {minVariantPrice: Money; maxVariantPrice: Money};
  specs: ProductSpec[];
  reviews: ProductReviewSummary;
  /** Handles of products to cross-sell on the PDP. */
  relatedHandles: string[];
  /**
   * When present, this product is a bundle ("Calm Kit"). It expands to these
   * component product handles; bundle price already reflects the saving.
   */
  bundle?: {
    componentHandles: string[];
    /** e.g. "Save $22 vs. buying separately" — computed, not hardcoded. */
    savingsLabel?: string;
  };
}

export interface CatalogCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: CatalogImage;
  /** Ordered product handles that belong to this collection. */
  productHandles: string[];
}

/** Where the adapter reads from. */
export type CatalogSource = 'local' | 'shopify';
