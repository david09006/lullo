import {Link, useFetcher} from 'react-router';
import {useAside} from '~/components/Aside';
import {ProductMedia} from '~/components/ProductMedia';
import {Price} from '~/components/Price';
import {formatMoney} from '~/lib/cart/money';
import {CART_INTENT} from '~/lib/cart/actions';
import type {CartView, CartViewLine} from '~/lib/cart/resolver';

export function CartPanel({
  cart,
  layout,
  checkoutLive,
}: {
  cart: CartView;
  layout: 'page' | 'aside';
  checkoutLive: boolean;
}) {
  if (cart.empty) {
    return <CartEmpty layout={layout} />;
  }

  return (
    <div className={`cart cart--${layout}`}>
      <ul className="cart__lines" aria-label="Cart items">
        {cart.lines.map((line) => (
          <CartLineRow key={line.lineId} line={line} />
        ))}
      </ul>
      <CartFooter cart={cart} checkoutLive={checkoutLive} layout={layout} />
    </div>
  );
}

function CartEmpty({layout}: {layout: 'page' | 'aside'}) {
  const {close} = useAside();
  return (
    <div className="cart-empty">
      <p className="cart-empty__kicker">Your den’s a little quiet.</p>
      <p className="cart-empty__body">
        Nothing in the cart yet — let’s find something soft to fix that.
      </p>
      <Link
        to="/collections/all"
        className="btn"
        onClick={layout === 'aside' ? close : undefined}
      >
        Shop the calm
      </Link>
    </div>
  );
}

function CartLineRow({line}: {line: CartViewLine}) {
  const fetcher = useFetcher();
  // Optimistic quantity while an update is in flight.
  const pendingQty = fetcher.formData?.get('quantity');
  const quantity =
    fetcher.state !== 'idle' && pendingQty != null
      ? Number(pendingQty)
      : line.quantity;

  const options = line.selectedOptions
    .filter((o) => o.name !== 'Title')
    .map((o) => o.value)
    .join(' · ');

  return (
    <li className={`cart-line ${line.available ? '' : 'cart-line--unavailable'}`}>
      <Link to={`/products/${line.productHandle}`} className="cart-line__media" tabIndex={-1}>
        <ProductMedia image={line.image} sizes="96px" />
      </Link>
      <div className="cart-line__info">
        <Link to={`/products/${line.productHandle}`} className="cart-line__title">
          {line.productTitle}
        </Link>
        {options ? <p className="cart-line__options">{options}</p> : null}
        {line.available ? (
          <div className="cart-line__controls">
            <QuantityStepper line={line} quantity={quantity} fetcher={fetcher} />
            <RemoveButton lineId={line.lineId} />
          </div>
        ) : (
          <div className="cart-line__controls">
            <span className="cart-line__oos">No longer available</span>
            <RemoveButton lineId={line.lineId} />
          </div>
        )}
      </div>
      <div className="cart-line__price">
        {line.linePrice ? <Price price={line.linePrice} /> : null}
      </div>
    </li>
  );
}

function QuantityStepper({
  line,
  quantity,
  fetcher,
}: {
  line: CartViewLine;
  quantity: number;
  fetcher: ReturnType<typeof useFetcher>;
}) {
  const submit = (nextQty: number) => {
    void fetcher.submit(
      {intent: CART_INTENT.update, lineId: line.lineId, quantity: String(nextQty)},
      {method: 'POST', action: '/cart'},
    );
  };
  return (
    <div className="qty" role="group" aria-label={`Quantity for ${line.productTitle}`}>
      <button
        type="button"
        className="qty__btn"
        aria-label="Decrease quantity"
        onClick={() => submit(quantity - 1)}
        disabled={fetcher.state !== 'idle'}
      >
        −
      </button>
      <span className="qty__value" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        className="qty__btn"
        aria-label="Increase quantity"
        onClick={() => submit(quantity + 1)}
        disabled={fetcher.state !== 'idle'}
      >
        +
      </button>
    </div>
  );
}

function RemoveButton({lineId}: {lineId: string}) {
  const fetcher = useFetcher();
  return (
    <fetcher.Form method="POST" action="/cart">
      <input type="hidden" name="intent" value={CART_INTENT.remove} />
      <input type="hidden" name="lineId" value={lineId} />
      <button type="submit" className="cart-line__remove link-underline">
        Remove
      </button>
    </fetcher.Form>
  );
}

function CartFooter({
  cart,
  checkoutLive,
  layout,
}: {
  cart: CartView;
  checkoutLive: boolean;
  layout: 'page' | 'aside';
}) {
  const hasSavings = Number(cart.cost.savings.amount) > 0;
  return (
    <div className="cart-footer">
      {hasSavings ? (
        <div className="cart-footer__row cart-footer__row--saving">
          <span>You’re saving</span>
          <span>{formatMoney(cart.cost.savings)}</span>
        </div>
      ) : null}
      <div className="cart-footer__row cart-footer__row--subtotal">
        <span>Subtotal</span>
        <span>{formatMoney(cart.cost.subtotal)}</span>
      </div>
      <p className="cart-footer__note">
        Shipping and taxes calculated at checkout. Free shipping over $75.
      </p>
      <CheckoutButton checkoutLive={checkoutLive} />
      {layout === 'aside' ? <ContinueLink /> : null}
    </div>
  );
}

function CheckoutButton({checkoutLive}: {checkoutLive: boolean}) {
  if (checkoutLive) {
    // When the store has real products + CATALOG_SOURCE=shopify, this becomes a
    // real Shopify cart → checkoutUrl handoff (wired in the go-live step).
    return (
      <Link to="/cart" className="btn btn--block" reloadDocument>
        Continue to checkout
      </Link>
    );
  }
  return (
    <div className="checkout-pending">
      <button type="button" className="btn btn--block" aria-disabled="true" disabled>
        Checkout on Shopify
      </button>
      <p className="checkout-pending__note">
        Checkout goes live once real products are connected in Shopify. Your cart
        works — this is the only step waiting on the store.
      </p>
    </div>
  );
}

function ContinueLink() {
  const {close} = useAside();
  return (
    <button type="button" className="cart-footer__continue link-underline" onClick={close}>
      Continue shopping
    </button>
  );
}
