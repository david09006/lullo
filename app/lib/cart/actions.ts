import {addLine, removeLine, updateLineQuantity, type Cart} from './logic';
import {buildCartView, resolveMerchandise, type CartView} from './resolver';
import {
  clearSessionCart,
  getSessionCart,
  setSessionCart,
  type CartSession,
} from './session-cart';

export const CART_INTENT = {
  add: 'add',
  update: 'update',
  remove: 'remove',
  clear: 'clear',
} as const;

export type CartActionResult = {
  intent: string;
  ok: boolean;
  error?: string;
  cart: CartView;
};

function parseQuantity(value: FormDataEntryValue | null, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Applies a cart mutation to the session cart. All inputs are validated
 * server-side: only real, purchasable variants can be added; unknown intents
 * and ids are rejected rather than trusted.
 */
export async function handleCartAction(
  session: CartSession,
  formData: FormData,
): Promise<CartActionResult> {
  const intent = String(formData.get('intent') ?? '');
  let cart: Cart = getSessionCart(session);
  let ok = true;
  let error: string | undefined;

  switch (intent) {
    case CART_INTENT.add: {
      const merchandiseId = String(formData.get('merchandiseId') ?? '');
      const quantity = parseQuantity(formData.get('quantity'), 1);
      const entry = resolveMerchandise(merchandiseId);
      if (!entry) {
        ok = false;
        error = 'That item could not be found.';
      } else if (!entry.variant.availableForSale) {
        ok = false;
        error = 'That option is out of stock.';
      } else {
        cart = addLine(cart, {merchandiseId, quantity});
      }
      break;
    }
    case CART_INTENT.update: {
      const lineId = String(formData.get('lineId') ?? '');
      const quantity = parseQuantity(formData.get('quantity'), 0);
      if (!lineId) {
        ok = false;
        error = 'Missing line.';
      } else {
        cart = updateLineQuantity(cart, lineId, quantity);
      }
      break;
    }
    case CART_INTENT.remove: {
      const lineId = String(formData.get('lineId') ?? '');
      if (!lineId) {
        ok = false;
        error = 'Missing line.';
      } else {
        cart = removeLine(cart, lineId);
      }
      break;
    }
    case CART_INTENT.clear: {
      cart = {lines: []};
      break;
    }
    default: {
      ok = false;
      error = 'Unknown cart action.';
    }
  }

  if (ok) {
    if (cart.lines.length === 0) {
      clearSessionCart(session);
    } else {
      setSessionCart(session, cart);
    }
  }

  return {intent, ok, error, cart: buildCartView(cart)};
}
