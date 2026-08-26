import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';
import { MoneyTooltip, useChartTheme } from '../utils/chartTheme';

export default function BudgetVsActualChart({ budgets, currency = 'NPR' }) {
  const theme = useChartTheme();

  const data = budgets.map((b) => ({
    category: b.category,
    Budgeted: parseFloat(b.limitAmount),
    Spent: b.spent
  }));

  return (
    <ChartCard
      title="Planned against actual"
      description="Each category's limit next to what you spent"
      isEmpty={data.length === 0}
      emptyTitle="No limits set for this month"
      emptyMessage="Set a limit per category in settings and this comparison fills in."
    >
      <ResponsiveContainer width="100%" height={Math.max(240, data.length * 62)}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, left: 0, bottom: 0 }} barGap={2}>
          {/* Vertical rules only: on a horizontal bar chart they're the scale. */}
          <CartesianGrid stroke={theme.palette.grid} strokeDasharray="2 6" horizontal={false} />
          <XAxis type="number" {...theme.axis} tickFormatter={theme.tickFormatter} />
          <YAxis
            type="category"
            dataKey="category"
            width={96}
            {...theme.axis}
            tick={{ fill: theme.palette.tick, fontSize: 13 }}
          />
          <Tooltip content={<MoneyTooltip currency={currency} />} cursor={theme.cursor} />
          <Legend {...theme.legend} />
          <Bar dataKey="Budgeted" fill={theme.palette.budgeted} radius={[0, 5, 5, 0]} barSize={11} />
          <Bar dataKey="Spent" fill={theme.palette.spent} radius={[0, 5, 5, 0]} barSize={11} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
