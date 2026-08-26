/**
 * The single card treatment. `.card` lives in index.css so the light-mode
 * shadow / dark-mode hairline swap happens in one place.
 */
export function Card({ as: As = 'div', className = '', padded = true, ...rest }) {
  return <As className={`card ${padded ? 'p-5 sm:p-6' : ''} ${className}`} {...rest} />;
}

/**
 * A card with a title row. `action` sits opposite the title — usually a link or
 * a small button. `description` is for the one line of context a title can't
 * carry on its own; leave it off rather than padding it out.
 */
export function SectionCard({
  title,
  description,
  action,
  icon,
  children,
  className = '',
  bodyClassName = '',
  padded = true
}) {
  return (
    <Card className={className} padded={padded}>
      {(title || action) && (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            {icon && (
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sunken text-ink-soft">
                {icon}
              </span>
            )}
            <div className="min-w-0">
              <h2 className="truncate text-[1.0625rem] font-semibold text-ink">{title}</h2>
              {description && (
                <p className="mt-0.5 text-[0.8125rem] leading-snug text-ink-mute">{description}</p>
              )}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </Card>
  );
}

export default Card;
