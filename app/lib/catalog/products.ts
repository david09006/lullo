import type {CatalogProduct} from './types';
import {buildVariants, gid, media, priceRangeFrom, usd} from './build';

/**
 * The Lullo product line. Copy is intentionally warm + vet-informed (the brand
 * voice); every image is an on-brand SVG placeholder (SWAP POINT for real photos).
 * Bundle savings labels are computed by the adapter against live component
 * prices, so they never drift out of truth.
 */

type ProductSeed = Omit<CatalogProduct, 'priceRange' | 'featuredImage'> & {
  featuredImage: CatalogProduct['featuredImage'];
};

function finalize(seed: ProductSeed): CatalogProduct {
  return {...seed, priceRange: priceRangeFrom(seed.variants)};
}

const nookBedImage = media('nook-bed', 'Nook calming bed in clay, top-down on a warm oat ground', {
  ground: 'oatDeep',
  object: 'clay',
  shape: 'bed',
});

const nookCalmingBed = finalize({
  id: gid('Product', 'nook-calming-bed'),
  handle: 'nook-calming-bed',
  title: 'Nook Calming Bed',
  vendor: 'Lullo',
  subtitle: 'The orthopedic donut bed dogs burrow into — and you don’t mind on the floor.',
  category: 'beds',
  badges: ['bestseller', 'vet-informed'],
  tags: ['calming', 'orthopedic', 'machine-washable', 'anxiety'],
  description:
    'A deep, round bed with a raised bolster rim that gives anxious dogs a wall to lean into. The recycled-fiber fill keeps its loft, and the cover pulls off for the wash without a fight.',
  descriptionHtml: `
    <p>The <strong>Nook</strong> is built around one idea: dogs settle faster when they have something to curl against. The raised bolster rim gives them a wall on every side — the same instinct that makes them tuck into a corner of the sofa.</p>
    <ul>
      <li><strong>Orthopedic base</strong> — a supportive foam floor for older joints, under a cloud of recycled-fiber loft.</li>
      <li><strong>Calm by design</strong> — a self-warming, sink-in surface that helps lower resting heart rate.</li>
      <li><strong>Actually washable</strong> — zip-off cover, cold machine wash, air dry. No dry-clean nonsense.</li>
    </ul>
    <p>Vet-informed, home-considered. It looks like it belongs in your living room because it does.</p>
  `,
  featuredImage: nookBedImage,
  images: [nookBedImage],
  options: [
    {
      name: 'Size',
      values: [
        {name: 'Small', available: true},
        {name: 'Medium', available: true},
        {name: 'Large', available: true},
      ],
    },
    {
      name: 'Color',
      values: [
        {name: 'Clay', swatchColor: '#C0664A', available: true},
        {name: 'Sage', swatchColor: '#7E8C6A', available: true},
        {name: 'Oat', swatchColor: '#EADDC8', available: true},
      ],
    },
  ],
  variants: buildVariants({
    productKey: 'nook',
    optionMatrix: [
      {name: 'Size', values: ['Small', 'Medium', 'Large']},
      {name: 'Color', values: ['Clay', 'Sage', 'Oat']},
    ],
    basePrice: 78,
    priceDeltas: {Medium: 20, Large: 40},
    unavailable: ['Large / Sage'],
    image: nookBedImage,
  }),
  specs: [
    {label: 'Fill', value: 'Recycled poly-fiber + orthopedic foam base'},
    {label: 'Cover', value: 'Brushed recycled cotton, removable'},
    {label: 'Care', value: 'Machine wash cold, air dry'},
    {label: 'Sizes', value: 'S (24") · M (30") · L (36")'},
  ],
  reviews: {rating: 4.8, count: 214},
  relatedHandles: ['drift-weighted-blanket', 'forage-snuffle-mat', 'amble-calming-collar'],
});

const bolsterImage = media('hollow-bolster', 'Hollow bolster bed in oat with a low front lip', {
  ground: 'oatDeep',
  object: 'sage',
  shape: 'bed',
});

const hollowBolsterBed = finalize({
  id: gid('Product', 'hollow-bolster-bed'),
  handle: 'hollow-bolster-bed',
  title: 'Hollow Bolster Bed',
  vendor: 'Lullo',
  subtitle: 'A rectangular bolster bed with a low front — easy on, easy off for stiff mornings.',
  category: 'beds',
  badges: ['vet-informed'],
  tags: ['calming', 'orthopedic', 'senior'],
  description:
    'Three raised sides for security, one low side for easy in-and-out. Sized to fit a crate or a corner.',
  descriptionHtml: `
    <p>The <strong>Hollow</strong> keeps three bolstered walls for that lean-in comfort, then drops the front edge low so seniors and small dogs can step in without a hop.</p>
    <ul>
      <li><strong>Crate-friendly footprint</strong> — measured to sit neatly inside the Den crate.</li>
      <li><strong>Memory-foam base</strong> — pressure relief for hips and elbows.</li>
      <li><strong>Removable cover</strong> — washes clean, holds its color.</li>
    </ul>
  `,
  featuredImage: bolsterImage,
  images: [bolsterImage],
  options: [
    {
      name: 'Size',
      values: [
        {name: 'Medium', available: true},
        {name: 'Large', available: true},
      ],
    },
    {
      name: 'Color',
      values: [
        {name: 'Oat', swatchColor: '#EADDC8', available: true},
        {name: 'Clay', swatchColor: '#C0664A', available: true},
      ],
    },
  ],
  variants: buildVariants({
    productKey: 'hollow',
    optionMatrix: [
      {name: 'Size', values: ['Medium', 'Large']},
      {name: 'Color', values: ['Oat', 'Clay']},
    ],
    basePrice: 98,
    priceDeltas: {Large: 30},
    image: bolsterImage,
  }),
  specs: [
    {label: 'Base', value: 'Memory foam'},
    {label: 'Cover', value: 'Brushed recycled cotton, removable'},
    {label: 'Sizes', value: 'M (28×20") · L (36×24")'},
  ],
  reviews: {rating: 4.7, count: 88},
  relatedHandles: ['nook-calming-bed', 'den-modern-crate', 'drift-weighted-blanket'],
});

const driftImage = media('drift-blanket', 'Drift weighted calming blanket folded in sage', {
  ground: 'oat',
  object: 'sage',
  shape: 'bed',
});

const driftWeightedBlanket = finalize({
  id: gid('Product', 'drift-weighted-blanket'),
  handle: 'drift-weighted-blanket',
  title: 'Drift Weighted Blanket',
  vendor: 'Lullo',
  subtitle: 'Gentle, even weight — the deep-pressure hug that helps a wired dog switch off.',
  category: 'beds',
  badges: ['new'],
  tags: ['calming', 'anxiety', 'thunderstorm', 'travel'],
  description:
    'A lightly weighted blanket sized for dogs. Deep-pressure stimulation for storms, fireworks, and the 5pm zoomies that won’t quit.',
  descriptionHtml: `
    <p><strong>Drift</strong> uses the same deep-pressure principle as a weighted blanket for people, scaled and made safe for dogs — an even, breathable weight that signals “you can stop now.”</p>
    <ul>
      <li><strong>~8% body-weight guidance</strong> — pick the size that suits your dog (chart on the page).</li>
      <li><strong>Breathable</strong> — glass-bead quilting that won’t overheat.</li>
      <li><strong>Storm-ready</strong> — keep one by the sofa for fireworks season.</li>
    </ul>
  `,
  featuredImage: driftImage,
  images: [driftImage],
  options: [
    {
      name: 'Size',
      values: [
        {name: 'Small', available: true},
        {name: 'Large', available: true},
      ],
    },
  ],
  variants: buildVariants({
    productKey: 'drift',
    optionMatrix: [{name: 'Size', values: ['Small', 'Large']}],
    basePrice: 58,
    priceDeltas: {Large: 16},
    image: driftImage,
  }),
  specs: [
    {label: 'Fill', value: 'Hypoallergenic glass beads'},
    {label: 'Guidance', value: '≈8% of body weight'},
    {label: 'Care', value: 'Machine wash cold'},
  ],
  reviews: {rating: 4.9, count: 61},
  relatedHandles: ['nook-calming-bed', 'still-lick-mat', 'amble-calming-collar'],
});

const forageImage = media('forage-mat', 'Forage snuffle mat in sage with fabric fronds', {
  ground: 'oatDeep',
  object: 'sage',
  shape: 'mat',
});

const forageSnuffleMat = finalize({
  id: gid('Product', 'forage-snuffle-mat'),
  handle: 'forage-snuffle-mat',
  title: 'Forage Snuffle Mat',
  vendor: 'Lullo',
  subtitle: 'Hide the kibble, let the nose work — ten minutes of foraging beats an hour of pacing.',
  category: 'mats',
  badges: ['bestseller'],
  tags: ['enrichment', 'calming', 'slow-feed', 'boredom'],
  description:
    'A dense field of soft fabric fronds to tuck treats into. Sniffing is self-soothing for dogs; this turns a meal into a calm, focused hunt.',
  descriptionHtml: `
    <p>Scattering food into the <strong>Forage</strong> mat taps the most calming thing a dog can do: use its nose. A few minutes of snuffling lowers arousal and leaves them satisfied instead of restless.</p>
    <ul>
      <li><strong>Vet-loved enrichment</strong> — great for crate rest, recovery, and rainy days.</li>
      <li><strong>Grippy backing</strong> — stays put on wood and tile.</li>
      <li><strong>Washable</strong> — machine wash, air dry.</li>
    </ul>
  `,
  featuredImage: forageImage,
  images: [forageImage],
  options: [
    {
      name: 'Color',
      values: [
        {name: 'Sage', swatchColor: '#7E8C6A', available: true},
        {name: 'Clay', swatchColor: '#C0664A', available: true},
      ],
    },
  ],
  variants: buildVariants({
    productKey: 'forage',
    optionMatrix: [{name: 'Color', values: ['Sage', 'Clay']}],
    basePrice: 34,
    image: forageImage,
  }),
  specs: [
    {label: 'Material', value: 'Recycled felt fronds on a grippy base'},
    {label: 'Size', value: '20 × 20"'},
    {label: 'Care', value: 'Machine wash cold'},
  ],
  reviews: {rating: 4.8, count: 302},
  relatedHandles: ['still-lick-mat', 'tide-slow-feeder-bowl', 'nook-calming-bed'],
});

const lickImage = media('still-lick', 'Still lick mat in clay with a wave pattern', {
  ground: 'oat',
  object: 'clay',
  shape: 'mat',
});

const stillLickMat = finalize({
  id: gid('Product', 'still-lick-mat'),
  handle: 'still-lick-mat',
  title: 'Still Lick Mat',
  vendor: 'Lullo',
  subtitle: 'Spread, freeze, done. Licking releases calm — this makes it last.',
  category: 'mats',
  badges: [],
  tags: ['enrichment', 'calming', 'grooming', 'vet-visits'],
  description:
    'A textured silicone mat for wet food, yogurt, or peanut butter. Repetitive licking is soothing — perfect for bath time, nail trims, and being left alone.',
  descriptionHtml: `
    <p>Licking is a self-calming behavior; the <strong>Still</strong> mat stretches it into a few quiet minutes. Smear something soft across it, freeze for longer sessions, and hand your dog a job during the moments that usually stress them.</p>
    <ul>
      <li><strong>Suction base</strong> — sticks to the tub or floor.</li>
      <li><strong>Food-grade silicone</strong> — dishwasher safe.</li>
      <li><strong>Two textures</strong> — Wave for beginners, Honeycomb for a longer challenge.</li>
    </ul>
  `,
  featuredImage: lickImage,
  images: [lickImage],
  options: [
    {
      name: 'Pattern',
      values: [
        {name: 'Wave', available: true},
        {name: 'Honeycomb', available: true},
      ],
    },
  ],
  variants: buildVariants({
    productKey: 'still',
    optionMatrix: [{name: 'Pattern', values: ['Wave', 'Honeycomb']}],
    basePrice: 18,
    image: lickImage,
  }),
  specs: [
    {label: 'Material', value: 'Food-grade silicone'},
    {label: 'Size', value: '8 × 8"'},
    {label: 'Care', value: 'Dishwasher safe'},
  ],
  reviews: {rating: 4.7, count: 176},
  relatedHandles: ['forage-snuffle-mat', 'tide-slow-feeder-bowl', 'amble-calming-collar'],
});

const tideImage = media('tide-bowl', 'Tide slow-feeder bowl in oat with wave ridges', {
  ground: 'oatDeep',
  object: 'oat',
  shape: 'bowl',
});

const tideSlowFeederBowl = finalize({
  id: gid('Product', 'tide-slow-feeder-bowl'),
  handle: 'tide-slow-feeder-bowl',
  title: 'Tide Slow-Feeder Bowl',
  vendor: 'Lullo',
  subtitle: 'Wave ridges that turn a 30-second gulp into a calm, 10-minute meal.',
  category: 'bowls',
  badges: ['vet-informed'],
  tags: ['slow-feed', 'digestion', 'calming'],
  description:
    'Gentle wave ridges slow down fast eaters — better digestion, less bloat, and a dog that isn’t vibrating for the next meal.',
  descriptionHtml: `
    <p>Fast eating means gulped air, bloat risk, and a wired dog. The <strong>Tide</strong>’s soft wave maze makes mealtime a puzzle worth savoring, without the sharp spikes some slow-feeders use.</p>
    <ul>
      <li><strong>Rounded ridges</strong> — slows eating, kind on the tongue.</li>
      <li><strong>Non-slip foot</strong> — no chasing the bowl across the kitchen.</li>
      <li><strong>Dishwasher safe</strong> — top rack.</li>
    </ul>
  `,
  featuredImage: tideImage,
  images: [tideImage],
  options: [
    {
      name: 'Color',
      values: [
        {name: 'Oat', swatchColor: '#EADDC8', available: true},
        {name: 'Clay', swatchColor: '#C0664A', available: true},
        {name: 'Sage', swatchColor: '#7E8C6A', available: true},
      ],
    },
  ],
  variants: buildVariants({
    productKey: 'tide',
    optionMatrix: [{name: 'Color', values: ['Oat', 'Clay', 'Sage']}],
    basePrice: 28,
    image: tideImage,
  }),
  specs: [
    {label: 'Material', value: 'BPA-free plastic'},
    {label: 'Capacity', value: '4 cups'},
    {label: 'Care', value: 'Dishwasher safe (top rack)'},
  ],
  reviews: {rating: 4.6, count: 129},
  relatedHandles: ['forage-snuffle-mat', 'still-lick-mat', 'nook-calming-bed'],
});

const hushImage = media('hush-vest', 'Hush anxiety vest in clay, gentle wrap fit', {
  ground: 'oat',
  object: 'clay',
  shape: 'vest',
});

const hushAnxietyVest = finalize({
  id: gid('Product', 'hush-anxiety-vest'),
  handle: 'hush-anxiety-vest',
  title: 'Hush Anxiety Wrap',
  vendor: 'Lullo',
  subtitle: 'A snug, adjustable wrap that applies calming pressure — like a hand on the shoulder.',
  category: 'vests',
  badges: ['vet-informed', 'bestseller'],
  tags: ['anxiety', 'thunderstorm', 'travel', 'calming'],
  description:
    'Constant, gentle pressure has a measurable calming effect on many dogs. The Hush wrap is easy to fit, breathable, and stays put through storms and car rides.',
  descriptionHtml: `
    <p>The <strong>Hush</strong> works on the same principle as swaddling: steady, even pressure quiets the nervous system. Fit it before the trigger — the vet, the drive, the fireworks — and give your dog a body memory of calm.</p>
    <ul>
      <li><strong>Adjustable</strong> — two wide straps for a precise, comfortable fit.</li>
      <li><strong>Breathable</strong> — light enough for year-round use.</li>
      <li><strong>Measure the chest</strong> — sizing chart on the page; between sizes, size down.</li>
    </ul>
  `,
  featuredImage: hushImage,
  images: [hushImage],
  options: [
    {
      name: 'Size',
      values: [
        {name: 'XS', available: true},
        {name: 'S', available: true},
        {name: 'M', available: true},
        {name: 'L', available: true},
      ],
    },
  ],
  variants: buildVariants({
    productKey: 'hush',
    optionMatrix: [{name: 'Size', values: ['XS', 'S', 'M', 'L']}],
    basePrice: 46,
    image: hushImage,
  }),
  specs: [
    {label: 'Fabric', value: 'Breathable brushed knit'},
    {label: 'Closure', value: 'Dual adjustable straps'},
    {label: 'Fit', value: 'Measure chest girth; size down if between'},
  ],
  reviews: {rating: 4.7, count: 244},
  relatedHandles: ['amble-calming-collar', 'drift-weighted-blanket', 'nook-calming-bed'],
});

const ambleImage = media('amble-collar', 'Amble calming collar in a soft woven band', {
  ground: 'oatDeep',
  object: 'rose',
  shape: 'collar',
});

const ambleCalmingCollar = finalize({
  id: gid('Product', 'amble-calming-collar'),
  handle: 'amble-calming-collar',
  title: 'Amble Calming Collar',
  vendor: 'Lullo',
  subtitle: 'A soft, low-key collar that releases calming botanicals as your dog moves.',
  category: 'collars',
  badges: [],
  tags: ['calming', 'travel', 'everyday'],
  description:
    'A comfortable woven collar infused with calming botanicals (chamomile or lavender). Up to 30 days of gentle, drug-free reassurance.',
  descriptionHtml: `
    <p>The <strong>Amble</strong> keeps calm close all day. Body heat slowly releases a botanical blend chosen for its soothing reputation — no pills, no fuss, just a quieter baseline.</p>
    <ul>
      <li><strong>Up to 30 days</strong> per collar.</li>
      <li><strong>Adjustable + trimmable</strong> — fits necks 8–26".</li>
      <li><strong>Two blends</strong> — Chamomile (daytime) or Lavender (evening).</li>
    </ul>
    <p>Not a medication. For diagnosed anxiety, pair with your vet’s plan.</p>
  `,
  featuredImage: ambleImage,
  images: [ambleImage],
  options: [
    {
      name: 'Scent',
      values: [
        {name: 'Chamomile', available: true},
        {name: 'Lavender', available: true},
      ],
    },
  ],
  variants: buildVariants({
    productKey: 'amble',
    optionMatrix: [{name: 'Scent', values: ['Chamomile', 'Lavender']}],
    basePrice: 24,
    image: ambleImage,
  }),
  specs: [
    {label: 'Duration', value: 'Up to 30 days'},
    {label: 'Fit', value: 'Adjustable + trimmable, 8–26"'},
    {label: 'Note', value: 'Not a medication'},
  ],
  reviews: {rating: 4.5, count: 158},
  relatedHandles: ['hush-anxiety-vest', 'drift-weighted-blanket', 'still-lick-mat'],
});

const denImage = media('den-crate', 'Den modern crate in oak, furniture-grade with a slatted top', {
  ground: 'oat',
  object: 'ink',
  shape: 'crate',
});

const denModernCrate = finalize({
  id: gid('Product', 'den-modern-crate'),
  handle: 'den-modern-crate',
  title: 'Den Modern Crate',
  vendor: 'Lullo',
  subtitle: 'A furniture-grade crate that reads as a side table — a real den, not a cage.',
  category: 'crates',
  badges: ['vet-informed'],
  tags: ['crate-training', 'calming', 'furniture'],
  description:
    'Solid wood, slatted sides, and a top you’ll actually set a lamp on. A calm, enclosed den that earns its place in the room.',
  descriptionHtml: `
    <p>Crate-trained dogs are calmer dogs — a den is a place to switch off, not a punishment. The <strong>Den</strong> makes that den something you’re happy to keep in the living room: furniture-grade wood, a slatted surround for airflow and sight-lines, and a flat top that works as a side table.</p>
    <ul>
      <li><strong>Solid wood</strong> — oak or walnut finish.</li>
      <li><strong>Slatted surround</strong> — airflow, and a dog that can still see you.</li>
      <li><strong>Fits the Hollow bed</strong> — pair for an instant den.</li>
    </ul>
  `,
  featuredImage: denImage,
  images: [denImage],
  options: [
    {
      name: 'Size',
      values: [
        {name: 'Medium', available: true},
        {name: 'Large', available: true},
      ],
    },
    {
      name: 'Finish',
      values: [
        {name: 'Oak', swatchColor: '#C9A26B', available: true},
        {name: 'Walnut', swatchColor: '#5A4632', available: true},
      ],
    },
  ],
  variants: buildVariants({
    productKey: 'den',
    optionMatrix: [
      {name: 'Size', values: ['Medium', 'Large']},
      {name: 'Finish', values: ['Oak', 'Walnut']},
    ],
    basePrice: 220,
    priceDeltas: {Large: 40, Walnut: 20},
    unavailable: ['Large / Walnut'],
    image: denImage,
  }),
  specs: [
    {label: 'Material', value: 'Solid wood + veneer top'},
    {label: 'Sizes', value: 'M (up to 40 lb) · L (up to 70 lb)'},
    {label: 'Assembly', value: 'Tool-light, ~20 min'},
  ],
  reviews: {rating: 4.9, count: 47},
  relatedHandles: ['hollow-bolster-bed', 'nook-calming-bed', 'drift-weighted-blanket'],
});

/** Single (non-bundle) products, in merchandising order. */
export const SINGLE_PRODUCTS: CatalogProduct[] = [
  nookCalmingBed,
  hushAnxietyVest,
  forageSnuffleMat,
  driftWeightedBlanket,
  denModernCrate,
  tideSlowFeederBowl,
  stillLickMat,
  ambleCalmingCollar,
  hollowBolsterBed,
];

/** Bundle definitions. Bundle price is fixed; the saving is computed live. */
export const BUNDLE_SEEDS: Array<{
  seed: ProductSeed;
  price: number;
}> = [
  {
    price: 118,
    seed: {
      id: gid('Product', 'calm-kit-starter'),
      handle: 'calm-kit-starter',
      title: 'The Calm Kit',
      vendor: 'Lullo',
      subtitle: 'Our starter trio: a bed to settle in, a mat to forage, a collar for the in-between.',
      category: 'kits',
      badges: ['bundle', 'bestseller'],
      tags: ['bundle', 'calming', 'gift'],
      description:
        'The three things we’d buy first: the Nook bed, the Forage snuffle mat, and an Amble collar. A calmer baseline in one box.',
      descriptionHtml: `
        <p>If you buy one thing, buy this. <strong>The Calm Kit</strong> pairs a resting place, an enrichment ritual, and all-day reassurance — the trio that moves the needle fastest for an anxious dog.</p>
        <p>Includes the <strong>Nook Calming Bed</strong> (Medium), the <strong>Forage Snuffle Mat</strong>, and an <strong>Amble Calming Collar</strong>.</p>
      `,
      featuredImage: media('calm-kit', 'The Calm Kit — bed, snuffle mat, and collar grouped on oat', {
        ground: 'oatDeep',
        object: 'clay',
        shape: 'kit',
      }),
      images: [
        media('calm-kit', 'The Calm Kit — bed, snuffle mat, and collar grouped on oat', {
          ground: 'oatDeep',
          object: 'clay',
          shape: 'kit',
        }),
      ],
      options: [],
      variants: [
        {
          id: gid('ProductVariant', 'calm-kit-1'),
          title: 'The Calm Kit',
          sku: 'LULLO-KIT-CALM',
          availableForSale: true,
          price: usd(118),
          compareAtPrice: null,
          selectedOptions: [{name: 'Title', value: 'The Calm Kit'}],
          image: null,
        },
      ],
      specs: [{label: 'Includes', value: 'Nook bed (M) · Forage mat · Amble collar'}],
      reviews: {rating: 4.9, count: 96},
      relatedHandles: ['night-owl-kit', 'settle-in-kit'],
      bundle: {
        componentHandles: ['nook-calming-bed', 'forage-snuffle-mat', 'amble-calming-collar'],
      },
    },
  },
  {
    price: 132,
    seed: {
      id: gid('Product', 'settle-in-kit'),
      handle: 'settle-in-kit',
      title: 'The Settle-In Kit',
      vendor: 'Lullo',
      subtitle: 'For the first weeks home — a rescue or a puppy learning that this place is safe.',
      category: 'kits',
      badges: ['bundle'],
      tags: ['bundle', 'new-dog', 'rescue', 'puppy'],
      description:
        'Built for transitions: the Hush wrap for the scary firsts, the Amble collar for baseline calm, a Still lick mat for alone-time, and the Drift blanket for the hard nights.',
      descriptionHtml: `
        <p>The first weeks set the tone. <strong>The Settle-In Kit</strong> gives a new dog four ways to feel safe: pressure, botanicals, a licking ritual, and a weighted place to land.</p>
        <p>Includes the <strong>Hush Anxiety Wrap</strong>, an <strong>Amble Calming Collar</strong>, a <strong>Still Lick Mat</strong>, and the <strong>Drift Weighted Blanket</strong>.</p>
      `,
      featuredImage: media('settle-kit', 'The Settle-In Kit — wrap, collar, lick mat, and blanket on oat', {
        ground: 'oat',
        object: 'sage',
        shape: 'kit',
      }),
      images: [
        media('settle-kit', 'The Settle-In Kit — wrap, collar, lick mat, and blanket on oat', {
          ground: 'oat',
          object: 'sage',
          shape: 'kit',
        }),
      ],
      options: [],
      variants: [
        {
          id: gid('ProductVariant', 'settle-in-kit-1'),
          title: 'The Settle-In Kit',
          sku: 'LULLO-KIT-SETTLE',
          availableForSale: true,
          price: usd(132),
          compareAtPrice: null,
          selectedOptions: [{name: 'Title', value: 'The Settle-In Kit'}],
          image: null,
        },
      ],
      specs: [{label: 'Includes', value: 'Hush wrap · Amble collar · Still mat · Drift blanket'}],
      reviews: {rating: 4.8, count: 39},
      relatedHandles: ['calm-kit-starter', 'night-owl-kit'],
      bundle: {
        componentHandles: [
          'hush-anxiety-vest',
          'amble-calming-collar',
          'still-lick-mat',
          'drift-weighted-blanket',
        ],
      },
    },
  },
  {
    price: 128,
    seed: {
      id: gid('Product', 'night-owl-kit'),
      handle: 'night-owl-kit',
      title: 'The Night-Owl Kit',
      vendor: 'Lullo',
      subtitle: 'For dogs who won’t wind down — a bed, a weighted blanket, and a bedtime ritual.',
      category: 'kits',
      badges: ['bundle'],
      tags: ['bundle', 'sleep', 'calming'],
      description:
        'A wind-down set: the Nook bed to burrow into, the Drift weighted blanket for deep-pressure calm, and a Still lick mat for the pre-sleep ritual.',
      descriptionHtml: `
        <p>Some dogs need a bedtime routine as much as toddlers do. <strong>The Night-Owl Kit</strong> stacks a burrow-in bed, a calming weight, and a licking ritual into one reliable wind-down.</p>
        <p>Includes the <strong>Nook Calming Bed</strong> (Medium), the <strong>Drift Weighted Blanket</strong>, and a <strong>Still Lick Mat</strong>.</p>
      `,
      featuredImage: media('night-kit', 'The Night-Owl Kit — bed, weighted blanket, and lick mat on oat', {
        ground: 'oatDeep',
        object: 'ink',
        shape: 'kit',
      }),
      images: [
        media('night-kit', 'The Night-Owl Kit — bed, weighted blanket, and lick mat on oat', {
          ground: 'oatDeep',
          object: 'ink',
          shape: 'kit',
        }),
      ],
      options: [],
      variants: [
        {
          id: gid('ProductVariant', 'night-owl-kit-1'),
          title: 'The Night-Owl Kit',
          sku: 'LULLO-KIT-NIGHT',
          availableForSale: true,
          price: usd(128),
          compareAtPrice: null,
          selectedOptions: [{name: 'Title', value: 'The Night-Owl Kit'}],
          image: null,
        },
      ],
      specs: [{label: 'Includes', value: 'Nook bed (M) · Drift blanket · Still mat'}],
      reviews: {rating: 4.9, count: 52},
      relatedHandles: ['calm-kit-starter', 'settle-in-kit'],
      bundle: {
        componentHandles: ['nook-calming-bed', 'drift-weighted-blanket', 'still-lick-mat'],
      },
    },
  },
];
