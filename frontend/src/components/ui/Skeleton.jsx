/**
 * Loading placeholders shaped like the content they'll become, so a slow
 * request doesn't flash an empty panel that then pops the real layout in —
 * the shape is already there, just filled with a muted pulse.
 *
 * The pulsing bars are decorative (aria-hidden); the caller wraps them in a
 * container carrying `role="status"` and a real label, same as `Loader`.
 */

export function SkeletonBar({ className = '', style }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-full bg-sunken ${className}`} style={style} />;
}

/** Rows shaped like a transaction/bill list item: icon, two lines, amount. */
export function SkeletonRows({ count = 4, label = 'Loading' }) {
  return (
    <ul role="status" aria-label={label} className="space-y-1">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="flex items-center gap-3.5 px-2 py-2.5">
          <SkeletonBar className="h-9 w-9 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1 space-y-2">
            <SkeletonBar className="h-3.5 w-[42%]" />
            <SkeletonBar className="h-3 w-[24%]" />
          </div>
          <SkeletonBar className="h-4 w-14 shrink-0" />
        </li>
      ))}
    </ul>
  );
}

/** Cards shaped like a goal tracker card: title, meter, amounts. */
export function SkeletonCards({ count = 2, label = 'Loading' }) {
  return (
    <div role="status" aria-label={label} className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card space-y-4 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <SkeletonBar className="h-4 w-[36%]" />
            <SkeletonBar className="h-6 w-12 shrink-0" />
          </div>
          <SkeletonBar className="h-2.5 w-full rounded-full" />
          <SkeletonBar className="h-3 w-[28%]" />
        </div>
      ))}
    </div>
  );
}

/** A simple bar-chart silhouette for chart panels still fetching data. */
export function SkeletonChart({ label = 'Loading' }) {
  const heights = [38, 62, 28, 74, 50, 66, 42, 58];
  return (
    <div role="status" aria-label={label} className="flex h-52 items-end gap-2 px-1 py-4">
      {heights.map((h, i) => (
        <SkeletonBar key={i} className="flex-1 rounded-t-md" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}
