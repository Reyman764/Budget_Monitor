import { useState } from 'react';
import Badge from './ui/Badge';
import Button from './ui/Button';
import Callout from './ui/Callout';
import EmptyState from './ui/EmptyState';
import Meter from './ui/Meter';
import { Card } from './ui/Card';
import { Input } from './ui/Field';
import { CalendarIcon, CheckIcon, GoalsIcon, PlusIcon, TrashIcon } from './icons';
import { dateLabel, money } from '../utils/format';

const daysRemaining = (deadline) => {
  if (!deadline) return null;
  const diffMs = new Date(deadline).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
};

const plural = (n, word) => `${n} ${word}${n !== 1 ? 's' : ''}`;

export default function GoalsTracker({ goals, currency = 'NPR', onAddFunds, onDelete }) {
  // Draft "add funds" amount per goal, keyed by goal id
  const [drafts, setDrafts] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState('');

  const setDraft = (id, value) => setDrafts((prev) => ({ ...prev, [id]: value }));

  const handleAddFunds = async (goal) => {
    const amount = parseFloat(drafts[goal.id]);
    if (!amount || amount <= 0) return;
    setSavingId(goal.id);
    setError('');
    try {
      await onAddFunds(goal.id, parseFloat(goal.currentAmount) + amount);
      setDraft(goal.id, '');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update that goal. Try again.');
    } finally {
      setSavingId(null);
    }
  };

  if (goals.length === 0) {
    return (
      <Card>
        <EmptyState icon={<GoalsIcon className="h-5 w-5" />} title="No goals yet">
          Name something you're saving towards — a trip, a deposit, a cushion — and add to it
          whenever there's money left over.
        </EmptyState>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {error && <Callout tone="error">{error}</Callout>}

      {goals.map((goal, i) => {
        const target = parseFloat(goal.targetAmount);
        const current = parseFloat(goal.currentAmount);
        const pct = target > 0 ? Math.round((current / target) * 100) : 0;
        const remaining = target - current;
        const days = daysRemaining(goal.deadline);
        const reached = pct >= 100;
        const overdue = days !== null && days < 0 && !reached;

        return (
          <Card key={goal.id} className="rise" style={{ '--rise-delay': `${i * 45}ms` }}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-display truncate text-[1.0625rem] font-semibold text-ink">
                    {goal.goalName}
                  </h3>
                  {reached && (
                    <Badge tone="moss">
                      <CheckIcon className="h-3.5 w-3.5" />
                      Reached
                    </Badge>
                  )}
                </div>

                <p className="tnum mt-1 text-[0.875rem] text-ink-soft">
                  <span className="font-medium text-ink">
                    {money(current, currency, { decimals: false })}
                  </span>
                  {' of '}
                  {money(target, currency, { decimals: false })}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`tnum font-display text-[1.5rem] font-semibold tracking-[-0.02em] ${
                    reached ? 'text-moss' : 'text-ink'
                  }`}
                >
                  {pct}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  iconOnly
                  onClick={() => onDelete(goal.id)}
                  aria-label={`Remove ${goal.goalName}`}
                  className="hover:text-clay"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <Meter percent={pct} tone={reached ? 'moss' : 'sage'} />
              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[0.8125rem]">
                <p className={reached ? 'font-medium text-moss' : 'text-ink-mute'}>
                  {reached
                    ? 'Fully funded.'
                    : `${money(remaining, currency, { decimals: false })} to go`}
                </p>
                {goal.deadline && (
                  <p
                    className={`inline-flex items-center gap-1.5 ${
                      overdue ? 'font-medium text-clay' : 'text-ink-mute'
                    }`}
                  >
                    <CalendarIcon className="h-3.5 w-3.5" />
                    {days >= 0
                      ? `${plural(days, 'day')} left · ${dateLabel(goal.deadline)}`
                      : `${plural(Math.abs(days), 'day')} past ${dateLabel(goal.deadline)}`}
                  </p>
                )}
              </div>
            </div>

            {!reached && (
              <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4 sm:flex-row">
                <div className="relative w-full sm:w-40">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[0.8125rem] font-medium text-ink-mute">
                    {currency}
                  </span>
                  <Input
                    type="number"
                    value={drafts[goal.id] || ''}
                    onChange={(e) => setDraft(goal.id, e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    aria-label={`Amount to add to ${goal.goalName}`}
                    className="tnum pl-14"
                  />
                </div>
                <Button
                  variant="soft"
                  onClick={() => handleAddFunds(goal)}
                  disabled={savingId === goal.id || !drafts[goal.id]}
                  className="w-full sm:w-auto"
                >
                  <PlusIcon className="h-4 w-4" />
                  {savingId === goal.id ? 'Saving…' : 'Add to goal'}
                </Button>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
