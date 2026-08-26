import Badge from './ui/Badge';
import Meter, { meterTone } from './ui/Meter';
import { SectionCard } from './ui/Card';
import EmptyState from './ui/EmptyState';
import { CoinsIcon } from './icons';
import { money } from '../utils/format';

export default function CategoryBudgetTable({ budgets, currency = 'NPR' }) {
  if (budgets.length === 0) {
    return (
      <SectionCard title="Category by category">
        <EmptyState icon={<CoinsIcon />} title="No limits set for this month" className="py-8">
          Set a limit per category in settings to see how each one tracked.
        </EmptyState>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Category by category"
      description="Limit, spent, and what's left in each"
      bodyClassName="-mx-1 overflow-x-auto px-1"
    >
      <table className="w-full min-w-[34rem] border-collapse text-left">
        <thead>
          <tr className="border-b border-line">
            {['Category', 'Limit', 'Spent', 'Left', 'Used'].map((heading, i) => (
              <th
                key={heading}
                scope="col"
                className={`pb-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-ink-mute ${
                  i === 0 ? 'pr-3' : 'px-3'
                } ${i > 0 && i < 4 ? 'text-right' : ''}`}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {budgets.map((b) => (
            <tr key={b.id}>
              <td className="py-3 pr-3">
                <div className="flex items-center gap-2">
                  <span className="text-[0.9375rem] font-medium text-ink">{b.category}</span>
                  {b.percentageUsed >= 100 && <Badge tone="clay">Over</Badge>}
                </div>
              </td>
              <td className="tnum px-3 py-3 text-right text-[0.875rem] text-ink-soft">
                {money(b.limitAmount, currency, { decimals: false })}
              </td>
              <td className="tnum px-3 py-3 text-right text-[0.875rem] text-ink-soft">
                {money(b.spent, currency, { decimals: false })}
              </td>
              <td
                className={`tnum px-3 py-3 text-right text-[0.875rem] font-semibold ${
                  b.remaining < 0 ? 'text-clay' : 'text-ink'
                }`}
              >
                {money(b.remaining, currency, { decimals: false })}
              </td>
              <td className="py-3 pl-3">
                <div className="flex items-center gap-2.5">
                  <Meter
                    percent={b.percentageUsed}
                    size="sm"
                    className="w-20 shrink-0"
                    label={`${b.category} budget used`}
                  />
                  <span
                    className={`tnum w-10 shrink-0 text-right text-[0.8125rem] font-semibold ${
                      meterTone(b.percentageUsed) === 'clay'
                        ? 'text-clay'
                        : meterTone(b.percentageUsed) === 'honey'
                          ? 'text-honey'
                          : 'text-ink-soft'
                    }`}
                  >
                    {b.percentageUsed}%
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionCard>
  );
}
