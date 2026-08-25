import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';

export default function IncomeExpenseChart({ income, expense, currency = 'NPR' }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const gridColor = isDark ? '#334155' : '#e5e7eb';
  const tickColor = isDark ? '#94a3b8' : '#6b7280';

  const data = [
    { name: 'Income', value: income },
    { name: 'Expenses', value: expense }
  ];
  const barColors = ['#10b981', '#ef4444'];

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-slate-800">
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-slate-100">
        Income vs Expenses
      </h2>
      {income === 0 && expense === 0 ? (
        <p className="text-gray-500 dark:text-slate-400">No transactions to display</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} barSize={72}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 13 }} />
            <YAxis tick={{ fill: tickColor, fontSize: 12 }} />
            <Tooltip
              formatter={(value) => `${currency} ${value.toFixed(2)}`}
              contentStyle={
                isDark
                  ? { backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f1f5f9' }
                  : undefined
              }
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={barColors[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
