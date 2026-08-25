import { useState, useEffect, useMemo } from 'react';

const CATEGORIES = {
  expense: ['Food', 'Transport', 'Bills', 'Entertainment', 'Shopping', 'Health', 'Other'],
  income: ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Saving', 'Other']
};

const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-blue-500 text-sm';
const labelClass = 'block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300';

// Pick a sensible default date for the transaction being added.
// If the dashboard is showing the real current month, default to today.
// If the dashboard is showing a past/future month (via the month picker),
// default to that same day-of-month within the VIEWED month instead —
// otherwise the field silently defaults to today's date, which quietly
// saves the transaction into the wrong month.
function getDefaultDate(viewMonth) {
  const now = new Date();
  const thisMonth = now.toISOString().slice(0, 7);

  if (!viewMonth || viewMonth === thisMonth) {
    return now.toISOString().split('T')[0];
  }

  const [year, month] = viewMonth.split('-').map(Number);
  const lastDayOfViewMonth = new Date(year, month, 0).getDate();
  const day = Math.min(now.getDate(), lastDayOfViewMonth);
  return `${viewMonth}-${String(day).padStart(2, '0')}`;
}

export default function TransactionForm({ onAdd, householdId, currentMonth, transactions }) {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: 'Other',
    description: '',
    date: getDefaultDate(currentMonth),
    isRecurring: false,
    recurringDay: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Category is a free-text field — this just powers the <datalist> suggestions:
  // the built-in defaults for the selected type, plus any custom category the
  // household has already typed in before (so it's easy to reuse, not required).
  const categorySuggestions = useMemo(() => {
    const used = (transactions || [])
      .filter((t) => t.type === formData.type)
      .map((t) => t.category)
      .filter(Boolean);
    return Array.from(new Set([...CATEGORIES[formData.type], ...used]));
  }, [transactions, formData.type]);

  // Keep the date field in sync with whichever month is being viewed,
  // as long as the user hasn't already started filling out the form.
  useEffect(() => {
    setFormData((prev) => {
      const isUntouched =
        !prev.amount && !prev.description && !prev.isRecurring;
      if (!isUntouched) return prev;
      return { ...prev, date: getDefaultDate(currentMonth) };
    });
  }, [currentMonth]);

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value,
      ...(name === 'type' && { category: CATEGORIES[value][0] })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!householdId) { setError('No household selected'); return; }

    setLoading(true);
    setError('');
    try {
      await onAdd({
        ...formData,
        amount: parseFloat(formData.amount),
        householdId,
        recurringDay: formData.isRecurring && formData.recurringDay
          ? parseInt(formData.recurringDay, 10)
          : null
      });
      setFormData({
        type: 'expense',
        amount: '',
        category: 'Other',
        description: '',
        date: getDefaultDate(currentMonth),
        isRecurring: false,
        recurringDay: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Error adding transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 dark:bg-slate-800">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-slate-100">Add Transaction</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-4 text-sm dark:bg-red-950 dark:border-red-900 dark:text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className={labelClass}>Type</label>
          <select name="type" value={formData.type} onChange={handleChange} className={inputClass}>
            <option value="expense">💸 Expense (Money Out)</option>
            <option value="income">💰 Income (Money In)</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0.01"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Category</label>
          <input
            type="text"
            name="category"
            list="category-suggestions-add"
            value={formData.category}
            onChange={handleChange}
            placeholder="Pick a suggestion or type your own"
            className={inputClass}
            required
          />
          <datalist id="category-suggestions-add">
            {categorySuggestions.map((cat) => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Optional details"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        {/* Recurring bill toggle — only relevant for expenses */}
        {formData.type === 'expense' && (
          <div className="rounded-lg border border-gray-200 p-3 dark:border-slate-700">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                name="isRecurring"
                checked={formData.isRecurring}
                onChange={handleChange}
                className="h-4 w-4 rounded accent-blue-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                🔁 Recurring monthly bill
              </span>
            </label>
            {formData.isRecurring && (
              <div className="mt-2">
                <label className="text-xs text-gray-500 dark:text-slate-400">
                  Due on day of month (optional)
                </label>
                <input
                  type="number"
                  name="recurringDay"
                  value={formData.recurringDay}
                  onChange={handleChange}
                  placeholder="e.g. 15"
                  min="1"
                  max="31"
                  className={`${inputClass} mt-1`}
                />
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !householdId}
          className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
}

export { CATEGORIES };
