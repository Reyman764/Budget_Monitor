import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHousehold } from '../hooks/useHousehold';
import { useTransactions } from '../hooks/useTransactions';
import AppShell from '../components/AppShell';
import Modal from '../components/Modal';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Callout from '../components/ui/Callout';
import EmptyState from '../components/ui/EmptyState';
import Loader from '../components/ui/Loader';
import { SkeletonRows } from '../components/ui/Skeleton';
import Meter from '../components/ui/Meter';
import PageHeader from '../components/ui/PageHeader';
import Stat from '../components/ui/Stat';
import { Card, SectionCard } from '../components/ui/Card';
import { Field, Input, Select } from '../components/ui/Field';
import {
  BillsIcon,
  CheckIcon,
  PlusIcon,
  TrashIcon
} from '../components/icons';
import { getCategoryIcon } from '../utils/categoryIcons';
import { money, monthLabel, ordinal } from '../utils/format';
import { DEFAULT_CATEGORIES } from '../utils/categories';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';

export default function Bills() {
  const { household, loading: householdLoading } = useHousehold();
  const navigate = useNavigate();
  const householdId = household?.id || null;
  const currency = household?.currency || 'NPR';
  const expenseCategories = household?.categories?.expense || DEFAULT_CATEGORIES.expense;

  const { transactions, loading, fetchTransactions, payBill, deleteTransaction } = useTransactions(householdId);
  const toast = useToast();

  // All recurring bill templates
  const [bills, setBills] = useState([]);
  // Transactions paid in the current month (to mark bills as paid)
  const [paidThisMonth, setPaidThisMonth] = useState([]);
  const [payingId, setPayingId] = useState(null);
  const [payError, setPayError] = useState('');

  // Add-bill modal state
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ amount: '', category: 'Bills', description: '', recurringDay: '' });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  const currentMonth = new Date().toISOString().slice(0, 7);

  const loadBills = useCallback(async () => {
    if (!householdId) return;
    // Fetch recurring templates (no month filter — show all time)
    await fetchTransactions({ recurring: 'true' });
  }, [householdId, fetchTransactions]);

  useEffect(() => {
    if (!householdLoading && !household) navigate('/household-setup');
  }, [household, householdLoading, navigate]);

  useEffect(() => {
    loadBills();
  }, [loadBills]);

  // Keep bills list in sync with the transactions array from the hook
  useEffect(() => {
    setBills(transactions.filter((t) => t.isRecurring));
  }, [transactions]);

  // Separately fetch this month's payments to know which bills are already paid
  useEffect(() => {
    if (!householdId) return;
    api
      .get(`/transactions/${householdId}`, { params: { month: currentMonth, type: 'expense' } })
      .then(({ data }) => setPaidThisMonth(data.transactions || []))
      .catch(() => {});
  }, [householdId, currentMonth]);

  // A bill is considered "paid" if there's a non-recurring expense this month with the same category
  const isPaidThisMonth = (bill) =>
    paidThisMonth.some(
      (t) =>
        !t.isRecurring &&
        t.category === bill.category &&
        (t.description || '').includes(bill.description || bill.category)
    );

  const handlePay = async (bill) => {
    setPayingId(bill.id);
    setPayError('');
    try {
      await payBill(bill.id);
      // Refresh paid list
      const { data } = await api.get(`/transactions/${householdId}`, {
        params: { month: currentMonth, type: 'expense' }
      });
      setPaidThisMonth(data.transactions || []);
      toast.success(`Marked "${bill.description || bill.category}" as paid`);
    } catch (err) {
      setPayError(err.response?.data?.error || 'Failed to log that payment. Try again.');
    } finally {
      setPayingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this recurring bill?')) return;
    try {
      await deleteTransaction(id);
      toast.success('Bill removed');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to remove that bill');
    }
  };

  const handleAddBill = async (e) => {
    e.preventDefault();
    setAddError('');
    setAddLoading(true);
    try {
      await api.post('/transactions', {
        ...addForm,
        amount: parseFloat(addForm.amount),
        type: 'expense',
        isRecurring: true,
        recurringDay: addForm.recurringDay ? parseInt(addForm.recurringDay, 10) : null,
        date: new Date().toISOString().split('T')[0],
        householdId
      });
      setShowAdd(false);
      setAddForm({ amount: '', category: 'Bills', description: '', recurringDay: '' });
      loadBills();
      toast.success('Bill added');
    } catch (err) {
      setAddError(err.response?.data?.error || 'Failed to add bill');
    } finally {
      setAddLoading(false);
    }
  };

  const totalMonthly = bills.reduce((sum, b) => sum + parseFloat(b.amount), 0);
  const paidCount = bills.filter(isPaidThisMonth).length;
  const outstanding = bills
    .filter((b) => !isPaidThisMonth(b))
    .reduce((sum, b) => sum + parseFloat(b.amount), 0);
  const paidPct = bills.length ? (paidCount / bills.length) * 100 : 0;

  // Bills read as a calendar, so they're ordered by the day they fall due —
  // undated ones last.
  const ordered = [...bills].sort(
    (a, b) => (a.recurringDay || 99) - (b.recurringDay || 99)
  );

  if (householdLoading) {
    return <Loader full label="Loading your household" />;
  }

  return (
    <AppShell household={household}>
      <PageHeader
        eyebrow="Recurring"
        title="Bills"
        description="The payments that come round every month. Mark one paid and it lands in this month's ledger."
        actions={
          <Button variant="primary" onClick={() => setShowAdd(true)}>
            <PlusIcon className="h-4 w-4" />
            Add bill
          </Button>
        }
      />

      <div className="mt-8 space-y-6">
        {payError && <Callout tone="error">{payError}</Callout>}

        <Card className="rise">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <Stat label="Bills" value={bills.length} />
            <Stat
              label={`Paid in ${monthLabel(currentMonth, { short: true })}`}
              value={`${paidCount} of ${bills.length}`}
              tone={bills.length && paidCount === bills.length ? 'moss' : 'ink'}
            />
            <Stat label="Still to pay" value={money(outstanding, currency, { decimals: false })} tone="clay" />
            <Stat label="Every month" value={money(totalMonthly, currency, { decimals: false })} />
          </div>

          {bills.length > 0 && (
            <div className="mt-6 border-t border-line pt-5">
              <Meter percent={paidPct} tone={paidCount === bills.length ? 'moss' : 'sage'} />
              <p className="mt-2.5 text-[0.8125rem] text-ink-mute">
                {paidCount === bills.length
                  ? 'Everything for this month is settled.'
                  : `${bills.length - paidCount} left to settle this month.`}
              </p>
            </div>
          )}
        </Card>

        <SectionCard
          title="Every bill"
          description={ordered.length ? 'Ordered by the day they fall due' : undefined}
          className="rise"
          bodyClassName="-mx-2 sm:-mx-3"
        >
          {loading ? (
            <SkeletonRows count={4} label="Loading bills" />
          ) : ordered.length === 0 ? (
            <EmptyState
              icon={<BillsIcon className="h-5 w-5" />}
              title="No recurring bills yet"
              action={
                <Button variant="primary" onClick={() => setShowAdd(true)}>
                  <PlusIcon className="h-4 w-4" />
                  Add your first bill
                </Button>
              }
            >
              Add rent, internet, or anything else that repeats, and you can log each month's
              payment in one tap.
            </EmptyState>
          ) : (
            <ul>
              {ordered.map((bill) => {
                const paid = isPaidThisMonth(bill);
                const CategoryIcon = getCategoryIcon(bill.category);
                return (
                  <li
                    key={bill.id}
                    className="group flex items-center gap-3 rounded-[1rem] px-3 py-3 transition-colors duration-150 hover:bg-sunken sm:gap-4"
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        paid ? 'bg-moss-soft text-moss' : 'bg-sunken text-ink-mute'
                      }`}
                    >
                      <CategoryIcon className="h-[1.15rem] w-[1.15rem]" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="break-words text-[0.9375rem] font-medium text-ink">
                        {bill.description || bill.category}
                      </p>
                      <p className="mt-0.5 break-words text-[0.8125rem] text-ink-mute">
                        {bill.category}
                        {bill.recurringDay ? ` · due the ${ordinal(bill.recurringDay)}` : ''}
                      </p>
                    </div>

                    <p className="tnum shrink-0 text-[0.9375rem] font-semibold text-ink">
                      {money(bill.amount, currency, { decimals: false })}
                    </p>

                    <div className="flex shrink-0 items-center gap-2.5">
                      {paid ? (
                        <Badge tone="moss" className="pop">
                          <CheckIcon className="h-3.5 w-3.5" />
                          Paid
                        </Badge>
                      ) : (
                        <Button
                          variant="soft"
                          size="sm"
                          onClick={() => handlePay(bill)}
                          disabled={payingId === bill.id}
                        >
                          {payingId === bill.id ? 'Logging…' : 'Mark paid'}
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        iconOnly
                        onClick={() => handleDelete(bill.id)}
                        aria-label={`Remove ${bill.description || bill.category}`}
                        className="text-ink-mute opacity-0 transition-opacity duration-150 hover:text-clay group-hover:opacity-100 focus-visible:opacity-100 max-sm:opacity-100"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </SectionCard>
      </div>

      {showAdd && (
        <Modal
          title="Add a recurring bill"
          description="It won't be counted as spent until you mark it paid."
          onClose={() => setShowAdd(false)}
        >
          <form onSubmit={handleAddBill} className="space-y-4" noValidate>
            {addError && <Callout tone="error">{addError}</Callout>}

            <Field label="What is it" htmlFor="bill-description">
              <Input
                id="bill-description"
                type="text"
                value={addForm.description}
                onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                placeholder="Internet"
                required
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Amount" htmlFor="bill-amount">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[0.8125rem] font-medium text-ink-mute">
                    {currency}
                  </span>
                  <Input
                    id="bill-amount"
                    type="number"
                    inputMode="decimal"
                    value={addForm.amount}
                    onChange={(e) => setAddForm({ ...addForm, amount: e.target.value })}
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    className="tnum pl-14"
                    required
                  />
                </div>
              </Field>

              <Field label="Due day" htmlFor="bill-day" hint="Optional">
                <Input
                  id="bill-day"
                  type="number"
                  inputMode="numeric"
                  value={addForm.recurringDay}
                  onChange={(e) => setAddForm({ ...addForm, recurringDay: e.target.value })}
                  placeholder="15"
                  min="1"
                  max="31"
                  className="tnum"
                />
              </Field>
            </div>

            <Field label="Category" htmlFor="bill-category">
              <Select
                id="bill-category"
                value={addForm.category}
                onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
              >
                {expenseCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>

            <div className="flex gap-2.5 pt-1">
              <Button variant="secondary" onClick={() => setShowAdd(false)} full>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={addLoading} full>
                {addLoading ? 'Adding…' : 'Add bill'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </AppShell>
  );
}
