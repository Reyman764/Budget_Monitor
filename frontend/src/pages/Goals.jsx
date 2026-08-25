import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useHousehold } from '../hooks/useHousehold';
import { useGoals } from '../hooks/useGoals';
import ThemeToggle from '../components/ThemeToggle';
import Modal from '../components/Modal';
import GoalsTracker from '../components/GoalsTracker';

export default function Goals() {
  const { household, loading: householdLoading } = useHousehold();
  const navigate = useNavigate();
  const householdId = household?.id || null;
  const currency = household?.currency || 'NPR';

  const { goals, loading, addGoal, updateGoal, deleteGoal } = useGoals(householdId);

  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ goalName: '', targetAmount: '', deadline: '' });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  useEffect(() => {
    if (!householdLoading && !household) navigate('/household-setup');
  }, [household, householdLoading, navigate]);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    setAddError('');
    setAddLoading(true);
    try {
      await addGoal({
        goalName: addForm.goalName,
        targetAmount: parseFloat(addForm.targetAmount),
        deadline: addForm.deadline || null
      });
      setShowAdd(false);
      setAddForm({ goalName: '', targetAmount: '', deadline: '' });
    } catch (err) {
      setAddError(err.response?.data?.error || 'Failed to add goal');
    } finally {
      setAddLoading(false);
    }
  };

  const handleAddFunds = (id, newCurrentAmount) => updateGoal(id, { currentAmount: newCurrentAmount });

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this savings goal?')) return;
    await deleteGoal(id);
  };

  const totalSaved = goals.reduce((sum, g) => sum + parseFloat(g.currentAmount), 0);
  const reachedCount = goals.filter((g) => parseFloat(g.currentAmount) >= parseFloat(g.targetAmount)).length;

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
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400">
              ← Dashboard
            </Link>
            <h1 className="text-xl font-bold text-gray-800 dark:text-slate-100">🎯 Savings Goals</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setShowAdd(true)}
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition"
            >
              + Add Goal
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-3xl p-4">
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-white p-4 shadow dark:bg-slate-800 text-center">
            <p className="text-xs text-gray-500 dark:text-slate-400">Total saved across goals</p>
            <p className="text-xl font-bold text-gray-900 dark:text-slate-100">
              {currency} {totalSaved.toFixed(0)}
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow dark:bg-slate-800 text-center">
            <p className="text-xs text-gray-500 dark:text-slate-400">Goals reached</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {reachedCount} / {goals.length}
            </p>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-400 dark:text-slate-500">Loading goals...</p>
        ) : (
          <GoalsTracker goals={goals} currency={currency} onAddFunds={handleAddFunds} onDelete={handleDelete} />
        )}
      </div>

      {showAdd && (
        <Modal title="Add Savings Goal" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAddGoal} className="space-y-3">
            {addError && <p className="text-sm text-red-600 dark:text-red-400">{addError}</p>}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">Goal name</label>
              <input
                type="text"
                value={addForm.goalName}
                onChange={(e) => setAddForm({ ...addForm, goalName: e.target.value })}
                placeholder="e.g. Emergency fund"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">Target amount</label>
              <input
                type="number"
                value={addForm.targetAmount}
                onChange={(e) => setAddForm({ ...addForm, targetAmount: e.target.value })}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">
                Target date (optional)
              </label>
              <input
                type="date"
                value={addForm.deadline}
                onChange={(e) => setAddForm({ ...addForm, deadline: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <button
              type="submit"
              disabled={addLoading}
              className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50"
            >
              {addLoading ? 'Adding...' : 'Add Goal'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
