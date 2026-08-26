import { AlertIcon, CheckCircleIcon, InfoIcon } from '../icons';

const TONES = {
  info: {
    wrap: 'border-line bg-sunken',
    icon: 'text-ink-soft',
    Icon: InfoIcon
  },
  warn: {
    wrap: 'border-honey/30 bg-honey-soft',
    icon: 'text-honey',
    Icon: AlertIcon
  },
  error: {
    wrap: 'border-clay/30 bg-clay-soft',
    icon: 'text-clay',
    Icon: AlertIcon
  },
  success: {
    wrap: 'border-moss/30 bg-moss-soft',
    icon: 'text-moss',
    Icon: CheckCircleIcon
  }
};

/**
 * An inline message: form errors, budget warnings, confirmations. Says what
 * happened and, where there's something to do about it, carries the action.
 */
export default function Callout({
  tone = 'info',
  title,
  icon,
  action,
  className = '',
  children,
  ...rest
}) {
  const t = TONES[tone] ?? TONES.info;
  const Glyph = t.Icon;

  return (
    <div
      className={`flex items-start gap-3 rounded-card border px-4 py-3.5 ${t.wrap} ${className}`}
      role={tone === 'error' ? 'alert' : undefined}
      {...rest}
    >
      <span className={`mt-px shrink-0 ${t.icon}`}>{icon ?? <Glyph className="h-[1.15rem] w-[1.15rem]" />}</span>
      <div className="min-w-0 flex-1 text-[0.875rem] leading-snug">
        {title && <p className="font-semibold text-ink">{title}</p>}
        {children && <div className={`text-ink-soft ${title ? 'mt-0.5' : ''}`}>{children}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
