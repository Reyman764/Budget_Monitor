import { Link } from 'react-router-dom';

// Warning banner shown on the Dashboard when one or more categories are
// at/over the 80% budget threshold. Renders nothing when there's nothing to flag.
export default function BudgetAlerts({ budgets }) {
  const alerts = budgets.filter((b) => b.alert);
  if (alerts.length === 0) return null;

  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
      <div className="flex items-start gap-3">
        <span className="text-xl" aria-hidden>⚠️</span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-amber-800 dark:text-amber-200">
            {alerts.length} budget{alerts.length !== 1 ? 's' : ''} near or over the limit
          </p>
          <ul className="mt-1 space-y-0.5 text-sm text-amber-700 dark:text-amber-300">
            {alerts.map((b) => (
              <li key={b.id}>
                {b.category}: {b.percentageUsed}% used{b.percentageUsed >= 100 ? ' — over budget' : ''}
              </li>
            ))}
          </ul>
          <Link
            to="/settings"
            className="mt-2 inline-block text-sm font-medium text-amber-800 underline hover:text-amber-900 dark:text-amber-200 dark:hover:text-amber-100"
          >
            Review budgets →
          </Link>
        </div>
      </div>
    </div>
  );
}
