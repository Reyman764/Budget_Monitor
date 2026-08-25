import BudgetProgressBar from './BudgetProgressBar';

// Row tint follows the same threshold as the alert flag: >=100% red, >=80% amber, else green.
const rowClass = (pct) => {
  if (pct >= 100) return 'bg-red-50 dark:bg-red-950/40';
  if (pct >= 80) return 'bg-amber-50 dark:bg-amber-950/40';
  return 'bg-green-50 dark:bg-green-950/40';
};

const pctClass = (pct) => {
  if (pct >= 100) return 'text-red-600 dark:text-red-400';
  if (pct >= 80) return 'text-amber-600 dark:text-amber-400';
  return 'text-green-600 dark:text-green-400';
};

export default function CategoryBudgetTable({ budgets, currency = 'NPR' }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-slate-800">
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-slate-100">Category Breakdown</h2>
      {budgets.length === 0 ? (
        <p className="text-gray-500 dark:text-slate-400">
          No budget limits set for this month yet — set one in Settings.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="text-xs uppercase text-gray-500 dark:text-slate-400">
                <th className="pb-2 pr-2 font-medium">Category</th>
                <th className="pb-2 px-2 font-medium">Budgeted</th>
                <th className="pb-2 px-2 font-medium">Spent</th>
                <th className="pb-2 px-2 font-medium">Remaining</th>
                <th className="pb-2 pl-2 font-medium">% Used</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((b) => (
                <tr key={b.id} className={`rounded-lg ${rowClass(b.percentageUsed)}`}>
                  <td className="rounded-l-lg py-2 pr-2 font-medium text-gray-900 dark:text-slate-100">
                    {b.category}
                  </td>
                  <td className="px-2 py-2 text-gray-700 dark:text-slate-300">
                    {currency} {parseFloat(b.limitAmount).toFixed(2)}
                  </td>
                  <td className="px-2 py-2 text-gray-700 dark:text-slate-300">
                    {currency} {b.spent.toFixed(2)}
                  </td>
                  <td className={`px-2 py-2 font-medium ${b.remaining < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-slate-300'}`}>
                    {currency} {b.remaining.toFixed(2)}
                  </td>
                  <td className="rounded-r-lg py-2 pl-2">
                    <div className="flex items-center gap-2">
                      <div className="w-16 shrink-0">
                        <BudgetProgressBar percentageUsed={b.percentageUsed} />
                      </div>
                      <span className={`shrink-0 font-semibold ${pctClass(b.percentageUsed)}`}>
                        {b.percentageUsed}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
