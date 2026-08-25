import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHousehold } from '../hooks/useHousehold';
import { useTransactions } from '../hooks/useTransactions';
import { useBudget } from '../hooks/useBudget';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import SummaryCards from '../components/SummaryCards';
import FilterBar from '../components/FilterBar';
import CategoryChart from '../components/CategoryChart';
import TrendChart from '../components/TrendChart';
import IncomeExpenseChart from '../components/IncomeExpenseChart';
import ThemeToggle from '../components/ThemeToggle';
import BudgetAlerts from '../components/BudgetAlerts';

const DEFAULT_FILTERS = { type: '', category: '', startDate: '', endDate: '', search: '' };

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { household, loading: householdLoading } = useHousehold();
  const navigate = useNavigate();

  // Month picker for the charts/summary (independent of the filter bar)
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));
  // Filter bar state
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  // Show/hide the filter bar
  const [showFilters, setShowFilters] = useState(false);

  const householdId = household?.id || null;
  const { transactions, loading, fetchTransactions, addTransaction, updateTransaction, deleteTransaction, ensureCarryOver } =
    useTransactions(householdId);
  const { budgets, netWorth, fetchProgress, fetchNetWorth } = useBudget(householdId);

  useEffect(() => {
    if (!householdLoading && !household) navigate('/household-setup');
  }, [household, householdLoading, navigate]);

  // Budget alerts follow whichever month is selected above; net worth is all-time
  // so it only needs to load once the household is known.
  useEffect(() => {
    if (householdId) fetchProgress(currentMonth);
  }, [householdId, currentMonth, fetchProgress]);

  useEffect(() => {
    if (householdId) fetchNetWorth();
  }, [householdId, fetchNetWorth]);

  // Re-fetch whenever month OR any filter changes
  const buildAndFetch = useCallback(
    (month, activeFilters) => {
      if (!householdId) return;
      // If the filter bar has a custom date range, prefer that over the month picker
      const hasDateRange = activeFilters.startDate || activeFilters.endDate;
      fetchTransactions({
        ...(hasDateRange ? {} : { month }),
        ...activeFilters
      });
    },
    [householdId, fetchTransactions]
  );

  useEffect(() => {
    if (!householdId) return;
    // Make sure "Remaining of previous month" has been carried into this
    // month before loading the list — idempotent on the backend, so this
    // is safe to run every time the viewed month changes.
    ensureCarryOver(currentMonth).finally(() => {
      buildAndFetch(currentMonth, filters);
    });
  }, [currentMonth, filters, householdId, buildAndFetch, ensureCarryOver]);

  const currency = household?.currency || 'NPR';
  const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + parseFloat(t.amount), 0);
  const expense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + parseFloat(t.amount), 0);
  const balance = income - expense;

  const handleLogout = () => { logout(); navigate('/login'); };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  if (householdLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <p className="text-gray-600 dark:text-slate-300">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <nav className="bg-white shadow-sm p-4 dark:bg-slate-800">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Budget Tracker</h1>
            {household && (
              <p className="text-sm text-gray-500 dark:text-slate-400">
                {household.name} · {household.currency}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <Link to="/bills" className="text-sm font-medium text-blue-500 hover:text-blue-700 dark:text-blue-400">
              🧾 Bills
            </Link>
            <Link to="/monthly-review" className="text-sm font-medium text-blue-500 hover:text-blue-700 dark:text-blue-400">
              📊 Monthly Review
            </Link>
            <Link to="/analytics" className="text-sm font-medium text-blue-500 hover:text-blue-700 dark:text-blue-400">
              📈 Analytics
            </Link>
            <Link to="/goals" className="text-sm font-medium text-blue-500 hover:text-blue-700 dark:text-blue-400">
              🎯 Goals
            </Link>
            <Link to="/settings" className="text-sm font-medium text-blue-500 hover:text-blue-700 dark:text-blue-400">
              ⚙️ Settings
            </Link>
            <p className="text-gray-600 dark:text-slate-300 hidden sm:block text-sm">
              Hi, {user?.name}
            </p>
            <ThemeToggle />
            <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 font-medium">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-4 space-y-6">

        {/* Month picker + filter toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-slate-200">Overview</h2>
          <div className="flex items-center gap-2">
            <input
              type="month"
              value={currentMonth}
              onChange={(e) => setCurrentMonth(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg border text-sm font-medium transition ${
                hasActiveFilters
                  ? 'border-blue-400 bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-700'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              🔍 Filters{hasActiveFilters ? ' •' : ''}
            </button>
          </div>
        </div>

        {showFilters && (
          <FilterBar filters={filters} onChange={setFilters} />
        )}

        <BudgetAlerts budgets={budgets} />

        <SummaryCards income={income} expense={expense} balance={balance} currency={currency} />

        {netWorth && (
          <div className="rounded-lg bg-gradient-to-br from-violet-50 to-violet-100 p-4 shadow dark:from-violet-950 dark:to-violet-900">
            <p className="text-sm text-gray-600 dark:text-violet-200/70">💎 Net Worth (all time)</p>
            <p className="text-2xl font-bold text-violet-700 dark:text-violet-300">
              {currency} {netWorth.netWorth.toFixed(2)}
            </p>
          </div>
        )}

        {household?.inviteCode && !hasActiveFilters && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-200">
            Partner invite code:{' '}
            <span className="font-bold tracking-widest">{household.inviteCode}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <TransactionForm
              onAdd={addTransaction}
              householdId={householdId}
              currentMonth={currentMonth}
              transactions={transactions}
            />
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 dark:bg-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">Transactions</h2>
                {hasActiveFilters && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full dark:bg-blue-950 dark:text-blue-300">
                    {transactions.length} result{transactions.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              {loading ? (
                <p className="text-gray-500 dark:text-slate-400 text-sm">Loading...</p>
              ) : (
                <TransactionList
                  transactions={transactions}
                  onUpdate={updateTransaction}
                  onDelete={deleteTransaction}
                  currency={currency}
                />
              )}
            </div>
          </div>
        </div>

        {/* Charts section — only show when no custom filters distort the view */}
        {!hasActiveFilters && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-slate-200">Insights</h2>
              <Link to="/monthly-review" className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400">
                Full report →
              </Link>
            </div>
            <div className="space-y-6">
              <IncomeExpenseChart income={income} expense={expense} currency={currency} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CategoryChart transactions={transactions} currency={currency} />
                <TrendChart transactions={transactions} currency={currency} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
