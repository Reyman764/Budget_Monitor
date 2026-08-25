import { useState, useMemo } from 'react';
import Modal from './Modal';
import { CATEGORIES } from './TransactionForm';

const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 text-sm';
const labelClass = 'block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300';

export default function TransactionList({ transactions, onUpdate, onDelete, currency = 'NPR' }) {
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const openEdit = (tx) => {
    setEditingTransaction(tx);
    setFormData({
      type: tx.type,
      amount: parseFloat(tx.amount).toString(),
      category: tx.category,
      description: tx.description || '',
      date: new Date(tx.date).toISOString().split('T')[0],
      isRecurring: tx.isRecurring || false,
      recurringDay: tx.recurringDay || ''
    });
  };

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value,
      ...(name === 'type' && { category: CATEGORIES[value][0] })
    }));
  };

  // Free-text category field suggestions: built-in defaults for the selected
  // type, plus any custom category already used elsewhere in this list.
  const categorySuggestions = useMemo(() => {
    const type = formData.type || 'expense';
    const used = (transactions || []).filter((t) => t.type === type).map((t) => t.category).filter(Boolean);
    return Array.from(new Set([...(CATEGORIES[type] || []), ...used]));
  }, [transactions, formData.type]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdate(editingTransaction.id, {
        ...formData,
        amount: parseFloat(formData.amount),
        recurringDay: formData.isRecurring && formData.recurringDay
          ? parseInt(formData.recurringDay, 10)
          : null
      });
      setEditingTransaction(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    try { await onDelete(id); } catch (err) { alert(err.response?.data?.error || 'Failed to delete'); }
  };

  if (transactions.length === 0) {
    return (
      <p className="text-center py-6 text-gray-400 dark:text-slate-500 text-sm">
        No transactions found
      </p>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex flex-wrap justify-between items-start gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-700/40 transition"
          >
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-gray-900 dark:text-slate-100 truncate">
                  {tx.description || tx.category}
                </p>
                {tx.isRecurring && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full dark:bg-purple-900/50 dark:text-purple-300">
                    🔁 recurring{tx.recurringDay ? ` · day ${tx.recurringDay}` : ''}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                {new Date(tx.date).toLocaleDateString(undefined, { month:'short', day:'numeric', year:'numeric' })}
                {' · '}{tx.category}
                {tx.User?.name && <span className="ml-1">· by {tx.User.name}</span>}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <p className={`text-base font-bold ${
                tx.type === 'income'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {tx.type === 'income' ? '+' : '−'}{currency} {parseFloat(tx.amount).toFixed(2)}
              </p>
              <button
                onClick={() => openEdit(tx)}
                className="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(tx.id)}
                className="text-xs text-red-400 hover:text-red-600 dark:text-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingTransaction && (
        <Modal title="Edit Transaction" onClose={() => setEditingTransaction(null)}>
          <form onSubmit={handleUpdate} className="space-y-3">
            <div>
              <label className={labelClass}>Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className={inputClass}>
                <option value="expense">💸 Expense</option>
                <option value="income">💰 Income</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Amount</label>
              <input type="number" name="amount" value={formData.amount} onChange={handleChange}
                step="0.01" min="0.01" className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <input
                type="text"
                name="category"
                list="category-suggestions-edit"
                value={formData.category}
                onChange={handleChange}
                className={inputClass}
                required
              />
              <datalist id="category-suggestions-edit">
                {categorySuggestions.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <input type="text" name="description" value={formData.description}
                onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Date</label>
              <input type="date" name="date" value={formData.date}
                onChange={handleChange} className={inputClass} required />
            </div>
            {formData.type === 'expense' && (
              <div className="rounded-lg border border-gray-200 p-3 dark:border-slate-700">
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" name="isRecurring" checked={formData.isRecurring}
                    onChange={handleChange} className="h-4 w-4 accent-blue-500" />
                  <span className="text-sm text-gray-700 dark:text-slate-300">🔁 Recurring monthly bill</span>
                </label>
                {formData.isRecurring && (
                  <input type="number" name="recurringDay" value={formData.recurringDay}
                    onChange={handleChange} placeholder="Due day (1–31)" min="1" max="31"
                    className={`${inputClass} mt-2`} />
                )}
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
