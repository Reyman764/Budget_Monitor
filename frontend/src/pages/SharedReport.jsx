import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CategoryChart from '../components/CategoryChart';
import TrendChart from '../components/TrendChart';
import IncomeExpenseChart from '../components/IncomeExpenseChart';
import ThemeToggle from '../components/ThemeToggle';
import api from '../utils/api';

const monthLabel = (month) => {
  const [year, m] = month.split('-');
  return new Date(Number(year), Number(m) - 1, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric'
  });
};

export default function SharedReport() {
  const { token } = useParams();
  const [report, setReport] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  useEffect(() => {
    let cancelled = false;
    api
      .get(`/reports/shared/${token}`)
      .then(({ data }) => {
        if (!cancelled) {
          setReport(data);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-900">
        <p className="text-gray-600 dark:text-slate-300">Loading report...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-slate-900">
        <div className="max-w-sm text-center">
          <h1 className="mb-2 text-xl font-bold text-gray-900 dark:text-slate-100">
            Link expired or invalid
          </h1>
          <p className="mb-6 text-gray-600 dark:text-slate-400">
            This share link doesn&apos;t work anymore. Ask your partner to send a fresh one.
          </p>
          <Link to="/login" className="text-blue-500 hover:text-blue-700 dark:text-blue-400">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  const currency = report.household?.currency || 'NPR';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <nav className="bg-white p-4 shadow-sm dark:bg-slate-800">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-slate-400">
            Shared budget report — read only
          </span>
          <ThemeToggle />
        </div>
      </nav>

      <div className="mx-auto max-w-4xl p-4">
        <div className="rounded-lg bg-white p-6 shadow dark:bg-slate-800 sm:p-8">
          <div className="mb-8 text-center">
            <h2 className="mb-1 text-3xl font-bold text-gray-900 dark:text-slate-100 sm:text-4xl">
              Monthly Budget Review
            </h2>
            <p className="text-gray-600 dark:text-slate-400">
              {report.household?.name || 'Household'} · {monthLabel(report.month)}
            </p>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded bg-gradient-to-br from-green-50 to-green-100 p-6 dark:from-green-950 dark:to-green-900">
              <p className="text-gray-600 dark:text-green-200/70">Total Income</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-300">
                {currency} {report.totalIncome.toFixed(2)}
              </p>
            </div>
            <div className="rounded bg-gradient-to-br from-red-50 to-red-100 p-6 dark:from-red-950 dark:to-red-900">
              <p className="text-gray-600 dark:text-red-200/70">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-300">
                {currency} {report.totalExpense.toFixed(2)}
              </p>
            </div>
            <div className="rounded bg-gradient-to-br from-blue-50 to-blue-100 p-6 dark:from-blue-950 dark:to-blue-900">
              <p className="text-gray-600 dark:text-blue-200/70">Net Balance</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                {currency} {report.netBalance.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <IncomeExpenseChart
              income={report.totalIncome}
              expense={report.totalExpense}
              currency={currency}
            />
            <CategoryChart transactions={report.transactions} currency={currency} />
            <TrendChart transactions={report.transactions} currency={currency} />
          </div>
        </div>
      </div>
    </div>
  );
}
