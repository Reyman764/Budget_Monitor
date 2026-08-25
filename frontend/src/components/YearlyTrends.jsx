import { useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { useBudget } from '../hooks/useBudget';

const monthTick = (month) => {
  const [, m] = month.split('-');
  return new Date(2000, Number(m) - 1, 1).toLocaleDateString(undefined, { month: 'short' });
};

// Self-contained: fetches its own 12-month rolling data rather than relying on a
// parent page to already have it, since no other page needs a full year of transactions.
export default function YearlyTrends({ householdId, currency = 'NPR' }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const gridColor = isDark ? '#334155' : '#e5e7eb';
  const tickColor = isDark ? '#94a3b8' : '#6b7280';

  const { trends, loading, fetchTrends } = useBudget(householdId);

  useEffect(() => {
    if (householdId) fetchTrends();
  }, [householdId, fetchTrends]);

  const data = trends.map((t) => ({ ...t, label: monthTick(t.month) }));
  const hasData = data.some((d) => d.income !== 0 || d.expense !== 0);

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-slate-800">
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-slate-100">Yearly Trends</h2>
      {loading && data.length === 0 ? (
        <p className="text-gray-500 dark:text-slate-400">Loading...</p>
      ) : !hasData ? (
        <p className="text-gray-500 dark:text-slate-400">No transactions in the last 12 months yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="label" tick={{ fill: tickColor, fontSize: 12 }} />
            <YAxis tick={{ fill: tickColor, fontSize: 12 }} />
            <Tooltip
              formatter={(value) => `${currency} ${value.toFixed(2)}`}
              labelFormatter={(label, payload) => payload?.[0]?.payload?.month || label}
              contentStyle={
                isDark
                  ? { backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f1f5f9' }
                  : undefined
              }
            />
            <Legend wrapperStyle={isDark ? { color: '#cbd5e1' } : undefined} />
            <Line type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={2} dot={{ r: 2 }} />
            <Line type="monotone" dataKey="expense" name="Expenses" stroke="#ef4444" strokeWidth={2} dot={{ r: 2 }} />
            <Line type="monotone" dataKey="net" name="Net" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
