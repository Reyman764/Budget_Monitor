import { useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';
import Loader from './ui/Loader';
import { useBudget } from '../hooks/useBudget';
import { MoneyTooltip, useChartTheme } from '../utils/chartTheme';
import { monthLabel } from '../utils/format';

const monthTick = (month) => {
  const [, m] = month.split('-');
  return new Date(2000, Number(m) - 1, 1).toLocaleDateString(undefined, { month: 'short' });
};

// Self-contained: fetches its own 12-month rolling data rather than relying on a
// parent page to already have it, since no other page needs a full year of transactions.
export default function YearlyTrends({ householdId, currency = 'NPR' }) {
  const theme = useChartTheme();
  const { trends, loading, fetchTrends } = useBudget(householdId);

  useEffect(() => {
    if (householdId) fetchTrends();
  }, [householdId, fetchTrends]);

  const data = trends.map((t) => ({ ...t, label: monthTick(t.month) }));
  const hasData = data.some((d) => d.income !== 0 || d.expense !== 0);

  if (loading && data.length === 0) {
    return (
      <ChartCard title="The last twelve months" description="Income, expenses and what was left">
        <Loader label="Loading a year of history" />
      </ChartCard>
    );
  }

  return (
    <ChartCard
      title="The last twelve months"
      description="Income, expenses and what was left"
      isEmpty={!hasData}
      emptyMessage="Nothing logged in the last twelve months yet."
    >
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 12, right: 12, bottom: 0, left: -12 }}>
          <CartesianGrid {...theme.grid} />
          <XAxis dataKey="label" {...theme.axis} />
          <YAxis {...theme.axis} tickFormatter={theme.tickFormatter} width={56} />
          <Tooltip
            content={
              <MoneyTooltip
                currency={currency}
                labelFormatter={(label, payload) =>
                  payload?.[0]?.payload?.month ? monthLabel(payload[0].payload.month) : label
                }
              />
            }
            cursor={{ stroke: theme.palette.axis, strokeDasharray: '3 3' }}
          />
          <Legend {...theme.legend} />
          <Line
            type="monotone"
            dataKey="income"
            name="In"
            stroke={theme.palette.income}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2, stroke: theme.palette.surface }}
          />
          <Line
            type="monotone"
            dataKey="expense"
            name="Out"
            stroke={theme.palette.expense}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2, stroke: theme.palette.surface }}
          />
          {/* Net is the one series you read for a verdict, so it's dashed rather
              than competing as a third solid line. */}
          <Line
            type="monotone"
            dataKey="net"
            name="Left over"
            stroke={theme.palette.net}
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2, stroke: theme.palette.surface }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
