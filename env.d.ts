/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />
/// <reference types="@shopify/hydrogen/react-router-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

declare global {
  // Project-specific environment variables (merged with Hydrogen's Env).
  interface Env {
    /** Catalog data source: 'local' (default) or 'shopify'. */
    CATALOG_SOURCE?: string;
    /** Shopify webhook signing secret, for HMAC verification. */
    SHOPIFY_WEBHOOK_SECRET?: string;
  }
}
