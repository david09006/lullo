import {useEffect, useRef} from 'react';
import {useFetcher} from 'react-router';
import {useAside} from '~/components/Aside';
import {CART_INTENT, type CartActionResult} from '~/lib/cart/actions';

/**
 * Adds a variant to the local session cart via the /cart action. With JS it
 * opens the cart drawer on success; without JS it still posts and the page
 * revalidates (progressive enhancement).
 */
export function AddToCartButton({
  merchandiseId,
  quantity = 1,
  available = true,
  className = 'btn btn--block',
  children,
}: {
  merchandiseId: string;
  quantity?: number;
  available?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const fetcher = useFetcher<CartActionResult>();
  const {open} = useAside();
  const submitting = useRef(false);

  useEffect(() => {
    if (fetcher.state === 'submitting') {
      submitting.current = true;
    }
    if (fetcher.state === 'idle' && submitting.current) {
      submitting.current = false;
      if (fetcher.data?.ok) open('cart');
    }
  }, [fetcher.state, fetcher.data, open]);

  const busy = fetcher.state !== 'idle';
  const error = fetcher.data && !fetcher.data.ok ? fetcher.data.error : undefined;

  return (
    <fetcher.Form method="POST" action="/cart">
      <input type="hidden" name="intent" value={CART_INTENT.add} />
      <input type="hidden" name="merchandiseId" value={merchandiseId} />
      <input type="hidden" name="quantity" value={quantity} />
      <button
        type="submit"
        className={className}
        disabled={!available || busy}
        aria-disabled={!available}
      >
        {!available ? 'Out of stock' : busy ? 'Adding…' : children}
      </button>
      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </fetcher.Form>
  );
}
