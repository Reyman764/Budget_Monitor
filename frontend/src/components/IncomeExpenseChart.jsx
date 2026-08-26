import { Bar, BarChart, CartesianGrid, Cell, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';
import { MoneyTooltip, useChartTheme } from '../utils/chartTheme';
import { money } from '../utils/format';

export default function IncomeExpenseChart({ income, expense, currency = 'NPR' }) {
  const theme = useChartTheme();

  const data = [
    { name: 'In', value: income, fill: theme.palette.income },
    { name: 'Out', value: expense, fill: theme.palette.expense }
  ];

  const net = income - expense;

  return (
    <ChartCard
      title="In and out"
      description={`Net ${money(net, currency, { signed: true, decimals: false })}`}
      isEmpty={income === 0 && expense === 0}
      emptyMessage="Add a transaction to compare what came in against what went out."
    >
      <ResponsiveContainer width="100%" height={256}>
        <BarChart data={data} barSize={76} margin={{ top: 8, right: 6, bottom: 0, left: -12 }}>
          <CartesianGrid {...theme.grid} />
          <XAxis
            dataKey="name"
            {...theme.axis}
            tick={{ fill: theme.palette.tick, fontSize: 13, fontWeight: 500 }}
          />
          <YAxis {...theme.axis} tickFormatter={theme.tickFormatter} width={56} />
          <Tooltip content={<MoneyTooltip currency={currency} />} cursor={theme.cursor} />
          <Bar dataKey="value" name="Amount" radius={[10, 10, 4, 4]}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
