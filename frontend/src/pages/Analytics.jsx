import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useHousehold } from '../hooks/useHousehold';
import ThemeToggle from '../components/ThemeToggle';
import YearlyTrends from '../components/YearlyTrends';
import MonthlyBarChart from '../components/MonthlyBarChart';

export default function Analytics() {
  const { household, loading: householdLoading } = useHousehold();
  const navigate = useNavigate();
  const householdId = household?.id || null;
  const currency = household?.currency || 'NPR';

  useEffect(() => {
    if (!householdLoading && !household) navigate('/household-setup');
  }, [household, householdLoading, navigate]);

  if (householdLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-900">
        <p className="text-gray-500 dark:text-slate-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <nav className="bg-white shadow-sm p-4 dark:bg-slate-800">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400">
              ← Dashboard
            </Link>
            <h1 className="text-xl font-bold text-gray-800 dark:text-slate-100">📈 Analytics</h1>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <div className="mx-auto max-w-4xl p-4 space-y-6">
        <p className="text-sm text-gray-500 dark:text-slate-400">
          Income, expenses, and net balance for {household?.name || 'your household'} — a rolling
          12-month line view, and every month side by side below.
        </p>
        <YearlyTrends householdId={householdId} currency={currency} />
        <MonthlyBarChart householdId={householdId} currency={currency} />
      </div>
    </div>
  );
}
