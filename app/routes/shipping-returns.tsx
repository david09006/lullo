import {Link} from 'react-router';
import type {Route} from './+types/shipping-returns';

export const meta: Route.MetaFunction = () => [
  {title: 'Shipping & Returns — Lullo'},
  {name: 'description', content: 'How Lullo ships, and our 30-day calm guarantee.'},
];

export default function ShippingReturnsRoute() {
  return (
    <div className="page container-narrow container prose">
      <header className="page-hero">
        <p className="eyebrow">The details</p>
        <h1 className="page-hero__title">Shipping &amp; returns</h1>
      </header>

      <h2>Shipping</h2>
      <p>
        We ship within 1–2 business days. Standard delivery lands in 3–5 business
        days across the contiguous US. You’ll get an email with tracking as soon
        as your order leaves us.
      </p>
      <ul>
        <li>
          <strong>Free standard shipping</strong> on orders over $75.
        </li>
        <li>Orders under $75 ship at a flat rate shown at checkout.</li>
        <li>
          Expedited options are offered at checkout where available.
        </li>
      </ul>

      <h2>The 30-day calm guarantee</h2>
      <p>
        Calm takes a few nights. If a Lullo product isn’t working for your dog,
        send it back within 30 days of delivery for a full refund of the item
        price — even if it’s been used. We’d rather you find the right thing than
        keep the wrong one.
      </p>

      <h2>How to return</h2>
      <ol className="prose__ol">
        <li>
          Email <Link to="/contact" className="link-underline">our team</Link> with
          your order number and what didn’t work — it helps us make better gear.
        </li>
        <li>We’ll send a prepaid return label.</li>
        <li>
          Once it’s scanned by the carrier, your refund is issued to the original
          payment method within 5–7 business days.
        </li>
      </ol>

      <h2>Exchanges</h2>
      <p>
        Need a different size or color? Start a return and place a new order — it’s
        the fastest way to get the right one to your door. Reach out if you’d like
        a hand.
      </p>

      <p className="prose__note">
        Questions? <Link to="/contact" className="link-underline">Contact us</Link> —
        a real person will help.
      </p>
    </div>
  );
}
