import { SectionCard } from './ui/Card';
import EmptyState from './ui/EmptyState';
import { ExpenseIcon, IncomeIcon, ReviewIcon } from './icons';
import { money, monthLabel } from '../utils/format';

export default function MonthComparison({ current, previous, currency = 'NPR' }) {
  if (!current || !previous) {
    return (
      <SectionCard title="Against last month">
        <EmptyState icon={<ReviewIcon />} title="Nothing to compare yet" className="py-8">
          Once there are two months of history, the change in each figure shows up here.
        </EmptyState>
      </SectionCard>
    );
  }

  const rows = [
    {
      label: 'Money in',
      prev: previous.totalIncome,
      curr: current.totalIncome,
      diff: current.totalIncome - previous.totalIncome,
      goodIsUp: true
    },
    {
      label: 'Money out',
      prev: previous.totalExpense,
      curr: current.totalExpense,
      diff: current.totalExpense - previous.totalExpense,
      goodIsUp: false
    },
    {
      label: 'Left over',
      prev: previous.netBalance,
      curr: current.netBalance,
      diff: current.netBalance - previous.netBalance,
      goodIsUp: true
    }
  ];

  return (
    <SectionCard
      title="Against last month"
      description={`${monthLabel(current.month, { short: true })} compared with ${monthLabel(
        previous.month,
        { short: true }
      )}`}
      bodyClassName="divide-y divide-line"
    >
      {rows.map((row) => {
        // Whether a change is good depends on the row: spending less is an
        // improvement, earning less is not.
        const improved = row.goodIsUp ? row.diff >= 0 : row.diff <= 0;
        const flat = Math.round(row.diff) === 0;
        const Arrow = row.diff >= 0 ? ExpenseIcon : IncomeIcon;

        return (
          <div key={row.label} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
            <div className="min-w-0">
              <p className="text-[0.9375rem] font-medium text-ink">{row.label}</p>
              <p className="tnum mt-0.5 text-[0.8125rem] text-ink-mute">
                {money(row.prev, currency, { decimals: false })}
                <span className="mx-1.5 text-ink-mute">→</span>
                <span className="font-medium text-ink-soft">
                  {money(row.curr, currency, { decimals: false })}
                </span>
              </p>
            </div>

            <p
              className={`tnum inline-flex shrink-0 items-center gap-1.5 text-[0.9375rem] font-semibold ${
                flat ? 'text-ink-mute' : improved ? 'text-moss' : 'text-clay'
              }`}
            >
              {!flat && <Arrow className="h-4 w-4" />}
              {flat ? 'No change' : money(Math.abs(row.diff), currency, { decimals: false })}
            </p>
          </div>
        );
      })}
    </SectionCard>
  );
}
