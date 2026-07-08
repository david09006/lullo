import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/collections._index';
import {getCollections} from '~/lib/catalog';
import {ProductMedia} from '~/components/ProductMedia';

export const meta: Route.MetaFunction = () => [
  {title: 'Shop by collection — Lullo'},
  {name: 'description', content: 'Browse Lullo by what your dog needs — rest, enrichment, calm.'},
];

export async function loader() {
  return {collections: getCollections()};
}

export default function CollectionsIndex() {
  const {collections} = useLoaderData<typeof loader>();
  return (
    <div className="container section">
      <header className="section-head">
        <div>
          <p className="eyebrow">Collections</p>
          <h1>Shop by what they need</h1>
        </div>
        <Link to="/collections/all" className="link-underline section-head__link">
          Shop everything →
        </Link>
      </header>
      <ul className="collections-grid">
        {collections.map((c) => (
          <li key={c.handle}>
            <Link to={`/collections/${c.handle}`} className="collection-tile">
              <div className="collection-tile__media">
                <ProductMedia image={c.image} sizes="(min-width: 700px) 33vw, 100vw" />
              </div>
              <div className="collection-tile__body">
                <h2 className="collection-tile__title">{c.title}</h2>
                <p className="collection-tile__desc">{c.description}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
