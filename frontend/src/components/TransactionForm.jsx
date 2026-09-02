import { useState, useEffect } from 'react';
import CategoryDropdown from './CategoryDropdown';
import Button from './ui/Button';
import Callout from './ui/Callout';
import { Card } from './ui/Card';
import { Field, Input } from './ui/Field';
import { ExpenseIcon, IncomeIcon, PlusIcon, RecurringIcon } from './icons';
import { DEFAULT_CATEGORIES } from '../utils/categories';
import { useToast } from '../context/ToastContext';

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

const TYPES = [
  { value: 'expense', label: 'Money out', Icon: ExpenseIcon, active: 'text-clay' },
  { value: 'income', label: 'Money in', Icon: IncomeIcon, active: 'text-moss' }
];

export default function TransactionForm({
  onAdd,
  householdId,
  currentMonth,
  currency = 'NPR',
  categories = DEFAULT_CATEGORIES,
  onAddCategory,
  onDeleteCategory
}) {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: categories.expense?.[0] || '',
    description: '',
    date: getDefaultDate(currentMonth),
    isRecurring: false,
    recurringDay: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

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

  // If the selected category was deleted elsewhere, fall back to whatever's
  // first in the current list so the field never points at nothing.
  useEffect(() => {
    const list = categories[formData.type] || [];
    if (list.length && !list.includes(formData.category)) {
      setFormData((prev) => ({ ...prev, category: list[0] }));
    }
  }, [categories, formData.type, formData.category]);

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value
    }));
  };

  // Switching type swaps the category list too, so the selection can't be left
  // pointing at a category that doesn't exist on the other side.
  const setType = (value) => {
    setFormData((prev) => ({
      ...prev,
      type: value,
      category: (categories[value] || [])[0] || '',
      ...(value === 'income' ? { isRecurring: false, recurringDay: '' } : {})
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
        category: categories.expense?.[0] || '',
        description: '',
        date: getDefaultDate(currentMonth),
        isRecurring: false,
        recurringDay: ''
      });
      toast.success(formData.type === 'income' ? 'Income added' : 'Expense added');
    } catch (err) {
      setError(err.response?.data?.error || 'Error adding transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="font-display text-[1.0625rem] font-semibold text-ink">Add a transaction</h2>
      <p className="mt-0.5 text-[0.8125rem] text-ink-mute">
        It lands in whichever month the date falls in.
      </p>

      {error && (
        <Callout tone="error" className="mt-4">
          {error}
        </Callout>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        {/* A binary choice, so it's two buttons rather than a dropdown. */}
        <div
          className="grid grid-cols-2 gap-1 rounded-field bg-sunken p-1"
          role="group"
          aria-label="Transaction type"
        >
          {TYPES.map(({ value, label, Icon, active }) => {
            const isActive = formData.type === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setType(value)}
                aria-pressed={isActive}
                className={`inline-flex h-9 items-center justify-center gap-2 rounded-[0.55rem] text-[0.8125rem] font-medium transition-colors duration-150 ${
                  isActive
                    ? `bg-surface font-semibold shadow-card ${active}`
                    : 'text-ink-mute hover:text-ink'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            );
          })}
        </div>

        <Field label="Amount" htmlFor="tx-amount" required>
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[0.8125rem] font-medium text-ink-mute">
              {currency}
            </span>
            <Input
              id="tx-amount"
              type="number"
              inputMode="decimal"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
              className="tnum pl-14"
            />
          </div>
        </Field>

        <CategoryDropdown
          value={formData.category}
          onChange={(cat) => setFormData((prev) => ({ ...prev, category: cat }))}
          categories={categories[formData.type] || []}
          onAddCategory={(name) => onAddCategory(formData.type, name)}
          onDeleteCategory={(name) => onDeleteCategory(formData.type, name)}
        />

        <Field label="Description" htmlFor="tx-description">
          <Input
            id="tx-description"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="What was it for?"
          />
        </Field>

        <Field label="Date" htmlFor="tx-date" required>
          <Input
            id="tx-date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="tnum"
          />
        </Field>

        {/* Recurring bill toggle — only relevant for expenses */}
        {formData.type === 'expense' && (
          <div className="rounded-field border border-line px-3.5 py-3">
            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                name="isRecurring"
                checked={formData.isRecurring}
                onChange={handleChange}
                className="h-4 w-4 rounded accent-sage"
              />
              <RecurringIcon className="h-4 w-4 text-ink-mute" />
              <span className="text-[0.875rem] font-medium text-ink-soft">
                Repeats every month
              </span>
            </label>
            {formData.isRecurring && (
              <Field label="Due on day of month" htmlFor="tx-recurring-day" className="mt-3" hint="Optional — used to remind you on the Bills page.">
                <Input
                  id="tx-recurring-day"
                  type="number"
                  inputMode="numeric"
                  name="recurringDay"
                  value={formData.recurringDay}
                  onChange={handleChange}
                  placeholder="15"
                  min="1"
                  max="31"
                  className="tnum"
                />
              </Field>
            )}
          </div>
        )}

        <Button type="submit" variant="primary" full disabled={loading || !householdId}>
          {!loading && <PlusIcon className="h-4 w-4" />}
          {loading ? 'Adding…' : 'Add transaction'}
        </Button>
      </form>
    </Card>
  );
}
