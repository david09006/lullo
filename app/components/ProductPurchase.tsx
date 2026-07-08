import {useMemo, useState} from 'react';
import type {CatalogProduct, CatalogVariant} from '~/lib/catalog/types';
import {AddToCartButton} from '~/components/AddToCartButton';
import {Price} from '~/components/Price';
import {Stars} from '~/components/Stars';

function firstAvailable(product: CatalogProduct): CatalogVariant {
  return product.variants.find((v) => v.availableForSale) ?? product.variants[0];
}

function toSelection(variant: CatalogVariant): Record<string, string> {
  return Object.fromEntries(variant.selectedOptions.map((o) => [o.name, o.value]));
}

export function ProductPurchase({product}: {product: CatalogProduct}) {
  const [selection, setSelection] = useState<Record<string, string>>(() =>
    toSelection(firstAvailable(product)),
  );
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = useMemo(() => {
    return (
      product.variants.find((v) =>
        v.selectedOptions.every((o) => selection[o.name] === o.value),
      ) ?? firstAvailable(product)
    );
  }, [product, selection]);

  // A value is offered if any variant carrying it is purchasable.
  const valueAvailable = (optionName: string, value: string) =>
    product.variants.some(
      (v) =>
        v.availableForSale &&
        v.selectedOptions.some((o) => o.name === optionName && o.value === value),
    );

  const available = selectedVariant.availableForSale;

  return (
    <div className="purchase">
      <div className="purchase__pricerow">
        <Price
          price={selectedVariant.price}
          compareAtPrice={selectedVariant.compareAtPrice}
          className="purchase__price"
        />
        <Stars reviews={product.reviews} />
      </div>

      {product.options.map((option) => (
        <fieldset className="option" key={option.name}>
          <legend className="option__legend">
            {option.name}
            <span className="option__value">{selection[option.name]}</span>
          </legend>
          <div className="option__values">
            {option.values.map((value) => {
              const isColor = Boolean(value.swatchColor);
              const selected = selection[option.name] === value.name;
              const offered = valueAvailable(option.name, value.name);
              return (
                <button
                  key={value.name}
                  type="button"
                  className={`option__btn ${isColor ? 'option__btn--swatch' : ''} ${
                    selected ? 'is-selected' : ''
                  } ${offered ? '' : 'is-unavailable'}`}
                  aria-pressed={selected}
                  aria-label={
                    isColor ? `${value.name}${offered ? '' : ' (unavailable)'}` : undefined
                  }
                  title={value.name}
                  onClick={() =>
                    setSelection((s) => ({...s, [option.name]: value.name}))
                  }
                >
                  {isColor ? (
                    <span
                      className="option__swatch"
                      style={{background: value.swatchColor}}
                      aria-hidden="true"
                    />
                  ) : (
                    value.name
                  )}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div className="purchase__actions">
        <div className="qty qty--lg" role="group" aria-label="Quantity">
          <button
            type="button"
            className="qty__btn"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            −
          </button>
          <span className="qty__value">{quantity}</span>
          <button
            type="button"
            className="qty__btn"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
          >
            +
          </button>
        </div>

        <AddToCartButton
          merchandiseId={selectedVariant.id}
          quantity={quantity}
          available={available}
        >
          Add to cart — <Price price={selectedVariant.price} />
        </AddToCartButton>
      </div>

      {!available ? (
        <p className="purchase__oos">
          This option’s out of stock. Try another size or color.
        </p>
      ) : null}
    </div>
  );
}
