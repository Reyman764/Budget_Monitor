/**
 * Every page opens the same way: a small eyebrow saying where you are, the
 * title in the display face, and the page's actions on the right.
 */
export default function PageHeader({ eyebrow, title, description, actions, className = '' }) {
  return (
    <header className={`flex flex-wrap items-end justify-between gap-x-6 gap-y-4 ${className}`}>
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h1 className="font-display text-[1.75rem] leading-[1.15] font-semibold text-ink sm:text-[2rem]">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-xl text-[0.9375rem] leading-relaxed text-ink-mute">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}
