const BADGE_META: Record<string, {label: string; modifier: string}> = {
  new: {label: 'New', modifier: 'badge--new'},
  bestseller: {label: 'Bestseller', modifier: 'badge--bestseller'},
  bundle: {label: 'Bundle', modifier: 'badge--bundle'},
  'vet-informed': {label: 'Vet-informed', modifier: 'badge--vet'},
};

export function Badges({badges, limit}: {badges: string[]; limit?: number}) {
  const shown = typeof limit === 'number' ? badges.slice(0, limit) : badges;
  if (shown.length === 0) return null;
  return (
    <ul className="badges" aria-label="Product labels">
      {shown.map((b) => {
        const meta = BADGE_META[b] ?? {label: b, modifier: ''};
        return (
          <li key={b}>
            <span className={`badge ${meta.modifier}`}>{meta.label}</span>
          </li>
        );
      })}
    </ul>
  );
}
