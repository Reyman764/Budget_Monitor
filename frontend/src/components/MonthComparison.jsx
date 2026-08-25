const monthLabel = (month) => {
  const [year, m] = month.split('-');
  return new Date(Number(year), Number(m) - 1, 1).toLocaleDateString(undefined, {
    month: 'short',
    year: 'numeric'
  });
};

export default function MonthComparison({ current, previous, currency = 'NPR' }) {
  if (!current || !previous) {
    return (
      <div className="rounded-lg bg-white p-6 shadow dark:bg-slate-800">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-slate-100">Month over Month</h2>
        <p className="text-gray-500 dark:text-slate-400">Not enough data yet to compare months.</p>
      </div>
    );
  }

  const rows = [
    {
      label: 'Income',
      prev: previous.totalIncome,
      curr: current.totalIncome,
      diff: current.totalIncome - previous.totalIncome,
      goodIsUp: true
    },
    {
      label: 'Expenses',
      prev: previous.totalExpense,
      curr: current.totalExpense,
      diff: current.totalExpense - previous.totalExpense,
      goodIsUp: false
    },
    {
      label: 'Net Balance',
      prev: previous.netBalance,
      curr: current.netBalance,
      diff: current.netBalance - previous.netBalance,
      goodIsUp: true
    }
  ];

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-slate-800">
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-slate-100">
        {monthLabel(current.month)} vs {monthLabel(previous.month)}
      </h2>
      <div className="space-y-3">
        {rows.map((row) => {
          const improved = row.goodIsUp ? row.diff >= 0 : row.diff <= 0;
          return (
            <div
              key={row.label}
              className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 dark:border-slate-700"
            >
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-slate-300">{row.label}</p>
                <p className="text-xs text-gray-400 dark:text-slate-500">
                  {currency} {row.prev.toFixed(2)} → {currency} {row.curr.toFixed(2)}
                </p>
              </div>
              <p
                className={`text-sm font-bold ${
                  improved ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}
              >
                {row.diff >= 0 ? '+' : ''}
                {currency} {Math.abs(row.diff).toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
