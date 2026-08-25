import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';

// A palette tuned to sit alongside the app's existing blue/violet identity
// rather than reaching for chart-library defaults.
const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b', '#ec4899', '#10b981', '#6366f1'];

export default function CategoryChart({ transactions, currency = 'NPR' }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const expenseTransactions = transactions.filter((t) => t.type === 'expense');

  const categoryTotals = expenseTransactions.reduce((acc, t) => {
    const existing = acc.find((item) => item.name === t.category);
    if (existing) {
      existing.value += parseFloat(t.amount);
    } else {
      acc.push({ name: t.category, value: parseFloat(t.amount) });
    }
    return acc;
  }, []);

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-slate-800">
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-slate-100">
        Spending by Category
      </h2>
      {categoryTotals.length === 0 ? (
        <p className="text-gray-500 dark:text-slate-400">No expenses to display</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryTotals}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={90}
              dataKey="value"
            >
              {categoryTotals.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `${currency} ${value.toFixed(2)}`}
              contentStyle={
                isDark
                  ? { backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f1f5f9' }
                  : undefined
              }
            />
            <Legend wrapperStyle={isDark ? { color: '#cbd5e1' } : undefined} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
