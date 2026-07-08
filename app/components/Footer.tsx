import {Link, useFetcher} from 'react-router';
import {FOOTER_COLUMNS, LEGAL_LINKS} from '~/lib/nav';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <span className="wordmark wordmark--lg">
              Lullo<span className="wordmark__dot">.</span>
            </span>
            <p className="footer__blurb">
              Calm, by design — vet-informed beds, mats, and calming gear made to
              look like they belong in your home, not a pet store.
            </p>
            <Newsletter />
          </div>

          <nav className="footer__cols" aria-label="Footer">
            {FOOTER_COLUMNS.map((col) => (
              <div className="footer__col" key={col.heading}>
                <h2 className="footer__col-heading">{col.heading}</h2>
                <ul>
                  {col.links.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="footer__link" prefetch="intent">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="footer__bottom">
          <p className="footer__legal-copy">
            © {year} Lullo. Made calm in Brooklyn. Good dog.
          </p>
          <ul className="footer__legal-links">
            {LEGAL_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} prefetch="intent">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function Newsletter() {
  const fetcher = useFetcher<{ok: boolean; message: string}>();
  const done = fetcher.state === 'idle' && fetcher.data?.ok;

  return (
    <div className="newsletter">
      <h2 className="newsletter__heading">The calm, occasionally.</h2>
      {done ? (
        <p className="newsletter__done" role="status">
          {fetcher.data?.message ?? 'You’re in. Talk soon.'}
        </p>
      ) : (
        <fetcher.Form method="POST" action="/newsletter" className="newsletter__form">
          <label htmlFor="newsletter-email" className="visually-hidden">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            name="email"
            placeholder="you@home.com"
            autoComplete="email"
            required
          />
          <button type="submit" className="btn btn--sm" disabled={fetcher.state !== 'idle'}>
            {fetcher.state !== 'idle' ? 'Joining…' : 'Join'}
          </button>
          {fetcher.data && !fetcher.data.ok ? (
            <p className="field-error" role="alert">
              {fetcher.data.message}
            </p>
          ) : null}
        </fetcher.Form>
      )}
      <p className="newsletter__fineprint">
        Calm tips and the occasional new thing. No spam, unsubscribe anytime.
      </p>
    </div>
  );
}
