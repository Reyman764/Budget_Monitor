import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer
} from 'recharts';
import ChartCard from './ChartCard';
import { MoneyTooltip, useChartTheme } from '../utils/chartTheme';
import { dateLabel, money } from '../utils/format';

export default function TrendChart({ transactions, currency = 'NPR' }) {
  const theme = useChartTheme();

  const byDay = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      const date = new Date(t.date).toISOString().slice(0, 10);
      acc.set(date, (acc.get(date) || 0) + parseFloat(t.amount));
      return acc;
    }, new Map());

  const data = [...byDay.entries()]
    .map(([date, amount]) => ({ date, amount, label: String(Number(date.slice(8, 10))) }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const average = data.length ? data.reduce((s, d) => s + d.amount, 0) / data.length : 0;

  return (
    <ChartCard
      title="Day by day"
      description={
        data.length
          ? `Averaging ${money(average, currency, { decimals: false })} on the days you spent`
          : 'Daily expenses'
      }
      isEmpty={data.length === 0}
      emptyMessage="Once there are expenses, the daily shape of the month shows up here."
    >
      <ResponsiveContainer width="100%" height={288}>
        <AreaChart data={data} margin={{ top: 8, right: 6, bottom: 0, left: -12 }}>
          <defs>
            <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.palette.expense} stopOpacity={0.22} />
              <stop offset="100%" stopColor={theme.palette.expense} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid {...theme.grid} />
          <XAxis dataKey="label" {...theme.axis} interval="preserveStartEnd" minTickGap={14} />
          <YAxis {...theme.axis} tickFormatter={theme.tickFormatter} width={56} />

          {/* The average is the line that makes a spike mean something. */}
          {average > 0 && (
            <ReferenceLine
              y={average}
              stroke={theme.palette.axis}
              strokeDasharray="4 4"
              ifOverflow="extendDomain"
            />
          )}

          <Tooltip
            content={
              <MoneyTooltip
                currency={currency}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.date ? dateLabel(payload[0].payload.date) : ''
                }
              />
            }
            cursor={{ stroke: theme.palette.axis, strokeDasharray: '3 3' }}
          />

          <Area
            type="monotone"
            dataKey="amount"
            name="Spent"
            stroke={theme.palette.expense}
            strokeWidth={2}
            fill="url(#trend-fill)"
            activeDot={{ r: 5.5, strokeWidth: 2, stroke: theme.palette.surface }}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
