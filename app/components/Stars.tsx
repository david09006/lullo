import type {ProductReviewSummary} from '~/lib/catalog/types';

export function Stars({
  reviews,
  showCount = true,
  className,
}: {
  reviews: ProductReviewSummary;
  showCount?: boolean;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (reviews.rating / 5) * 100));
  const label = `${reviews.rating.toFixed(1)} out of 5 stars${
    showCount ? `, ${reviews.count} reviews` : ''
  }`;
  return (
    <span className={`stars ${className ?? ''}`} role="img" aria-label={label}>
      <span className="stars__glyphs" style={{['--pct' as string]: `${pct}%`}} aria-hidden="true" />
      {showCount ? (
        <span className="stars__count" aria-hidden="true">
          {reviews.rating.toFixed(1)} ({reviews.count})
        </span>
      ) : null}
    </span>
  );
}
