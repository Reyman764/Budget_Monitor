/**
 * What a screen shows before there's any data. An empty state is an invitation
 * to act, so it names the next step rather than just reporting the absence —
 * a warm accent-tinted badge instead of a flat grey one keeps it feeling like
 * a starting point rather than a dead end.
 */
export default function EmptyState({ icon, title, children, action, className = '' }) {
  return (
    <div className={`flex flex-col items-center px-6 py-14 text-center ${className}`}>
      {icon && (
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sage-soft text-sage">
          {icon}
        </span>
      )}
      <p className="font-display text-[1.0625rem] font-semibold text-ink">{title}</p>
      {children && (
        <p className="mx-auto mt-1.5 max-w-sm text-[0.875rem] leading-relaxed text-ink-mute">
          {children}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
