import { money, monthLabel, savingsRate } from '../utils/format';
import Meter from './ui/Meter';
import { CoinsIcon, ExpenseIcon, IncomeIcon } from './icons';

const PILL_TONES = {
  moss: 'bg-moss-soft text-moss',
  clay: 'bg-clay-soft text-clay'
};

function Pill({ tone, icon, label, value }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 rounded-full px-3.5 py-2 ${PILL_TONES[tone]}`}
    >
      {icon}
      <span className="text-[0.6875rem] font-semibold tracking-[0.1em] uppercase opacity-75">
        {label}
      </span>
      <span className="tnum text-[0.9375rem] font-semibold">{value}</span>
    </span>
  );
}

/**
 * The dashboard's opening statement: what's left, and the two figures that got
 * you there. Everything else on the page is a detail of this one number, so it
 * gets the display face at full size and the rest of the card stays quiet.
 */
export default function BalanceHero({ month, income, expense, balance, currency, netWorth }) {
  const spentPct = income > 0 ? Math.min(100, (expense / income) * 100) : 0;
  const kept = savingsRate(income, expense);
  const over = balance < 0;

  return (
    <section className="card rise overflow-hidden rounded-hero" aria-label="This month at a glance">
      <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
        <div>
          <p className="eyebrow">{monthLabel(month)}</p>

          <p
            className={`tnum font-display mt-3 text-[2.625rem] leading-none font-semibold tracking-[-0.04em] sm:text-[3.5rem] ${
              over ? 'text-clay' : 'text-ink'
            }`}
          >
            {money(balance, currency, { decimals: false })}
          </p>
          <p className="mt-2.5 text-[0.9375rem] text-ink-mute">
            {over ? 'over what came in this month' : 'left to spend this month'}
          </p>

          {/* How much of what came in has already gone out — sage while there's
              room, honey near the line, clay once spending passes income. */}
          <div className="mt-7">
            <Meter percent={spentPct} label={`${Math.round(spentPct)}% of income spent`} />
            <div className="mt-2.5 flex items-center justify-between text-[0.75rem] text-ink-mute">
              <span className="tnum">
                {income > 0 ? `${Math.round(spentPct)}% of income spent` : 'No income recorded yet'}
              </span>
              {kept !== null && kept > 0 && <span className="tnum">{kept}% kept</span>}
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-2.5">
            <Pill
              tone="moss"
              icon={<IncomeIcon className="h-4 w-4" />}
              label="In"
              value={money(income, currency, { decimals: false })}
            />
            <Pill
              tone="clay"
              icon={<ExpenseIcon className="h-4 w-4" />}
              label="Out"
              value={money(expense, currency, { decimals: false })}
            />
          </div>
        </div>

        <div className="flex flex-col justify-center gap-6 border-t border-line pt-7 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
          {netWorth && (
            <div>
              <div className="flex items-center gap-2 text-ink-mute">
                <CoinsIcon className="h-4 w-4" />
                <p className="eyebrow">Net worth</p>
              </div>
              <p className="tnum font-display mt-2 text-[1.625rem] font-semibold tracking-[-0.025em] text-ink">
                {money(netWorth.netWorth, currency, { decimals: false })}
              </p>
              <p className="mt-1 text-[0.75rem] text-ink-mute">
                Everything in, minus everything out, since you started.
              </p>
            </div>
          )}

          <div>
            <p className="eyebrow">Kept this month</p>
            <p
              className={`tnum font-display mt-2 text-[1.625rem] font-semibold tracking-[-0.025em] ${
                kept === null ? 'text-ink-mute' : kept >= 0 ? 'text-moss' : 'text-clay'
              }`}
            >
              {kept === null ? '—' : `${kept}%`}
            </p>
            <p className="mt-1 text-[0.75rem] text-ink-mute">
              {kept === null
                ? 'Add income to see your savings rate.'
                : `${money(balance, currency, { decimals: false })} of ${money(income, currency, {
                    decimals: false
                  })}`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
