const BASE =
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium ' +
  'transition-[background-color,border-color,color,box-shadow,opacity] duration-150 ' +
  'active:translate-y-px disabled:pointer-events-none disabled:opacity-45';

const VARIANTS = {
  /** The one filled button on a screen — the primary action. */
  primary: 'bg-sage text-on-sage shadow-card hover:bg-sage-hover',
  /** Everything else that still needs an edge. */
  secondary: 'border border-line bg-surface text-ink hover:bg-sunken',
  /** Tinted, for secondary actions inside an already-busy card. */
  soft: 'bg-sage-soft text-sage hover:bg-sage/15',
  /** No chrome until hovered. */
  ghost: 'text-ink-soft hover:bg-sunken hover:text-ink',
  /** Destructive, kept quiet until you reach for it. */
  danger: 'text-clay hover:bg-clay-soft'
};

const SIZES = {
  sm: 'h-9 px-3.5 text-[0.8125rem]',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-[0.9375rem]'
};

const ICON_SIZES = {
  sm: 'h-9 w-9',
  md: 'h-11 w-11',
  lg: 'h-12 w-12'
};

export default function Button({
  as: As = 'button',
  variant = 'secondary',
  size = 'md',
  iconOnly = false,
  full = false,
  className = '',
  type,
  ...rest
}) {
  const classes = [
    BASE,
    VARIANTS[variant] ?? VARIANTS.secondary,
    iconOnly ? ICON_SIZES[size] : SIZES[size],
    full && 'w-full',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <As className={classes} {...(As === 'button' ? { type: type ?? 'button' } : {})} {...rest} />
  );
}
