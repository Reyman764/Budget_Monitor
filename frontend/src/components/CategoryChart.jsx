import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';
import { MoneyTooltip, useChartTheme } from '../utils/chartTheme';
import { money } from '../utils/format';

// Past six slices a pie stops being readable, so the tail is collected into one.
const TOP_N = 6;

export default function CategoryChart({ transactions, currency = 'NPR' }) {
  const { categorical } = useChartTheme();

  const byCategory = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc.set(t.category, (acc.get(t.category) || 0) + parseFloat(t.amount));
      return acc;
    }, new Map());

  const sorted = [...byCategory.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const tail = sorted.slice(TOP_N);
  const data = tail.length
    ? [
        ...sorted.slice(0, TOP_N),
        { name: `${tail.length} smaller categories`, value: tail.reduce((s, d) => s + d.value, 0) }
      ]
    : sorted;

  const total = sorted.reduce((s, d) => s + d.value, 0);

  return (
    <ChartCard
      title="Where it went"
      description="Expenses by category"
      isEmpty={data.length === 0}
      emptyMessage="Log an expense and the split will appear here."
    >
      <div className="relative">
        <ResponsiveContainer width="100%" height={228}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((d, i) => (
                <Cell key={d.name} fill={categorical[i % categorical.length]} />
              ))}
            </Pie>
            <Tooltip content={<MoneyTooltip currency={currency} />} />
          </PieChart>
        </ResponsiveContainer>

        {/* The figure the ring is a breakdown of. */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="eyebrow">Spent</p>
          <p className="tnum font-display mt-1 text-[1.375rem] font-semibold tracking-[-0.025em] text-ink">
            {money(total, currency, { decimals: false })}
          </p>
        </div>
      </div>

      {/* Our own legend: recharts' version can't show the amounts, which are the
          reason anyone reads a category breakdown. */}
      <ul className="mt-5 space-y-2.5">
        {data.map((d, i) => (
          <li key={d.name} className="flex items-center gap-2.5 text-[0.8125rem]">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: categorical[i % categorical.length] }}
            />
            <span className="min-w-0 flex-1 truncate text-ink-soft">{d.name}</span>
            <span className="tnum shrink-0 text-ink-mute">
              {total > 0 ? Math.round((d.value / total) * 100) : 0}%
            </span>
            <span className="tnum w-24 shrink-0 text-right font-medium text-ink">
              {money(d.value, currency, { decimals: false })}
            </span>
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}
