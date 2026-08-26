/**
 * What a screen shows before there's any data. An empty state is an invitation
 * to act, so it names the next step rather than just reporting the absence.
 */
export default function EmptyState({ icon, title, children, action, className = '' }) {
  return (
    <div className={`flex flex-col items-center px-6 py-12 text-center ${className}`}>
      {icon && (
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sunken text-ink-mute">
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
