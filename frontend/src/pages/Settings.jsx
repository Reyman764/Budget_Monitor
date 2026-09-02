import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHousehold } from '../hooks/useHousehold';
import { useBudget } from '../hooks/useBudget';
import AppShell from '../components/AppShell';
import InviteCode from '../components/InviteCode';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Callout from '../components/ui/Callout';
import Loader from '../components/ui/Loader';
import Meter, { meterTone } from '../components/ui/Meter';
import PageHeader from '../components/ui/PageHeader';
import Stat from '../components/ui/Stat';
import { Card, SectionCard } from '../components/ui/Card';
import { Input } from '../components/ui/Field';
import { CheckIcon, HouseholdIcon } from '../components/icons';
import { money, monthLabel } from '../utils/format';
import { DEFAULT_CATEGORIES } from '../utils/categories';

export default function Settings() {
  const { household, loading: householdLoading } = useHousehold();
  const navigate = useNavigate();
  const householdId = household?.id || null;
  const currency = household?.currency || 'NPR';

  // Budget limits only make sense for expense categories, so the household's
  // income list isn't offered here.
  const expenseCategories = household?.categories?.expense || DEFAULT_CATEGORIES.expense;
  const thisMonth = new Date().toISOString().slice(0, 7);

  const { budgets, loading, error, fetchProgress, setLimit } = useBudget(householdId);

  const [drafts, setDrafts] = useState({});
  const [savingCategory, setSavingCategory] = useState(null);
  const [savedCategory, setSavedCategory] = useState(null);
  const [saveError, setSaveError] = useState('');

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
  // without clobbering an in-progress edit the user hasn't saved yet. The API
  // returns limits as "20000.00" strings — shown as typed, not as stored.
  useEffect(() => {
    setDrafts((prev) => {
      const next = { ...prev };
      for (const b of budgets) {
        if (next[b.category] === undefined) next[b.category] = String(Number(b.limitAmount));
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
    setSaveError('');
    try {
      await setLimit(category, parseFloat(value));
      await fetchProgress();
      setSavedCategory(category);
      setTimeout(() => setSavedCategory((c) => (c === category ? null : c)), 2000);
    } catch (err) {
      setSaveError(err.response?.data?.error || 'Failed to save that limit. Try again.');
    } finally {
      setSavingCategory(null);
    }
  };

  const totalBudgeted = budgets.reduce((s, b) => s + parseFloat(b.limitAmount), 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const overallPct = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

  if (householdLoading) {
    return <Loader full label="Loading your household" />;
  }

  return (
    <AppShell household={household}>
      <PageHeader
        eyebrow="Household"
        title="Settings"
        description={`Spending limits for ${monthLabel(thisMonth)}. You'll see an alert on the overview once a category passes 80% of its limit.`}
      />

      <div className="mt-8 space-y-6">
        {error && <Callout tone="error">{error}</Callout>}
        {saveError && <Callout tone="error">{saveError}</Callout>}

        {budgets.length > 0 && (
          <Card className="rise">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
              <Stat label="Budgeted" value={money(totalBudgeted, currency, { decimals: false })} />
              <Stat
                label="Spent"
                value={money(totalSpent, currency, { decimals: false })}
                tone={overallPct >= 100 ? 'clay' : 'ink'}
              />
              <Stat
                label="Categories with a limit"
                value={`${budgets.length} of ${expenseCategories.length}`}
              />
            </div>
            <div className="mt-6 border-t border-line pt-5">
              <Meter percent={overallPct} />
              <p className="mt-2.5 text-[0.8125rem] text-ink-mute">
                {overallPct >= 100
                  ? 'You are over the total you set for this month.'
                  : `${Math.round(overallPct)}% of your total budget used.`}
              </p>
            </div>
          </Card>
        )}

        <SectionCard
          title="Monthly limits"
          description="Set a limit per category. Leave one blank to keep it untracked."
          className="rise"
          bodyClassName="divide-y divide-line"
        >
          {loading && budgets.length === 0 ? (
            <Loader label="Loading budgets" />
          ) : (
            expenseCategories.map((category) => {
              const existing = budgetFor(category);
              const pct = existing?.percentageUsed ?? 0;
              return (
                <div
                  key={category}
                  className="flex flex-wrap items-center gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2.5">
                      <p className="text-[0.9375rem] font-medium text-ink">{category}</p>
                      {existing && pct >= 80 && (
                        <Badge tone={pct >= 100 ? 'clay' : 'honey'}>
                          {pct >= 100 ? 'Over' : 'Close'}
                        </Badge>
                      )}
                    </div>
                    <p className="tnum mt-1 text-[0.8125rem] text-ink-mute">
                      {existing
                        ? `${money(existing.spent, currency, { decimals: false })} spent · ${money(
                            existing.limitAmount,
                            currency,
                            { decimals: false }
                          )} limit`
                        : 'No limit set'}
                    </p>
                    {existing && (
                      <Meter
                        percent={pct}
                        size="sm"
                        tone={meterTone(pct)}
                        className="mt-2.5 max-w-sm"
                        label={`${category} budget used`}
                      />
                    )}
                  </div>

                  <div className="flex w-full flex-col gap-2 sm:w-auto sm:shrink-0 sm:flex-row sm:items-center">
                    <div className="relative w-full sm:w-40">
                      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[0.8125rem] font-medium text-ink-mute">
                        {currency}
                      </span>
                      <Input
                        type="number"
                        inputMode="decimal"
                        value={drafts[category] ?? ''}
                        onChange={(e) => setDrafts((prev) => ({ ...prev, [category]: e.target.value }))}
                        placeholder="0"
                        step="0.01"
                        min="0.01"
                        aria-label={`Monthly limit for ${category}`}
                        className="tnum pl-14"
                      />
                    </div>
                    <Button
                      variant={savedCategory === category ? 'soft' : 'secondary'}
                      onClick={() => handleSave(category)}
                      disabled={savingCategory === category}
                      className="w-full sm:w-auto"
                    >
                      {savingCategory === category ? (
                        'Saving…'
                      ) : savedCategory === category ? (
                        <>
                          <CheckIcon className="h-4 w-4 text-moss" />
                          Saved
                        </>
                      ) : (
                        'Save'
                      )}
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </SectionCard>

        <SectionCard
          title="This household"
          icon={<HouseholdIcon className="h-[1.15rem] w-[1.15rem]" />}
          className="rise"
        >
          <dl className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            <div>
              <dt className="eyebrow">Name</dt>
              <dd className="mt-1.5 break-words text-[0.9375rem] font-medium text-ink">
                {household?.name || '—'}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Currency</dt>
              <dd className="mt-1.5 text-[0.9375rem] font-medium text-ink">{currency}</dd>
            </div>
            <div>
              <dt className="eyebrow">Categories</dt>
              <dd className="mt-1.5 text-[0.9375rem] font-medium text-ink">
                {expenseCategories.length} out ·{' '}
                {(household?.categories?.income || DEFAULT_CATEGORIES.income).length} in
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-mute">
            Categories are edited where you use them — open the category picker on the overview to
            add or remove one.
          </p>
        </SectionCard>

        {household?.inviteCode && <InviteCode code={household.inviteCode} className="rise" />}
      </div>
    </AppShell>
  );
}
