/**
 * The waiting state, built from the logo's three bars so a slow request looks
 * like part of the app rather than a borrowed spinner.
 */
export default function Loader({ label = 'Loading', full = false, className = '' }) {
  const bars = (
    <span className="flex items-end gap-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 animate-pulse rounded-full bg-sage"
          style={{ height: `${0.75 + i * 0.45}rem`, animationDelay: `${i * 140}ms` }}
        />
      ))}
    </span>
  );

  return (
    <div
      className={`flex items-center justify-center gap-3 ${
        full ? 'min-h-screen bg-canvas' : 'py-16'
      } ${className}`}
      role="status"
    >
      {bars}
      <span className="text-[0.875rem] text-ink-mute">{label}</span>
    </div>
  );
}
