// Visual bar showing spend (or goal progress) against a target.
// Color follows the same red/amber/green convention as the category
// breakdown table: >=100% red, >=80% amber, else green.
export default function BudgetProgressBar({ percentageUsed = 0 }) {
  const pct = Math.min(Math.max(percentageUsed, 0), 100);
  const barColor =
    percentageUsed >= 100 ? 'bg-red-500' : percentageUsed >= 80 ? 'bg-amber-500' : 'bg-green-500';

  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700"
      role="progressbar"
      aria-valuenow={Math.round(percentageUsed)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={`h-2 rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
    </div>
  );
}
