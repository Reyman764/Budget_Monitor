const TONES = {
  ink: 'text-ink',
  moss: 'text-moss',
  clay: 'text-clay',
  sage: 'text-sage',
  honey: 'text-honey'
};

/**
 * One labelled figure. Label above, amount below in tabular numerals so a row
 * of these doesn't shift as the digits change.
 */
export default function Stat({
  label,
  value,
  hint,
  icon,
  tone = 'ink',
  size = 'md',
  className = ''
}) {
  const valueSize = size === 'lg' ? 'text-[1.75rem]' : size === 'sm' ? 'text-[1.0625rem]' : 'text-[1.375rem]';

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        {icon && <span className="text-ink-mute">{icon}</span>}
        <p className="eyebrow">{label}</p>
      </div>
      <p
        className={`tnum font-display mt-2 font-semibold tracking-[-0.02em] ${valueSize} ${
          TONES[tone] ?? TONES.ink
        }`}
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-[0.75rem] text-ink-mute">{hint}</p>}
    </div>
  );
}
