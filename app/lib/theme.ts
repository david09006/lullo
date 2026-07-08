import type {PaletteToken} from '~/lib/catalog/types';

/**
 * The brand palette in JS form — the single source of truth shared with the CSS
 * custom properties in app.css. Used where we need literal colors (SVG media).
 * Keep these in sync with the `:root` tokens.
 */
export const PALETTE: Record<PaletteToken, string> = {
  clay: '#c0664a',
  sage: '#7e8c6a',
  rose: '#dca98e',
  oat: '#f5eee2',
  oatDeep: '#eaddc8',
  ink: '#2e2823',
};

export const INK = PALETTE.ink;
