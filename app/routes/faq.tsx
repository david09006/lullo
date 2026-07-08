import {Link} from 'react-router';
import type {Route} from './+types/faq';

export const meta: Route.MetaFunction = () => [
  {title: 'FAQ — Lullo'},
  {name: 'description', content: 'Answers on sizing, shipping, calming gear, and caring for it.'},
];

const FAQ_GROUPS: {heading: string; items: {q: string; a: string}[]}[] = [
  {
    heading: 'Choosing calm',
    items: [
      {
        q: 'Will a calming bed actually help my anxious dog?',
        a: 'For many dogs, yes — a bolstered, sink-in bed gives them a wall to lean into, which lowers arousal. It’s not a cure for clinical anxiety, but it’s one of the most reliable everyday supports. For diagnosed anxiety, pair it with your vet’s plan.',
      },
      {
        q: 'How do I pick a size?',
        a: 'Each product page has a size chart. As a rule: measure your dog nose-to-tail while curled for beds, and chest girth for the Hush wrap. Between sizes on the wrap? Size down for a snugger, calmer fit.',
      },
      {
        q: 'What’s the difference between the snuffle mat and the lick mat?',
        a: 'The Forage snuffle mat hides food in fabric fronds for a sniff-and-search game — great for burning mental energy. The Still lick mat holds soft food for a licking ritual — great for grooming, alone-time, and vet visits. Many dogs love both.',
      },
    ],
  },
  {
    heading: 'Orders & shipping',
    items: [
      {
        q: 'When will my order arrive?',
        a: 'Orders ship within 1–2 business days. Standard delivery is 3–5 business days in the contiguous US. You’ll get tracking by email.',
      },
      {
        q: 'Do you offer free shipping?',
        a: 'Yes — free standard shipping on orders over $75. Under that, a flat rate is shown at checkout.',
      },
      {
        q: 'What’s your return policy?',
        a: 'We offer a 30-day calm guarantee. If it isn’t working for your dog, send it back within 30 days for a refund. See Shipping & Returns for the details.',
      },
    ],
  },
  {
    heading: 'Care',
    items: [
      {
        q: 'Are the covers washable?',
        a: 'Every bed has a removable, machine-washable cover (cold wash, air dry). Mats and bowls are machine- or dishwasher-safe — check the product page for specifics.',
      },
      {
        q: 'Is the calming collar safe?',
        a: 'The Amble collar uses botanical scents (chamomile or lavender), not medication. It’s safe for everyday wear and adjustable/trimmable. If your dog has skin sensitivities, introduce it gradually.',
      },
    ],
  },
];

export default function FaqRoute() {
  return (
    <div className="page container-narrow container faq">
      <header className="page-hero">
        <p className="eyebrow">Help</p>
        <h1 className="page-hero__title">Questions, answered.</h1>
        <p className="lede">
          Can’t find it here? <Link to="/contact" className="link-underline">Talk to us</Link> —
          a real person, usually same day.
        </p>
      </header>

      {FAQ_GROUPS.map((group) => (
        <section className="faq__group" key={group.heading}>
          <h2 className="faq__group-heading">{group.heading}</h2>
          {group.items.map((item) => (
            <details className="faq__item" key={item.q}>
              <summary className="faq__q">
                {item.q}
                <span className="faq__marker" aria-hidden="true" />
              </summary>
              <div className="faq__a">
                <p>{item.a}</p>
              </div>
            </details>
          ))}
        </section>
      ))}
    </div>
  );
}
