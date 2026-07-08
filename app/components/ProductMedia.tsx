import type {CatalogImage} from '~/lib/catalog/types';
import {PALETTE} from '~/lib/theme';

/**
 * On-brand product media. When `image.url` is a real photo it renders an <img>;
 * otherwise it draws a deterministic SVG treatment (consistent 4:5 framing, soft
 * shadow, oat ground, brand-tinted silhouette per category).
 *
 * SWAP POINT: once real photography exists, set `image.url` (or map it from the
 * Storefront API) and this component renders the photo automatically.
 */
export function ProductMedia({
  image,
  className,
  sizes = '(min-width: 768px) 33vw, 100vw',
  eager = false,
}: {
  image: CatalogImage | null | undefined;
  className?: string;
  sizes?: string;
  eager?: boolean;
}) {
  const alt = image?.altText ?? 'Lullo product';

  if (image?.url) {
    return (
      <img
        className={className}
        src={image.url}
        alt={alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    );
  }

  const t = image?.treatment ?? {ground: 'oatDeep', object: 'clay', shape: 'bed'};
  return (
    <svg
      className={className}
      viewBox="0 0 400 500"
      role="img"
      aria-label={alt}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="400" height="500" fill={PALETTE[t.ground]} />
      {/* soft contact shadow */}
      <ellipse cx="200" cy="372" rx="126" ry="26" fill={PALETTE.ink} opacity="0.12" />
      <Silhouette shape={t.shape} fill={PALETTE[t.object]} />
    </svg>
  );
}

function Silhouette({shape, fill}: {shape: string; fill: string}) {
  const ink = PALETTE.ink;
  switch (shape) {
    case 'bed':
      return (
        <g>
          <ellipse cx="200" cy="300" rx="140" ry="86" fill={fill} />
          <ellipse cx="200" cy="292" rx="96" ry="52" fill={ink} opacity="0.14" />
        </g>
      );
    case 'mat':
      return (
        <g>
          <rect x="70" y="220" width="260" height="150" rx="20" fill={fill} />
          {[110, 160, 210, 260, 300].map((cx) =>
            [250, 290, 330].map((cy) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="8" fill={ink} opacity="0.16" />
            )),
          )}
        </g>
      );
    case 'bowl':
      return (
        <g>
          <path d="M96 268 Q200 250 304 268 L286 340 Q200 372 114 340 Z" fill={fill} />
          <ellipse cx="200" cy="270" rx="104" ry="22" fill={ink} opacity="0.16" />
        </g>
      );
    case 'vest':
      return (
        <g>
          <path
            d="M150 214 L250 214 L280 250 L262 356 Q200 372 138 356 L120 250 Z"
            fill={fill}
          />
          <path d="M186 214 Q200 236 214 214 Z" fill={ink} opacity="0.18" />
        </g>
      );
    case 'collar':
      return (
        <g>
          <circle cx="200" cy="300" r="96" fill="none" stroke={fill} strokeWidth="34" />
          <rect x="188" y="196" width="24" height="26" rx="5" fill={ink} opacity="0.25" />
        </g>
      );
    case 'crate':
      return (
        <g>
          <rect x="96" y="214" width="208" height="150" rx="14" fill={fill} />
          {[130, 164, 198, 232, 266].map((x) => (
            <rect key={x} x={x} y="230" width="8" height="118" rx="4" fill={ink} opacity="0.16" />
          ))}
        </g>
      );
    case 'kit':
      return (
        <g>
          <ellipse cx="168" cy="316" rx="104" ry="60" fill={fill} />
          <rect x="196" y="228" width="128" height="86" rx="16" fill={ink} opacity="0.18" />
          <circle cx="150" cy="238" r="34" fill={PALETTE.rose} />
        </g>
      );
    default:
      return <ellipse cx="200" cy="300" rx="130" ry="80" fill={fill} />;
  }
}
