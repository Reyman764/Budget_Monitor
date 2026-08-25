import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

export default function TrendChart({ transactions, currency = 'NPR' }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const gridColor = isDark ? '#334155' : '#e5e7eb';
  const tickColor = isDark ? '#94a3b8' : '#6b7280';

  const expenseTransactions = transactions.filter((t) => t.type === 'expense');

  const dailyTotals = expenseTransactions
    .reduce((acc, t) => {
      const date = new Date(t.date).toISOString().slice(0, 10);
      const existing = acc.find((item) => item.date === date);
      if (existing) {
        existing.amount += parseFloat(t.amount);
      } else {
        acc.push({ date, amount: parseFloat(t.amount) });
      }
      return acc;
    }, [])
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((d) => ({ ...d, label: d.date.slice(5) })); // MM-DD for compact axis

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-slate-800">
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-slate-100">
        Daily Spending Trend
      </h2>
      {dailyTotals.length === 0 ? (
        <p className="text-gray-500 dark:text-slate-400">No expenses to display</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyTotals}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="label" tick={{ fill: tickColor, fontSize: 12 }} />
            <YAxis tick={{ fill: tickColor, fontSize: 12 }} />
            <Tooltip
              formatter={(value) => [`${currency} ${value.toFixed(2)}`, 'Spent']}
              labelFormatter={(label) => `Date: ${label}`}
              contentStyle={
                isDark
                  ? { backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f1f5f9' }
                  : undefined
              }
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3, fill: '#3b82f6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
