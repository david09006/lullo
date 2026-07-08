import {Link} from 'react-router';
import type {Route} from './+types/privacy';

export const meta: Route.MetaFunction = () => [
  {title: 'Privacy — Lullo'},
  {name: 'description', content: 'How Lullo handles your data. Plain language, no surprises.'},
];

export default function PrivacyRoute() {
  return (
    <div className="page container-narrow container prose">
      <header className="page-hero">
        <p className="eyebrow">Legal</p>
        <h1 className="page-hero__title">Privacy</h1>
        <p className="lede">
          Plain language, no surprises. Here’s what we collect and why.
        </p>
      </header>

      <p className="prose__note">
        This is a starter policy template — have counsel review it before launch,
        and tailor it to your jurisdiction (GDPR, CCPA, etc.).
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Order information</strong> you provide at checkout (name,
          shipping address, email) — processed by Shopify to fulfill your order.
        </li>
        <li>
          <strong>Contact and newsletter details</strong> you choose to share,
          used only to reply to you or send the emails you asked for.
        </li>
        <li>
          <strong>Basic analytics</strong> (pages viewed, device type) to improve
          the store. We don’t sell this.
        </li>
      </ul>

      <h2>Payments &amp; checkout</h2>
      <p>
        Checkout and payments are handled entirely by <strong>Shopify</strong>, a
        PCI-DSS-compliant provider. We never see or store your full card details.
      </p>

      <h2>Cookies</h2>
      <p>
        We use a small number of cookies to keep your cart and session working.
        They’re set with <code>HttpOnly</code>, <code>Secure</code>, and{' '}
        <code>SameSite</code> attributes. We don’t use third-party advertising
        trackers.
      </p>

      <h2>Your choices</h2>
      <ul>
        <li>Unsubscribe from emails anytime via the link in any message.</li>
        <li>
          Request a copy or deletion of your data by{' '}
          <Link to="/contact" className="link-underline">contacting us</Link>.
        </li>
      </ul>

      <h2>Contact</h2>
      <p>
        Questions about your data? <Link to="/contact" className="link-underline">Reach out</Link> —
        we’ll respond promptly.
      </p>
    </div>
  );
}
