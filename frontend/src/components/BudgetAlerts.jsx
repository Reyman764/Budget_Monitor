import { Link } from 'react-router-dom';
import Button from './ui/Button';
import Callout from './ui/Callout';
import Meter from './ui/Meter';
import { ArrowRightIcon } from './icons';
import { money } from '../utils/format';

/**
 * Shown on the Dashboard when a category is at or over 80% of its limit. Names
 * the categories and how far each one has gone, so the next step is obvious
 * without opening Settings first. Renders nothing when there's nothing to flag.
 */
export default function BudgetAlerts({ budgets, currency = 'NPR' }) {
  const alerts = budgets.filter((b) => b.alert);
  if (alerts.length === 0) return null;

  const over = alerts.filter((b) => b.percentageUsed >= 100);
  const title = over.length
    ? `${over.length} ${over.length === 1 ? 'category is' : 'categories are'} over budget`
    : `${alerts.length} ${alerts.length === 1 ? 'budget is' : 'budgets are'} close to the limit`;

  return (
    <Callout
      tone={over.length ? 'error' : 'warn'}
      title={title}
      className="rise"
      action={
        <Button as={Link} to="/settings" variant="secondary" size="sm">
          Review budgets
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
      }
    >
      <ul className="mt-2.5 space-y-2.5">
        {alerts.map((b) => (
          <li key={b.id} className="flex items-center gap-3">
            <span className="w-28 shrink-0 truncate text-[0.8125rem] font-medium text-ink">
              {b.category}
            </span>
            <Meter
              percent={b.percentageUsed}
              size="sm"
              className="max-w-40"
              label={`${b.category} budget used`}
            />
            <span className="tnum shrink-0 text-[0.8125rem] font-semibold text-ink-soft">
              {b.percentageUsed}%
            </span>
            <span className="tnum ml-auto hidden shrink-0 text-[0.75rem] text-ink-mute sm:block">
              {b.remaining < 0
                ? `${money(Math.abs(b.remaining), currency, { decimals: false })} over`
                : `${money(b.remaining, currency, { decimals: false })} left`}
            </span>
          </li>
        ))}
      </ul>
    </Callout>
  );
}
