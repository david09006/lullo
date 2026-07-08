import {Form, useLoaderData} from 'react-router';
import type {Route} from './+types/search';
import {searchProducts} from '~/lib/catalog';
import {sanitizeText} from '~/lib/validation';
import {ProductCard} from '~/components/ProductCard';

export const meta: Route.MetaFunction = () => [{title: 'Search — Lullo'}];

export async function loader({request}: Route.LoaderArgs) {
  const url = new URL(request.url);
  const term = sanitizeText(url.searchParams.get('q') ?? '', 80);
  const results = term ? searchProducts(term) : [];
  return {term, results};
}

export default function SearchRoute() {
  const {term, results} = useLoaderData<typeof loader>();
  return (
    <div className="container section search-page">
      <header className="search-page__head">
        <p className="eyebrow">Search</p>
        <h1>Find your calm</h1>
        <Form method="get" role="search" className="search-page__form">
          <label htmlFor="q" className="visually-hidden">
            Search products
          </label>
          <input
            id="q"
            type="search"
            name="q"
            defaultValue={term}
            placeholder="Try “bed”, “anxiety”, “snuffle”…"
            autoComplete="off"
          />
          <button type="submit" className="btn">
            Search
          </button>
        </Form>
      </header>

      {term ? (
        results.length > 0 ? (
          <>
            <p className="search-page__count">
              {results.length} {results.length === 1 ? 'result' : 'results'} for “{term}”
            </p>
            <div className="product-grid">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        ) : (
          <div className="search-page__empty">
            <p>No matches for “{term}”.</p>
            <p className="search-page__empty-hint">
              Try a broader word — “bed”, “mat”, “calm”, or “anxiety”.
            </p>
          </div>
        )
      ) : (
        <p className="search-page__hint">
          Search by product, need, or worry — beds, snuffle mats, storms,
          separation, slow feeding.
        </p>
      )}
    </div>
  );
}
