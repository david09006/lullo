import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import type {CatalogCollection, CatalogProduct} from '~/lib/catalog/types';
import {
  getCollectionByHandle,
  getFeaturedProducts,
  getProductByHandle,
} from '~/lib/catalog';
import {ProductCard} from '~/components/ProductCard';
import {ProductMedia} from '~/components/ProductMedia';
import {Price} from '~/components/Price';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Lullo — calm, by design | Beds, mats & calming gear for dogs'},
    {
      name: 'description',
      content:
        'Vet-informed calming beds, snuffle mats, slow feeders and anxiety wraps for dogs — designed to look like they belong in your home.',
    },
  ];
};

export async function loader() {
  const featured = getFeaturedProducts(3);
  const calmKit = getProductByHandle('calm-kit-starter') ?? null;
  const heroProduct = getProductByHandle('nook-calming-bed') ?? null;
  const categories = ['beds', 'mats', 'vests', 'kits']
    .map((h) => getCollectionByHandle(h))
    .filter((c): c is CatalogCollection => Boolean(c));
  return {featured, calmKit, heroProduct, categories};
}

const CATEGORY_BLURB: Record<string, string> = {
  beds: 'Burrow in',
  mats: 'Sniff it out',
  vests: 'Hold me close',
  kits: 'The whole calm',
};

const TESTIMONIALS = [
  {
    quote:
      'First night with the Nook, Biscuit stopped pacing and just… settled. I nearly cried.',
    name: 'Dana R.',
    detail: 'Biscuit, rescue lab',
  },
  {
    quote:
      'The snuffle mat is the only thing that tires out our whippet on a rainy day. Bonus: it looks good in the lounge.',
    name: 'Marcus T.',
    detail: 'Juno, whippet',
  },
  {
    quote:
      'Storm season used to be a nightmare. The wrap plus the weighted blanket changed our whole autumn.',
    name: 'Priya S.',
    detail: 'Alfie, spaniel',
  },
];

export default function Homepage() {
  const {featured, calmKit, heroProduct, categories} =
    useLoaderData<typeof loader>();

  return (
    <div className="home">
      <Hero heroProduct={heroProduct} />
      <CategoryStrip categories={categories} />
      <FeaturedProducts featured={featured} />
      <Ethos />
      {calmKit ? <CalmKitSpotlight kit={calmKit} /> : null}
      <Testimonials />
    </div>
  );
}

function Hero({heroProduct}: {heroProduct: CatalogProduct | null}) {
  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="eyebrow">Calm, by design</p>
          <h1 className="hero__title">
            A quieter home for a <em>calmer</em> dog.
          </h1>
          <p className="lede hero__lede">
            Vet-informed beds, mats and calming gear — the kind that helps an
            anxious dog settle, and happens to look right in your living room.
          </p>
          <div className="hero__cta">
            <Link to="/collections/kits" className="btn">
              Shop the Calm Kit
            </Link>
            <Link to="/about" className="link-underline hero__story">
              Our story →
            </Link>
          </div>
          <ul className="hero__marks">
            <li>Vet-informed</li>
            <li>Machine-washable</li>
            <li>Free shipping over $75</li>
          </ul>
        </div>

        {heroProduct ? (
          <div className="hero__media">
            <Link to={`/products/${heroProduct.handle}`} className="hero__media-link">
              <ProductMedia image={heroProduct.featuredImage} eager sizes="(min-width: 900px) 45vw, 100vw" />
            </Link>
            <figcaption className="hero__caption">
              <span className="hero__caption-chip">Bestseller</span>
              <span>
                {heroProduct.title} — <Price price={heroProduct.priceRange.minVariantPrice} from />
              </span>
            </figcaption>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function CategoryStrip({categories}: {categories: CatalogCollection[]}) {
  return (
    <section className="section-tight cat-strip">
      <div className="container">
        <ul className="cat-strip__grid">
          {categories.map((c) => (
            <li key={c.handle}>
              <Link to={`/collections/${c.handle}`} className="cat-card">
                <div className="cat-card__media">
                  <ProductMedia image={c.image} sizes="(min-width: 700px) 22vw, 45vw" />
                </div>
                <div className="cat-card__label">
                  <span className="cat-card__blurb">{CATEGORY_BLURB[c.handle]}</span>
                  <span className="cat-card__title">{c.title}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function FeaturedProducts({featured}: {featured: CatalogProduct[]}) {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">Reach-for favorites</p>
            <h2>The quiet bestsellers</h2>
          </div>
          <Link to="/collections/all" className="link-underline section-head__link">
            Shop all →
          </Link>
        </div>
        <div className="product-grid product-grid--featured">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} eager={i === 0} feature={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Ethos() {
  return (
    <section className="ethos">
      <div className="container ethos__inner">
        <div className="ethos__media" aria-hidden="true">
          <ProductMedia
            image={{
              id: 'ethos',
              url: '',
              altText: '',
              width: 1000,
              height: 1200,
              treatment: {ground: 'sage', object: 'oatDeep', shape: 'bed'},
            }}
            sizes="(min-width: 900px) 40vw, 100vw"
          />
        </div>
        <div className="ethos__copy">
          <p className="eyebrow eyebrow--on-dark">Why calm matters</p>
          <h2 className="ethos__title">
            A calmer dog isn’t a quieter dog. It’s a happier one.
          </h2>
          <p>
            Anxiety in dogs shows up as pacing, chewing, the 5pm zoomies that
            never end. The fixes aren’t gadgets — they’re the simple things:
            somewhere safe to rest, a nose with a job, gentle pressure when the
            world gets loud.
          </p>
          <p>
            We make those things well, and we make them beautiful, so the calmest
            corner of your home is one you’re happy to look at.
          </p>
          <Link to="/collections/for-anxious-dogs" className="btn btn--secondary">
            For anxious dogs
          </Link>
        </div>
      </div>
    </section>
  );
}

function CalmKitSpotlight({kit}: {kit: CatalogProduct}) {
  return (
    <section className="section">
      <div className="container">
        <div className="spotlight">
          <div className="spotlight__media">
            <Link to={`/products/${kit.handle}`}>
              <ProductMedia image={kit.featuredImage} sizes="(min-width: 800px) 48vw, 100vw" />
            </Link>
          </div>
          <div className="spotlight__copy">
            <p className="eyebrow">Start here</p>
            <h2>{kit.title}</h2>
            <p className="lede">{kit.subtitle}</p>
            {kit.bundle?.savingsLabel ? (
              <p className="spotlight__saving">{kit.bundle.savingsLabel}</p>
            ) : null}
            <div className="spotlight__foot">
              <Price
                price={kit.priceRange.minVariantPrice}
                compareAtPrice={kit.variants[0]?.compareAtPrice}
                className="spotlight__price"
              />
              <Link to={`/products/${kit.handle}`} className="btn">
                See what’s inside
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="section-tight testimonials">
      <div className="container">
        <p className="eyebrow">From the pack</p>
        <ul className="testimonials__grid">
          {TESTIMONIALS.map((t) => (
            <li key={t.name} className="testimonial">
              <blockquote className="testimonial__quote">“{t.quote}”</blockquote>
              <p className="testimonial__by">
                <strong>{t.name}</strong>
                <span>{t.detail}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
