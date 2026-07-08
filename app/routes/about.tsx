import {Link} from 'react-router';
import type {Route} from './+types/about';
import {ProductMedia} from '~/components/ProductMedia';

export const meta: Route.MetaFunction = () => [
  {title: 'Our story — Lullo'},
  {
    name: 'description',
    content:
      'Lullo makes vet-informed calming gear for dogs, designed to look like it belongs in your home. This is why we started.',
  },
];

export default function AboutRoute() {
  return (
    <div className="page about">
      <section className="page-hero container-narrow container">
        <p className="eyebrow">Our story</p>
        <h1 className="page-hero__title">
          It started with a dog who couldn’t settle.
        </h1>
        <p className="lede">
          Lullo began the year we adopted Juniper — a wire-haired rescue who
          paced until midnight and flinched at the kettle. The gear that helped
          worked, but it was all neon nylon and cartoon bones. None of it
          belonged in the calm home we were trying to build for her.
        </p>
      </section>

      <section className="container about__feature">
        <div className="about__feature-media">
          <ProductMedia
            image={{
              id: 'about-1',
              url: '',
              altText: '',
              width: 1000,
              height: 1100,
              treatment: {ground: 'oatDeep', object: 'clay', shape: 'bed'},
            }}
            sizes="(min-width: 900px) 45vw, 100vw"
          />
        </div>
        <div className="about__feature-copy">
          <h2>Vet-informed, home-considered.</h2>
          <p>
            Every Lullo product starts with a simple question a vet would ask:
            does this actually help a dog feel safe? Deep pressure, a nose with a
            job, a den to retreat to — the science of calm is unglamorous and
            well understood. We build around it.
          </p>
          <p>
            Then we do the part most pet brands skip: we make it something you’re
            happy to keep in the living room. Warm, earthy materials. Real
            colors. Shapes that read as furniture, not equipment.
          </p>
        </div>
      </section>

      <section className="container-narrow container about__values">
        <h2 className="about__values-title">What we hold to</h2>
        <ul className="values-list">
          <li>
            <h3>Calm is a design problem.</h3>
            <p>
              A bed, a mat, a wrap — each solves for a specific way dogs
              self-soothe. Form follows the nervous system.
            </p>
          </li>
          <li>
            <h3>Honest about what helps.</h3>
            <p>
              We won’t call a collar a cure. Our gear supports calm; for
              diagnosed anxiety, we’ll always point you to your vet.
            </p>
          </li>
          <li>
            <h3>Made to last, made to wash.</h3>
            <p>
              Removable covers, durable materials, recycled where we can. A calm
              home isn’t a disposable one.
            </p>
          </li>
        </ul>
      </section>

      <section className="container about__cta">
        <div className="about__cta-inner">
          <h2>Build your dog a quieter corner.</h2>
          <Link to="/collections/kits" className="btn">
            Start with the Calm Kit
          </Link>
        </div>
      </section>
    </div>
  );
}
