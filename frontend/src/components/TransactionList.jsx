import { useMemo, useState } from 'react';
import Modal from './Modal';
import CategoryDropdown from './CategoryDropdown';
import Badge from './ui/Badge';
import Button from './ui/Button';
import EmptyState from './ui/EmptyState';
import { Field, Input, Select } from './ui/Field';
import { EditIcon, ExpenseIcon, IncomeIcon, RecurringIcon, ReviewIcon, TrashIcon } from './icons';
import { dateLabel, money, ordinal } from '../utils/format';
import { DEFAULT_CATEGORIES } from '../utils/categories';

const dayKey = (date) => new Date(date).toISOString().slice(0, 10);

export default function TransactionList({
  transactions,
  onUpdate,
  onDelete,
  currency = 'NPR',
  categories = DEFAULT_CATEGORIES,
  onAddCategory,
  onDeleteCategory
}) {
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  // Grouping by day gives the list a spine: you read a date once, then the
  // entries under it, instead of re-reading the same date on every row.
  const days = useMemo(() => {
    const map = new Map();
    for (const tx of transactions) {
      const key = dayKey(tx.date);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(tx);
    }
    return [...map.entries()];
  }, [transactions]);

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
      ...(name === 'type' && { category: (categories[value] || [])[0] || '' })
    }));
  };

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
      <EmptyState icon={<ReviewIcon />} title="Nothing logged yet">
        Add a transaction and it'll show up here, newest first.
      </EmptyState>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {days.map(([day, items]) => {
          const dayNet = items.reduce(
            (sum, tx) => sum + (tx.type === 'income' ? 1 : -1) * parseFloat(tx.amount),
            0
          );

          return (
            <div key={day}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3 border-b border-line pb-1.5">
                <p className="eyebrow">{dateLabel(day)}</p>
                <p
                  className={`tnum text-[0.75rem] font-semibold ${
                    dayNet < 0 ? 'text-clay' : 'text-moss'
                  }`}
                >
                  {money(dayNet, currency, { signed: true, decimals: false })}
                </p>
              </div>

              <ul>
                {items.map((tx) => {
                  const isIncome = tx.type === 'income';
                  const amount = parseFloat(tx.amount);

                  return (
                    <li
                      key={tx.id}
                      className="group -mx-2 flex items-center gap-3.5 rounded-xl px-2 py-2.5 transition-colors hover:bg-sunken"
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                          isIncome ? 'bg-moss-soft text-moss' : 'bg-clay-soft text-clay'
                        }`}
                      >
                        {isIncome ? (
                          <IncomeIcon className="h-[1.15rem] w-[1.15rem]" />
                        ) : (
                          <ExpenseIcon className="h-[1.15rem] w-[1.15rem]" />
                        )}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <p className="truncate text-[0.9375rem] font-medium text-ink">
                            {tx.description || tx.category}
                          </p>
                          {tx.isRecurring && (
                            <Badge tone="sage" icon={<RecurringIcon className="h-3 w-3" />}>
                              {tx.recurringDay ? `Monthly · ${ordinal(tx.recurringDay)}` : 'Monthly'}
                            </Badge>
                          )}
                        </div>
                        <p className="mt-0.5 truncate text-[0.75rem] text-ink-mute">
                          {tx.category}
                          {tx.User?.name && ` · ${tx.User.name}`}
                        </p>
                      </div>

                      <p
                        className={`tnum shrink-0 text-[0.9375rem] font-semibold ${
                          isIncome ? 'text-moss' : 'text-ink'
                        }`}
                      >
                        {money(isIncome ? amount : -amount, currency, {
                          signed: true,
                          decimals: 'auto'
                        })}
                      </p>

                      <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100 max-sm:opacity-100">
                        <Button
                          variant="ghost"
                          size="sm"
                          iconOnly
                          className="h-8 w-8"
                          onClick={() => openEdit(tx)}
                          aria-label={`Edit ${tx.description || tx.category}`}
                          title="Edit"
                        >
                          <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          iconOnly
                          className="h-8 w-8"
                          onClick={() => handleDelete(tx.id)}
                          aria-label={`Delete ${tx.description || tx.category}`}
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      {editingTransaction && (
        <Modal title="Edit transaction" onClose={() => setEditingTransaction(null)}>
          <form onSubmit={handleUpdate} className="space-y-4">
            <Field label="Type" htmlFor="edit-type">
              <Select id="edit-type" name="type" value={formData.type} onChange={handleChange}>
                <option value="expense">Money out</option>
                <option value="income">Money in</option>
              </Select>
            </Field>

            <Field label="Amount" htmlFor="edit-amount" required>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[0.8125rem] font-medium text-ink-mute">
                  {currency}
                </span>
                <Input
                  id="edit-amount"
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
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

            <Field label="Description" htmlFor="edit-description">
              <Input
                id="edit-description"
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What was it for?"
              />
            </Field>

            <Field label="Date" htmlFor="edit-date" required>
              <Input
                id="edit-date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="tnum"
              />
            </Field>

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
                  <Input
                    type="number"
                    name="recurringDay"
                    value={formData.recurringDay}
                    onChange={handleChange}
                    placeholder="Due day (1–31)"
                    min="1"
                    max="31"
                    aria-label="Due day of month"
                    className="tnum mt-3"
                  />
                )}
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <Button variant="secondary" full onClick={() => setEditingTransaction(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" full disabled={loading}>
                {loading ? 'Saving…' : 'Save changes'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
