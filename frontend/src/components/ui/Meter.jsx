const FILLS = {
  sage: 'bg-sage',
  moss: 'bg-moss',
  clay: 'bg-clay',
  honey: 'bg-honey'
};

const HEIGHTS = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-3.5'
};

/** Over budget, close to it, or fine — the three states worth colouring. */
export function meterTone(percent) {
  if (percent >= 100) return 'clay';
  if (percent >= 80) return 'honey';
  return 'sage';
}

/**
 * A horizontal progress track. Used for category budgets, goal progress and the
 * dashboard's allocation ribbon, so the fill animates from wherever it was.
 */
export default function Meter({
  percent = 0,
  tone,
  size = 'md',
  label,
  className = '',
  showRail = true
}) {
  const clamped = Math.max(0, Math.min(100, Number(percent) || 0));
  const fill = FILLS[tone ?? meterTone(clamped)] ?? FILLS.sage;

  return (
    <div
      className={`${HEIGHTS[size]} w-full overflow-hidden rounded-full ${
        showRail ? 'bg-sunken' : ''
      } ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        className={`h-full rounded-full ${fill} transition-[width] duration-500 ease-out`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
