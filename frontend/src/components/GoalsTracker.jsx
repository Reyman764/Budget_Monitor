import { useState } from 'react';
import BudgetProgressBar from './BudgetProgressBar';

const daysRemaining = (deadline) => {
  if (!deadline) return null;
  const diffMs = new Date(deadline).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
};

export default function GoalsTracker({ goals, currency = 'NPR', onAddFunds, onDelete }) {
  // Draft "add funds" amount per goal, keyed by goal id
  const [drafts, setDrafts] = useState({});
  const [savingId, setSavingId] = useState(null);

  const setDraft = (id, value) => setDrafts((prev) => ({ ...prev, [id]: value }));

  const handleAddFunds = async (goal) => {
    const amount = parseFloat(drafts[goal.id]);
    if (!amount || amount <= 0) return;
    setSavingId(goal.id);
    try {
      await onAddFunds(goal.id, parseFloat(goal.currentAmount) + amount);
      setDraft(goal.id, '');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update goal');
    } finally {
      setSavingId(null);
    }
  };

  if (goals.length === 0) {
    return (
      <div className="rounded-lg bg-white p-10 text-center shadow dark:bg-slate-800">
        <p className="mb-3 text-4xl">🎯</p>
        <p className="text-gray-600 dark:text-slate-400">
          No savings goals yet. Add one to start tracking progress together.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => {
        const target = parseFloat(goal.targetAmount);
        const current = parseFloat(goal.currentAmount);
        const pct = target > 0 ? Math.round((current / target) * 100) : 0;
        const remaining = target - current;
        const days = daysRemaining(goal.deadline);

        return (
          <div key={goal.id} className="rounded-lg bg-white p-5 shadow dark:bg-slate-800">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-bold text-gray-900 dark:text-slate-100">{goal.goalName}</p>
                <p className="text-xs text-gray-400 dark:text-slate-500">
                  {currency} {current.toFixed(2)} of {currency} {target.toFixed(2)}
                  {days !== null && (
                    <span>
                      {' · '}
                      {days >= 0 ? `${days} day${days !== 1 ? 's' : ''} left` : `${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} overdue`}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-lg font-bold ${pct >= 100 ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
                  {pct}%
                </span>
                <button
                  onClick={() => onDelete(goal.id)}
                  className="text-xs text-red-400 hover:text-red-600 dark:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="mt-3">
              <BudgetProgressBar percentageUsed={pct >= 100 ? 100 : pct} />
              {pct < 100 ? (
                <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">
                  {currency} {remaining.toFixed(2)} to go
                </p>
              ) : (
                <p className="mt-1 text-xs font-medium text-green-600 dark:text-green-400">Goal reached! 🎉</p>
              )}
            </div>

            <div className="mt-3 flex gap-2">
              <input
                type="number"
                value={drafts[goal.id] || ''}
                onChange={(e) => setDraft(goal.id, e.target.value)}
                placeholder="Add funds"
                step="0.01"
                min="0.01"
                className="w-32 rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
              <button
                onClick={() => handleAddFunds(goal)}
                disabled={savingId === goal.id || !drafts[goal.id]}
                className="rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
              >
                {savingId === goal.id ? 'Saving...' : '+ Add'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
