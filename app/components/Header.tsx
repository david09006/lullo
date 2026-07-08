import {NavLink} from 'react-router';
import {useAside} from '~/components/Aside';
import {PRIMARY_NAV} from '~/lib/nav';
import type {CartView} from '~/lib/cart/resolver';

export function Header({cart}: {cart: CartView}) {
  const {open} = useAside();
  return (
    <header className="header">
      <div className="header__inner container">
        <button
          className="header__menu-toggle"
          onClick={() => open('mobile')}
          aria-label="Open menu"
        >
          <span className="header__menu-icon" aria-hidden="true" />
        </button>

        <NavLink to="/" prefetch="intent" className="header__logo" end>
          <span className="wordmark">
            Lullo<span className="wordmark__dot">.</span>
          </span>
        </NavLink>

        <nav className="header__nav" aria-label="Main">
          {PRIMARY_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              prefetch="intent"
              className={({isActive}) =>
                `header__link ${isActive ? 'header__link--active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header__actions">
          <NavLink to="/search" className="header__icon-link" aria-label="Search">
            <SearchIcon />
          </NavLink>
          <button
            className="header__cart"
            onClick={() => open('cart')}
            aria-label={`Cart, ${cart.totalQuantity} ${
              cart.totalQuantity === 1 ? 'item' : 'items'
            }`}
          >
            <BagIcon />
            {cart.totalQuantity > 0 ? (
              <span className="header__cart-count" aria-hidden="true">
                {cart.totalQuantity}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" />
      <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 8h12l-1 11a2 2 0 0 1-2 1.8H9A2 2 0 0 1 7 19L6 8Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M9 8a3 3 0 0 1 6 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
