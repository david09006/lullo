import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/collections.$handle';
import {getCollectionByHandle, getProductsForCollection} from '~/lib/catalog';
import {ProductCard} from '~/components/ProductCard';

export const meta: Route.MetaFunction = ({data}) => {
  const c = data?.collection;
  return [
    {title: c ? `${c.title} — Lullo` : 'Collection — Lullo'},
    {name: 'description', content: c?.description ?? ''},
  ];
};

export async function loader({params}: Route.LoaderArgs) {
  const {handle} = params;
  if (!handle) throw new Response('Not found', {status: 404});
  const collection = getCollectionByHandle(handle);
  if (!collection) throw new Response('Not found', {status: 404});
  return {collection, products: getProductsForCollection(handle)};
}

export default function CollectionRoute() {
  const {collection, products} = useLoaderData<typeof loader>();
  return (
    <div className="container section">
      <header className="collection-head">
        <p className="eyebrow">Collection</p>
        <h1>{collection.title}</h1>
        <p className="lede collection-head__desc">{collection.description}</p>
        <p className="collection-head__count">
          {products.length} {products.length === 1 ? 'product' : 'products'}
        </p>
      </header>

      {products.length > 0 ? (
        <div className="product-grid">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} eager={i < 2} />
          ))}
        </div>
      ) : (
        <div className="collection-empty">
          <p>Nothing here just yet.</p>
          <Link to="/collections/all" className="btn btn--secondary">
            Shop everything
          </Link>
        </div>
      )}
    </div>
  );
}
