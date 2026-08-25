import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useHousehold } from '../hooks/useHousehold';
import { useBudget } from '../hooks/useBudget';
import BudgetProgressBar from '../components/BudgetProgressBar';
import ThemeToggle from '../components/ThemeToggle';

// Same expense category list used in TransactionForm.jsx / Bills.jsx — budget limits
// only make sense for expense categories, so income categories aren't offered here.
const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Shopping', 'Health', 'Other'];

export default function Settings() {
  const { household, loading: householdLoading } = useHousehold();
  const navigate = useNavigate();
  const householdId = household?.id || null;
  const currency = household?.currency || 'NPR';

  const { budgets, loading, error, fetchProgress, setLimit } = useBudget(householdId);

  const [drafts, setDrafts] = useState({});
  const [savingCategory, setSavingCategory] = useState(null);
  const [savedCategory, setSavedCategory] = useState(null);

  const loadProgress = useCallback(() => {
    if (householdId) fetchProgress();
  }, [householdId, fetchProgress]);

  useEffect(() => {
    if (!householdLoading && !household) navigate('/household-setup');
  }, [household, householdLoading, navigate]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Prefill each category's draft input from whatever limit is already set,
  // without clobbering an in-progress edit the user hasn't saved yet.
  useEffect(() => {
    setDrafts((prev) => {
      const next = { ...prev };
      for (const b of budgets) {
        if (next[b.category] === undefined) next[b.category] = b.limitAmount;
      }
      return next;
    });
  }, [budgets]);

  const budgetFor = (category) => budgets.find((b) => b.category === category);

  const handleSave = async (category) => {
    const value = drafts[category];
    if (!value || parseFloat(value) <= 0) return;
    setSavingCategory(category);
    setSavedCategory(null);
    try {
      await setLimit(category, parseFloat(value));
      await fetchProgress();
      setSavedCategory(category);
      setTimeout(() => setSavedCategory((c) => (c === category ? null : c)), 2000);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save budget limit');
    } finally {
      setSavingCategory(null);
    }
  };

  if (householdLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-900">
        <p className="text-gray-500 dark:text-slate-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <nav className="bg-white p-4 shadow-sm dark:bg-slate-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400">
              ← Dashboard
            </Link>
            <h1 className="text-xl font-bold text-gray-800 dark:text-slate-100">⚙️ Budget Settings</h1>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <div className="mx-auto max-w-3xl p-4">
        <p className="mb-4 text-sm text-gray-500 dark:text-slate-400">
          Set this month's spending limit per category. You'll get an alert on the Dashboard once a
          category hits 80% of its limit.
        </p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        )}

        {loading && budgets.length === 0 ? (
          <p className="text-center text-gray-400 dark:text-slate-500">Loading...</p>
        ) : (
          <div className="space-y-3">
            {EXPENSE_CATEGORIES.map((category) => {
              const existing = budgetFor(category);
              return (
                <div key={category} className="rounded-lg bg-white p-4 shadow dark:bg-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 dark:text-slate-100">{category}</p>
                      {existing && (
                        <p className="text-xs text-gray-400 dark:text-slate-500">
                          {currency} {existing.spent.toFixed(2)} spent so far
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 dark:text-slate-400">{currency}</span>
                      <input
                        type="number"
                        value={drafts[category] ?? ''}
                        onChange={(e) => setDrafts((prev) => ({ ...prev, [category]: e.target.value }))}
                        placeholder="0.00"
                        step="0.01"
                        min="0.01"
                        className="w-28 rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                      />
                      <button
                        onClick={() => handleSave(category)}
                        disabled={savingCategory === category}
                        className="rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
                      >
                        {savingCategory === category ? 'Saving...' : savedCategory === category ? 'Saved ✓' : 'Save'}
                      </button>
                    </div>
                  </div>

                  {existing && (
                    <div className="mt-3">
                      <BudgetProgressBar percentageUsed={existing.percentageUsed} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
