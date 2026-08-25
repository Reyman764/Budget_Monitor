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
import { useTheme } from '../context/ThemeContext';
import { useBudget } from '../hooks/useBudget';

const monthTick = (month) => {
  const [year, m] = month.split('-');
  const label = new Date(2000, Number(m) - 1, 1).toLocaleDateString(undefined, { month: 'short' });
  return `${label} '${year.slice(2)}`;
};

const fullMonthLabel = (month) => {
  const [year, m] = month.split('-');
  return new Date(Number(year), Number(m) - 1, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric'
  });
};

// Every month side by side as grouped bars (income / expense / net), rather than
// the rolling 12-month line in YearlyTrends. Self-contained — fetches its own
// full-history data via useBudget so it doesn't depend on what other charts on
// the page have already loaded.
export default function MonthlyBarChart({ householdId, currency = 'NPR' }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const gridColor = isDark ? '#334155' : '#e5e7eb';
  const tickColor = isDark ? '#94a3b8' : '#6b7280';

  const { trends, loading, fetchTrends } = useBudget(householdId);

  useEffect(() => {
    if (householdId) fetchTrends('all');
  }, [householdId, fetchTrends]);

  const data = trends.map((t) => ({ ...t, label: monthTick(t.month) }));
  const hasData = data.some((d) => d.income !== 0 || d.expense !== 0);
  // Fixed per-month width so bars stay readable instead of being squeezed to fit —
  // the container scrolls horizontally once there are more than a handful of months.
  const chartWidth = Math.max(600, data.length * 70);

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-slate-800">
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-slate-100">
        All Months — Side by Side
      </h2>
      {loading && data.length === 0 ? (
        <p className="text-gray-500 dark:text-slate-400">Loading...</p>
      ) : !hasData ? (
        <p className="text-gray-500 dark:text-slate-400">No transactions yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <ResponsiveContainer width={chartWidth} height={340} minWidth={chartWidth}>
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="label" tick={{ fill: tickColor, fontSize: 12 }} interval={0} />
              <YAxis tick={{ fill: tickColor, fontSize: 12 }} />
              <ReferenceLine y={0} stroke={gridColor} />
              <Tooltip
                formatter={(value) => `${currency} ${value.toFixed(2)}`}
                labelFormatter={(label, payload) => {
                  const month = payload?.[0]?.payload?.month;
                  return month ? fullMonthLabel(month) : label;
                }}
                contentStyle={
                  isDark
                    ? { backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f1f5f9' }
                    : undefined
                }
              />
              <Legend wrapperStyle={isDark ? { color: '#cbd5e1' } : undefined} />
              <Bar dataKey="income" name="Income" fill="#10b981" radius={[3, 3, 0, 0]} />
              <Bar dataKey="expense" name="Expenses" fill="#ef4444" radius={[3, 3, 0, 0]} />
              <Bar dataKey="net" name="Net" fill="#3b82f6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
