import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { useAuth } from '../context/AuthContext';
import { useHousehold } from '../hooks/useHousehold';
import { useReports } from '../hooks/useReports';
import { useBudget } from '../hooks/useBudget';
import api from '../utils/api';
import CategoryChart from '../components/CategoryChart';
import TrendChart from '../components/TrendChart';
import IncomeExpenseChart from '../components/IncomeExpenseChart';
import ThemeToggle from '../components/ThemeToggle';
import BudgetVsActualChart from '../components/BudgetVsActualChart';
import CategoryBudgetTable from '../components/CategoryBudgetTable';
import MonthComparison from '../components/MonthComparison';

const monthLabel = (month) => {
  const [year, m] = month.split('-');
  return new Date(Number(year), Number(m) - 1, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric'
  });
};

export default function MonthlyReview() {
  const { logout } = useAuth();
  const { household, loading: householdLoading } = useHousehold();
  const navigate = useNavigate();
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [shareState, setShareState] = useState({ status: 'idle', url: '' }); // idle | loading | done | error
  const printRef = useRef();

  const householdId = household?.id || null;
  const { report, loading, error, fetchMonthlyReport, createShareLink } = useReports(householdId);
  const { budgets, fetchProgress } = useBudget(householdId);
  // Previous month's summary, fetched directly (not via useReports, which only
  // tracks one month at a time) so MonthComparison has something to diff against.
  const [prevReport, setPrevReport] = useState(null);

  useEffect(() => {
    if (!householdLoading && !household) {
      navigate('/household-setup');
    }
  }, [household, householdLoading, navigate]);

  useEffect(() => {
    if (householdId) {
      fetchMonthlyReport(month);
    }
  }, [householdId, month, fetchMonthlyReport]);

  useEffect(() => {
    if (householdId) fetchProgress(month);
  }, [householdId, month, fetchProgress]);

  useEffect(() => {
    if (!householdId) return;
    const [year, m] = month.split('-').map(Number);
    const prevDate = new Date(year, m - 2, 1);
    const prevMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;
    api
      .get(`/reports/monthly/${prevMonth}`, { params: { householdId } })
      .then(({ data }) => setPrevReport(data))
      .catch(() => setPrevReport(null));
  }, [householdId, month]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Monthly Review - ${month}`
  });

  const handleShare = async () => {
    setShareState({ status: 'loading', url: '' });
    try {
      const url = await createShareLink(month);
      setShareState({ status: 'done', url });
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url).catch(() => {});
      }
    } catch {
      setShareState({ status: 'error', url: '' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (householdLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-900">
        <p className="text-gray-600 dark:text-slate-300">Loading...</p>
      </div>
    );
  }

  const currency = household?.currency || 'NPR';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <nav className="no-print bg-white p-4 shadow-sm dark:bg-slate-800">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400"
            >
              ← Dashboard
            </Link>
            <h1 className="text-xl font-bold text-gray-800 dark:text-slate-100">Monthly Review</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-red-500 hover:text-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl p-4">
        <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-3">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleShare}
              disabled={shareState.status === 'loading'}
              className="rounded-lg border border-blue-500 px-4 py-2 text-sm font-semibold text-blue-500 transition hover:bg-blue-50 disabled:opacity-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-slate-800"
            >
              {shareState.status === 'loading' ? 'Generating link...' : '🔗 Share Report'}
            </button>
            <button
              onClick={handlePrint}
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              📄 Export to PDF
            </button>
          </div>
        </div>

        {shareState.status === 'done' && (
          <div className="no-print mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200">
            Link copied to clipboard! Anyone with this link can view this month&apos;s report — no
            login required.
            <div className="mt-1 break-all font-mono text-xs">{shareState.url}</div>
          </div>
        )}
        {shareState.status === 'error' && (
          <div className="no-print mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            Couldn&apos;t create a share link. Please try again.
          </div>
        )}
        {error && (
          <div className="no-print mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        )}

        <div ref={printRef} className="rounded-lg bg-white p-6 shadow dark:bg-slate-800 sm:p-8">
          <div className="mb-8 text-center">
            <h2 className="mb-1 text-3xl font-bold text-gray-900 dark:text-slate-100 sm:text-4xl">
              Monthly Budget Review
            </h2>
            <p className="text-gray-600 dark:text-slate-400">
              {household?.name || 'Household'} · {monthLabel(month)}
            </p>
          </div>

          {loading || !report ? (
            <p className="text-center text-gray-500 dark:text-slate-400">Loading report...</p>
          ) : (
            <>
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
                <BudgetVsActualChart budgets={budgets} currency={currency} />
                <CategoryBudgetTable budgets={budgets} currency={currency} />
                <MonthComparison current={report} previous={prevReport} currency={currency} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
