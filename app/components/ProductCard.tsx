import {Link} from 'react-router';
import type {CatalogProduct} from '~/lib/catalog/types';
import {ProductMedia} from './ProductMedia';
import {Price} from './Price';
import {Badges} from './Badges';
import {Stars} from './Stars';

/**
 * Product card for grids. `feature` gives a larger editorial treatment used to
 * break the grid rhythm (intentional asymmetry).
 */
export function ProductCard({
  product,
  eager = false,
  feature = false,
}: {
  product: CatalogProduct;
  eager?: boolean;
  feature?: boolean;
}) {
  const hasRange =
    product.priceRange.minVariantPrice.amount !==
    product.priceRange.maxVariantPrice.amount;
  const topBadge = product.badges.find((b) => b !== 'vet-informed');

  return (
    <article className={`product-card ${feature ? 'product-card--feature' : ''}`}>
      <Link
        to={`/products/${product.handle}`}
        className="product-card__link"
        aria-label={`${product.title} — ${product.subtitle}`}
      >
        <div className="product-card__media">
          {topBadge ? (
            <span className="product-card__badge">
              <Badges badges={[topBadge]} limit={1} />
            </span>
          ) : null}
          <ProductMedia
            image={product.featuredImage}
            eager={eager}
            sizes={feature ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 768px) 33vw, 100vw'}
          />
        </div>
        <div className="product-card__body">
          <div className="product-card__head">
            <h3 className="product-card__title">{product.title}</h3>
            <Price
              price={product.priceRange.minVariantPrice}
              compareAtPrice={product.variants[0]?.compareAtPrice}
              from={hasRange}
              className="product-card__price"
            />
          </div>
          <p className="product-card__subtitle">{product.subtitle}</p>
          <Stars reviews={product.reviews} />
        </div>
      </Link>
    </article>
  );
}
