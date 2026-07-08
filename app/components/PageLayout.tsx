import {NavLink} from 'react-router';
import {Aside} from '~/components/Aside';
import {Header} from '~/components/Header';
import {Footer} from '~/components/Footer';
import {CartPanel} from '~/components/CartPanel';
import {PRIMARY_NAV} from '~/lib/nav';
import type {CartView} from '~/lib/cart/resolver';

interface PageLayoutProps {
  cart: CartView;
  checkoutLive: boolean;
  children?: React.ReactNode;
}

export function PageLayout({cart, checkoutLive, children}: PageLayoutProps) {
  return (
    <Aside.Provider>
      <CartAside cart={cart} checkoutLive={checkoutLive} />
      <MobileMenuAside />
      <Header cart={cart} />
      <main id="main-content">{children}</main>
      <Footer />
    </Aside.Provider>
  );
}

function CartAside({cart, checkoutLive}: {cart: CartView; checkoutLive: boolean}) {
  return (
    <Aside type="cart" heading="Your cart">
      <CartPanel cart={cart} layout="aside" checkoutLive={checkoutLive} />
    </Aside>
  );
}

function MobileMenuAside() {
  return (
    <Aside type="mobile" heading="Menu">
      <nav className="mobile-nav" aria-label="Main">
        {PRIMARY_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="mobile-nav__link"
            prefetch="intent"
            end={item.to === '/'}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </Aside>
  );
}
