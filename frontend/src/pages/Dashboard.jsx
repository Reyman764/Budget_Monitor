import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHousehold } from '../hooks/useHousehold';
import { useTransactions } from '../hooks/useTransactions';
import { useBudget } from '../hooks/useBudget';
import AppShell from '../components/AppShell';
import BalanceHero from '../components/BalanceHero';
import MonthPicker from '../components/MonthPicker';
import InviteCode from '../components/InviteCode';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import FilterBar from '../components/FilterBar';
import CategoryChart from '../components/CategoryChart';
import TrendChart from '../components/TrendChart';
import BudgetAlerts from '../components/BudgetAlerts';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import PageHeader from '../components/ui/PageHeader';
import { SectionCard } from '../components/ui/Card';
import { ArrowRightIcon, FilterIcon } from '../components/icons';
import { DEFAULT_CATEGORIES } from '../utils/categories';

const DEFAULT_FILTERS = { type: '', category: '', startDate: '', endDate: '', search: '' };

export default function Dashboard() {
  const { user } = useAuth();
  const { household, loading: householdLoading, updateCategories } = useHousehold();
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

  // The household's own editable category list, falling back to sensible
  // defaults until it's loaded (or for a household that hasn't customized
  // it yet).
  const categories = household?.categories || DEFAULT_CATEGORIES;

  const addCategory = async (type, name) => {
    const current = categories[type] || [];
    if (current.some((c) => c.toLowerCase() === name.toLowerCase())) return;
    await updateCategories({ ...categories, [type]: [...current, name] });
  };

  const deleteCategory = async (type, name) => {
    const current = categories[type] || [];
    if (current.length <= 1) {
      alert('You need at least one category in this list.');
      return;
    }
    await updateCategories({ ...categories, [type]: current.filter((c) => c !== name) });
  };

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

  const hasActiveFilters = Object.values(filters).some(Boolean);

  if (householdLoading) {
    return <Loader full label="Loading your household" />;
  }

  return (
    <AppShell household={household}>
      <PageHeader
        eyebrow={`Hi, ${user?.name?.split(' ')[0] || 'there'}`}
        title="Overview"
        actions={
          <>
            <MonthPicker value={currentMonth} onChange={setCurrentMonth} />
            <Button
              variant={hasActiveFilters ? 'soft' : 'secondary'}
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
            >
              <FilterIcon className="h-4 w-4" />
              Filters
              {hasActiveFilters && <span className="h-1.5 w-1.5 rounded-full bg-sage" />}
            </Button>
          </>
        }
      />

      <div className="mt-8 space-y-6">
        {showFilters && <FilterBar filters={filters} onChange={setFilters} categories={categories} />}

        <BalanceHero
          month={currentMonth}
          income={income}
          expense={expense}
          balance={balance}
          currency={currency}
          netWorth={hasActiveFilters ? null : netWorth}
        />

        {/* The month's headline figure comes first; what needs attention sits
            directly under it. */}
        <BudgetAlerts budgets={budgets} currency={currency} />

        {household?.inviteCode && !hasActiveFilters && <InviteCode code={household.inviteCode} />}

        <div className="rise grid grid-cols-1 gap-6 lg:grid-cols-3" style={{ '--rise-delay': '90ms' }}>
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-[5.5rem]">
              <TransactionForm
                onAdd={addTransaction}
                householdId={householdId}
                currentMonth={currentMonth}
                currency={currency}
                categories={categories}
                onAddCategory={addCategory}
                onDeleteCategory={deleteCategory}
              />
            </div>
          </div>

          <SectionCard
            className="lg:col-span-2"
            title="Transactions"
            description={hasActiveFilters ? 'Filtered view' : 'Everything logged this month'}
            action={
              hasActiveFilters && (
                <Badge tone="sage">
                  {transactions.length} result{transactions.length !== 1 ? 's' : ''}
                </Badge>
              )
            }
          >
            {loading ? (
              <Loader label="Loading transactions" />
            ) : (
              <TransactionList
                transactions={transactions}
                onUpdate={updateTransaction}
                onDelete={deleteTransaction}
                currency={currency}
                categories={categories}
                onAddCategory={addCategory}
                onDeleteCategory={deleteCategory}
              />
            )}
          </SectionCard>
        </div>

        {/* Charts section — only show when no custom filters distort the view */}
        {!hasActiveFilters && (
          <section className="rise pt-4" style={{ '--rise-delay': '160ms' }}>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="eyebrow mb-1">Insights</p>
                <h2 className="font-display text-[1.25rem] font-semibold text-ink">
                  Where the month went
                </h2>
              </div>
              <Button as={Link} to="/monthly-review" variant="ghost" size="sm">
                Full report
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <CategoryChart transactions={transactions} currency={currency} />
              <TrendChart transactions={transactions} currency={currency} />
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}
