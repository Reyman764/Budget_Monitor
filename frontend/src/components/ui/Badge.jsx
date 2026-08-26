const TONES = {
  neutral: 'bg-sunken text-ink-soft',
  sage: 'bg-sage-soft text-sage',
  moss: 'bg-moss-soft text-moss',
  clay: 'bg-clay-soft text-clay',
  honey: 'bg-honey-soft text-honey',
  outline: 'border border-line text-ink-mute'
};

/** A small status word. Never more than two or three per screen. */
export default function Badge({ tone = 'neutral', icon, className = '', children, ...rest }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold tracking-[0.02em] ${
        TONES[tone] ?? TONES.neutral
      } ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </span>
  );
}
