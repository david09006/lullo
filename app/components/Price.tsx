import type {Money} from '~/lib/catalog/types';
import {formatMoney} from '~/lib/cart/money';

export function Price({
  price,
  compareAtPrice,
  from = false,
  className,
}: {
  price: Money;
  compareAtPrice?: Money | null;
  from?: boolean;
  className?: string;
}) {
  const onSale =
    compareAtPrice && Number(compareAtPrice.amount) > Number(price.amount);
  return (
    <span className={`price ${className ?? ''}`}>
      {from ? <span className="price__from">from </span> : null}
      <span className={onSale ? 'price__now' : undefined}>{formatMoney(price)}</span>
      {onSale ? (
        <span className="price__was">
          <span className="visually-hidden">Regular price </span>
          {formatMoney(compareAtPrice)}
        </span>
      ) : null}
    </span>
  );
}
