export default function SummaryCards({ income, expense, balance, currency = 'NPR' }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow dark:from-green-950 dark:to-green-900">
        <p className="text-gray-600 text-sm dark:text-green-200/70">Total Income</p>
        <p className="text-3xl font-bold text-green-600 dark:text-green-300">{currency} {income.toFixed(2)}</p>
      </div>

      <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg shadow dark:from-red-950 dark:to-red-900">
        <p className="text-gray-600 text-sm dark:text-red-200/70">Total Expenses</p>
        <p className="text-3xl font-bold text-red-600 dark:text-red-300">{currency} {expense.toFixed(2)}</p>
      </div>

      <div
        className={`bg-gradient-to-br p-6 rounded-lg shadow ${
          balance >= 0
            ? 'from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900'
            : 'from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900'
        }`}
      >
        <p className="text-gray-600 text-sm dark:text-slate-300/70">Net Balance</p>
        <p
          className={`text-3xl font-bold ${
            balance >= 0 ? 'text-blue-600 dark:text-blue-300' : 'text-orange-600 dark:text-orange-300'
          }`}
        >
          {currency} {balance.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
