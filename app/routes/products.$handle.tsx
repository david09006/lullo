import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/products.$handle';
import type {CatalogProduct} from '~/lib/catalog/types';
import {
  getBundleComponents,
  getProductByHandle,
  getRelatedProducts,
} from '~/lib/catalog';
import {ProductMedia} from '~/components/ProductMedia';
import {ProductPurchase} from '~/components/ProductPurchase';
import {ProductCard} from '~/components/ProductCard';
import {Badges} from '~/components/Badges';
import {Price} from '~/components/Price';

export const meta: Route.MetaFunction = ({data}) => {
  const product = data?.product;
  if (!product) return [{title: 'Lullo | Product'}];
  return [
    {title: `${product.title} — Lullo`},
    {name: 'description', content: product.subtitle},
    {rel: 'canonical', href: `/products/${product.handle}`},
  ];
};

export async function loader({params}: Route.LoaderArgs) {
  const {handle} = params;
  if (!handle) throw new Response('Not found', {status: 404});
  const product = getProductByHandle(handle);
  if (!product) throw new Response('Not found', {status: 404});

  return {
    product,
    related: getRelatedProducts(handle, 3),
    bundleComponents: product.bundle ? getBundleComponents(handle) : [],
  };
}

export default function ProductRoute() {
  const {product, related, bundleComponents} = useLoaderData<typeof loader>();

  return (
    <div className="product-page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/collections/all">Shop</Link>
          <span aria-hidden="true">/</span>
          <Link to={`/collections/${product.category}`}>{product.category}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{product.title}</span>
        </nav>

        <div className="product-page__grid">
          <Gallery product={product} />

          <div className="product-info">
            <Badges badges={product.badges} />
            <h1 className="product-info__title">{product.title}</h1>
            <p className="product-info__subtitle">{product.subtitle}</p>

            <ProductPurchase product={product} />

            <ul className="trust-row">
              <li>Free shipping over $75</li>
              <li>30-day calm guarantee</li>
              <li>Vet-informed design</li>
            </ul>
          </div>
        </div>

        {bundleComponents.length > 0 ? (
          <BundleContents components={bundleComponents} />
        ) : null}

        <div className="product-detail">
          <section className="product-detail__desc" aria-label="Description">
            {/* Authored brand copy (not user input) — safe to render as HTML. */}
            <div dangerouslySetInnerHTML={{__html: product.descriptionHtml}} />
          </section>
          <aside className="product-detail__specs">
            <h2 className="product-detail__specs-title">The details</h2>
            <dl>
              {product.specs.map((spec) => (
                <div className="spec" key={spec.label}>
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>

        <ReviewsSummary product={product} />

        {related.length > 0 ? (
          <section className="section cross-sell">
            <div className="section-head">
              <h2>Goes well with</h2>
            </div>
            <div className="product-grid">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

function Gallery({product}: {product: CatalogProduct}) {
  return (
    <div className="product-gallery">
      <div className="product-gallery__main">
        <ProductMedia image={product.featuredImage} eager sizes="(min-width: 900px) 50vw, 100vw" />
      </div>
      {product.images.length > 1 ? (
        <ul className="product-gallery__thumbs">
          {product.images.map((img) => (
            <li key={img.id} className="product-gallery__thumb">
              <ProductMedia image={img} sizes="120px" />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function BundleContents({components}: {components: CatalogProduct[]}) {
  return (
    <section className="bundle-contents" aria-label="What's inside">
      <div className="section-head">
        <div>
          <p className="eyebrow">What’s inside</p>
          <h2>Three things that work together</h2>
        </div>
      </div>
      <ul className="bundle-contents__grid">
        {components.map((c) => (
          <li key={c.id} className="bundle-item">
            <Link to={`/products/${c.handle}`} className="bundle-item__link">
              <div className="bundle-item__media">
                <ProductMedia image={c.featuredImage} sizes="(min-width: 700px) 30vw, 90vw" />
              </div>
              <div className="bundle-item__body">
                <h3 className="bundle-item__title">{c.title}</h3>
                <p className="bundle-item__sub">{c.subtitle}</p>
                <Price price={c.priceRange.minVariantPrice} from />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ReviewsSummary({product}: {product: CatalogProduct}) {
  const pct = Math.round((product.reviews.rating / 5) * 100);
  return (
    <section className="reviews" aria-label="Reviews">
      <div className="reviews__head">
        <div className="reviews__score">
          <span className="reviews__number">{product.reviews.rating.toFixed(1)}</span>
          <span
            className="stars__glyphs reviews__stars"
            style={{['--pct' as string]: `${pct}%`}}
            aria-hidden="true"
          />
          <span className="reviews__count">
            Based on {product.reviews.count} verified reviews
          </span>
        </div>
        <p className="reviews__note">
          Reviews are shown in aggregate here. Connect your reviews app (e.g.
          Okendo, Judge.me) to stream individual reviews in.
        </p>
      </div>
    </section>
  );
}
