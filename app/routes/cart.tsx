import {data, redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/cart';
import {handleCartAction} from '~/lib/cart/actions';
import {getSessionCart} from '~/lib/cart/session-cart';
import {buildCartView} from '~/lib/cart/resolver';
import {isCheckoutLive} from '~/lib/catalog';
import {assertSameOrigin} from '~/lib/security';
import {CartPanel} from '~/components/CartPanel';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Lullo | Your cart'}];
};

export async function action({request, context}: Route.ActionArgs) {
  assertSameOrigin(request);
  const formData = await request.formData();
  const result = await handleCartAction(context.session, formData);

  // Progressive enhancement: a no-JS form can pass redirectTo to navigate.
  const redirectTo = formData.get('redirectTo');
  if (typeof redirectTo === 'string' && redirectTo.startsWith('/')) {
    return redirect(redirectTo);
  }

  return data(result, {status: result.ok ? 200 : 400});
}

export async function loader({context}: Route.LoaderArgs) {
  const cart = buildCartView(getSessionCart(context.session));
  return {cart, checkoutLive: isCheckoutLive(context.env)};
}

export default function CartRoute() {
  const {cart, checkoutLive} = useLoaderData<typeof loader>();
  return (
    <div className="container section">
      <header className="cart-page__head">
        <p className="eyebrow">Your cart</p>
        <h1>The good stuff</h1>
      </header>
      <CartPanel cart={cart} layout="page" checkoutLive={checkoutLive} />
    </div>
  );
}
