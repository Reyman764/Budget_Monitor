import { useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer
} from 'recharts';
import ChartCard from './ChartCard';
import { SkeletonChart } from './ui/Skeleton';
import { useBudget } from '../hooks/useBudget';
import { MoneyTooltip, useChartTheme } from '../utils/chartTheme';
import { monthLabel } from '../utils/format';

const monthTick = (month) => {
  const [year, m] = month.split('-');
  const label = new Date(2000, Number(m) - 1, 1).toLocaleDateString(undefined, { month: 'short' });
  return `${label} '${year.slice(2)}`;
};

// Every month side by side as grouped bars (income / expense / net), rather than
// the rolling 12-month line in YearlyTrends. Self-contained — fetches its own
// full-history data via useBudget so it doesn't depend on what other charts on
// the page have already loaded.
export default function MonthlyBarChart({ householdId, currency = 'NPR' }) {
  const theme = useChartTheme();
  const { trends, loading, fetchTrends } = useBudget(householdId);

  useEffect(() => {
    if (householdId) fetchTrends('all');
  }, [householdId, fetchTrends]);

  const data = trends.map((t) => ({ ...t, label: monthTick(t.month) }));
  const hasData = data.some((d) => d.income !== 0 || d.expense !== 0);
  // Fixed per-month width so bars stay readable instead of being squeezed to fit —
  // the container scrolls horizontally once there are more than a handful of months.
  const chartWidth = Math.max(600, data.length * 76);

  if (loading && data.length === 0) {
    return (
      <ChartCard title="Month by month" description="Every month you've recorded">
        <SkeletonChart label="Loading your history" />
      </ChartCard>
    );
  }

  return (
    <ChartCard
      title="Month by month"
      description={
        hasData ? `Every month you've recorded · ${data.length} so far` : "Every month you've recorded"
      }
      isEmpty={!hasData}
      emptyMessage="Log a transaction and each month will line up here for comparison."
    >
      <div className="scrollbar-none -mx-1 overflow-x-auto px-1">
        <ResponsiveContainer width={chartWidth} height={340} minWidth={chartWidth}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }} barGap={3}>
            <CartesianGrid {...theme.grid} />
            <XAxis dataKey="label" {...theme.axis} interval={0} />
            <YAxis {...theme.axis} tickFormatter={theme.tickFormatter} width={56} />
            <ReferenceLine y={0} stroke={theme.palette.axis} />
            <Tooltip
              content={
                <MoneyTooltip
                  currency={currency}
                  labelFormatter={(label, payload) =>
                    payload?.[0]?.payload?.month ? monthLabel(payload[0].payload.month) : label
                  }
                />
              }
              cursor={theme.cursor}
            />
            <Legend {...theme.legend} />
            <Bar dataKey="income" name="In" fill={theme.palette.income} radius={[5, 5, 0, 0]} />
            <Bar dataKey="expense" name="Out" fill={theme.palette.expense} radius={[5, 5, 0, 0]} />
            <Bar dataKey="net" name="Left over" fill={theme.palette.net} radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
