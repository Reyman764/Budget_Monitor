import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';

export default function BudgetVsActualChart({ budgets, currency = 'NPR' }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const gridColor = isDark ? '#334155' : '#e5e7eb';
  const tickColor = isDark ? '#94a3b8' : '#6b7280';

  const data = budgets.map((b) => ({
    category: b.category,
    Budgeted: parseFloat(b.limitAmount),
    Spent: b.spent
  }));

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-slate-800">
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-slate-100">Budget vs. Actual</h2>
      {data.length === 0 ? (
        <p className="text-gray-500 dark:text-slate-400">
          No budget limits set for this month yet — set one in Settings.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={Math.max(260, data.length * 60)}>
          <BarChart data={data} layout="vertical" margin={{ left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
            <XAxis type="number" tick={{ fill: tickColor, fontSize: 12 }} />
            <YAxis type="category" dataKey="category" width={90} tick={{ fill: tickColor, fontSize: 13 }} />
            <Tooltip
              formatter={(value) => `${currency} ${value.toFixed(2)}`}
              contentStyle={
                isDark
                  ? { backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f1f5f9' }
                  : undefined
              }
            />
            <Legend wrapperStyle={isDark ? { color: '#cbd5e1' } : undefined} />
            <Bar dataKey="Budgeted" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            <Bar dataKey="Spent" fill="#3b82f6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
