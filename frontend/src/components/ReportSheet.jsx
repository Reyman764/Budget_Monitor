import { Card } from './ui/Card';
import Stat from './ui/Stat';
import Meter from './ui/Meter';
import { money, monthLabel, savingsRate } from '../utils/format';

/**
 * The masthead the monthly review and the shared read-only report both open
 * with: whose ledger, which month, and the three figures the rest of the page
 * explains. Kept out of a nested card so it prints as one clean sheet.
 */
export default function ReportSheet({
  householdName,
  month,
  income,
  expense,
  net,
  currency = 'NPR',
  note,
  children
}) {
  const kept = savingsRate(income, expense);
  const spentPct = income > 0 ? Math.min(100, (expense / income) * 100) : 0;
  const over = net < 0;

  return (
    <div className="space-y-6">
      <Card className="p-6 sm:p-8">
        <div className="border-b border-line pb-6">
          <p className="eyebrow">Monthly review</p>
          <h1 className="font-display mt-2 text-[2rem] leading-[1.1] font-semibold text-ink sm:text-[2.5rem]">
            {monthLabel(month)}
          </h1>
          <p className="mt-2 text-[0.9375rem] text-ink-soft">
            {householdName || 'Household'}
            {note ? <span className="text-ink-mute"> · {note}</span> : null}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 pt-6 sm:grid-cols-3">
          <Stat label="Money in" value={money(income, currency, { decimals: false })} tone="moss" size="lg" />
          <Stat label="Money out" value={money(expense, currency, { decimals: false })} tone="clay" size="lg" />
          <Stat
            label={over ? 'Overspent by' : 'Left over'}
            value={money(Math.abs(net), currency, { decimals: false })}
            tone={over ? 'clay' : 'ink'}
            size="lg"
            hint={kept !== null ? `${kept}% of income kept` : undefined}
          />
        </div>

        {income > 0 && (
          <div className="mt-7">
            <Meter percent={spentPct} tone={over ? 'clay' : 'sage'} />
            <p className="mt-2.5 text-[0.8125rem] text-ink-mute">
              {over
                ? 'Spending ran past everything that came in this month.'
                : `${Math.round(spentPct)}% of what came in went back out.`}
            </p>
          </div>
        )}
      </Card>

      {children}
    </div>
  );
}
