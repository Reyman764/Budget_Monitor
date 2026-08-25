import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useHousehold } from '../hooks/useHousehold';
import { useTransactions } from '../hooks/useTransactions';
import ThemeToggle from '../components/ThemeToggle';
import Modal from '../components/Modal';
import api from '../utils/api';

export default function Bills() {
  const { household, loading: householdLoading } = useHousehold();
  const navigate = useNavigate();
  const householdId = household?.id || null;
  const currency = household?.currency || 'NPR';

  const { transactions, loading, fetchTransactions, payBill, deleteTransaction } = useTransactions(householdId);

  // All recurring bill templates
  const [bills, setBills] = useState([]);
  // Transactions paid in the current month (to mark bills as paid)
  const [paidThisMonth, setPaidThisMonth] = useState([]);
  const [payingId, setPayingId] = useState(null);

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
    try {
      await payBill(bill.id);
      // Refresh paid list
      const { data } = await api.get(`/transactions/${householdId}`, {
        params: { month: currentMonth, type: 'expense' }
      });
      setPaidThisMonth(data.transactions || []);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to log payment');
    } finally {
      setPayingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this recurring bill?')) return;
    await deleteTransaction(id);
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
    } catch (err) {
      setAddError(err.response?.data?.error || 'Failed to add bill');
    } finally {
      setAddLoading(false);
    }
  };

  const totalMonthly = bills.reduce((sum, b) => sum + parseFloat(b.amount), 0);
  const paidCount = bills.filter(isPaidThisMonth).length;

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
            <h1 className="text-xl font-bold text-gray-800 dark:text-slate-100">Bill Tracker</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setShowAdd(true)}
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition"
            >
              + Add Bill
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-3xl p-4">
        {/* Summary strip */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-white p-4 shadow dark:bg-slate-800 text-center">
            <p className="text-xs text-gray-500 dark:text-slate-400">Total Bills</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{bills.length}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow dark:bg-slate-800 text-center">
            <p className="text-xs text-gray-500 dark:text-slate-400">Paid this month</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{paidCount}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow dark:bg-slate-800 text-center">
            <p className="text-xs text-gray-500 dark:text-slate-400">Monthly total</p>
            <p className="text-xl font-bold text-gray-900 dark:text-slate-100">
              {currency} {totalMonthly.toFixed(0)}
            </p>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-400 dark:text-slate-500">Loading bills...</p>
        ) : bills.length === 0 ? (
          <div className="rounded-lg bg-white p-10 shadow text-center dark:bg-slate-800">
            <p className="text-4xl mb-3">🧾</p>
            <p className="text-gray-600 dark:text-slate-400 mb-4">
              No recurring bills yet. Add your first one to track monthly payments.
            </p>
            <button
              onClick={() => setShowAdd(true)}
              className="rounded-lg bg-blue-500 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-600"
            >
              + Add First Bill
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {bills.map((bill) => {
              const paid = isPaidThisMonth(bill);
              return (
                <div
                  key={bill.id}
                  className={`flex items-center justify-between gap-3 rounded-lg border p-4 bg-white shadow-sm dark:bg-slate-800 transition ${
                    paid
                      ? 'border-green-200 dark:border-green-900'
                      : 'border-gray-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl" aria-hidden>
                      {paid ? '✅' : '🔁'}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 dark:text-slate-100 truncate">
                        {bill.description || bill.category}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-slate-500">
                        {bill.category}
                        {bill.recurringDay ? ` · due on the ${bill.recurringDay}${ordinal(bill.recurringDay)}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bold text-red-600 dark:text-red-400">
                      {currency} {parseFloat(bill.amount).toFixed(2)}
                    </span>

                    {paid ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-300">
                        Paid
                      </span>
                    ) : (
                      <button
                        onClick={() => handlePay(bill)}
                        disabled={payingId === bill.id}
                        className="rounded-lg bg-green-500 px-3 py-1 text-xs font-semibold text-white hover:bg-green-600 disabled:opacity-50 transition"
                      >
                        {payingId === bill.id ? '...' : 'Mark paid'}
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(bill.id)}
                      className="text-xs text-red-400 hover:text-red-600 dark:text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showAdd && (
        <Modal title="Add Recurring Bill" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAddBill} className="space-y-3">
            {addError && (
              <p className="text-sm text-red-600 dark:text-red-400">{addError}</p>
            )}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">Description</label>
              <input
                type="text"
                value={addForm.description}
                onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                placeholder="e.g. Internet bill"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">Monthly Amount</label>
              <input
                type="number"
                value={addForm.amount}
                onChange={(e) => setAddForm({ ...addForm, amount: e.target.value })}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">Category</label>
              <select
                value={addForm.category}
                onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              >
                {['Bills', 'Food', 'Transport', 'Entertainment', 'Shopping', 'Health', 'Other'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">
                Due on day of month (optional)
              </label>
              <input
                type="number"
                value={addForm.recurringDay}
                onChange={(e) => setAddForm({ ...addForm, recurringDay: e.target.value })}
                placeholder="e.g. 15"
                min="1"
                max="31"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <button
              type="submit"
              disabled={addLoading}
              className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50"
            >
              {addLoading ? 'Adding...' : 'Add Bill'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
