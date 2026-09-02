import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHousehold } from '../hooks/useHousehold';
import { useGoals } from '../hooks/useGoals';
import AppShell from '../components/AppShell';
import Modal from '../components/Modal';
import GoalsTracker from '../components/GoalsTracker';
import Button from '../components/ui/Button';
import Callout from '../components/ui/Callout';
import Loader from '../components/ui/Loader';
import { SkeletonCards } from '../components/ui/Skeleton';
import Meter from '../components/ui/Meter';
import PageHeader from '../components/ui/PageHeader';
import Stat from '../components/ui/Stat';
import { Card } from '../components/ui/Card';
import { Field, Input } from '../components/ui/Field';
import { PlusIcon } from '../components/icons';
import { money } from '../utils/format';
import { useToast } from '../context/ToastContext';

export default function Goals() {
  const { household, loading: householdLoading } = useHousehold();
  const navigate = useNavigate();
  const householdId = household?.id || null;
  const currency = household?.currency || 'NPR';
  const toast = useToast();

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
      toast.success('Goal added');
    } catch (err) {
      setAddError(err.response?.data?.error || 'Failed to add goal');
    } finally {
      setAddLoading(false);
    }
  };

  const handleAddFunds = (id, newCurrentAmount) => updateGoal(id, { currentAmount: newCurrentAmount });

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this savings goal?')) return;
    try {
      await deleteGoal(id);
      toast.success('Goal removed');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to remove that goal');
    }
  };

  const totalSaved = goals.reduce((sum, g) => sum + parseFloat(g.currentAmount), 0);
  const totalTarget = goals.reduce((sum, g) => sum + parseFloat(g.targetAmount), 0);
  const reachedCount = goals.filter((g) => parseFloat(g.currentAmount) >= parseFloat(g.targetAmount)).length;
  const overallPct = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  if (householdLoading) {
    return <Loader full label="Loading your household" />;
  }

  return (
    <AppShell household={household}>
      <PageHeader
        eyebrow="Saving towards"
        title="Goals"
        description="Money you're setting aside on purpose, and how close each one is."
        actions={
          <Button variant="primary" onClick={() => setShowAdd(true)}>
            <PlusIcon className="h-4 w-4" />
            Add goal
          </Button>
        }
      />

      <div className="mt-8 space-y-6">
        {goals.length > 0 && (
          <Card className="rise">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
              <Stat
                label="Saved so far"
                value={money(totalSaved, currency, { decimals: false })}
                tone="moss"
                size="lg"
              />
              <Stat label="Across all targets" value={money(totalTarget, currency, { decimals: false })} />
              <Stat
                label="Goals reached"
                value={`${reachedCount} of ${goals.length}`}
                tone={reachedCount === goals.length ? 'moss' : 'ink'}
              />
            </div>

            <div className="mt-6 border-t border-line pt-5">
              <Meter percent={overallPct} tone="moss" />
              <p className="mt-2.5 text-[0.8125rem] text-ink-mute">
                {Math.round(overallPct)}% of everything you're saving towards is funded.
              </p>
            </div>
          </Card>
        )}

        {loading ? (
          <SkeletonCards count={2} label="Loading goals" />
        ) : (
          <GoalsTracker
            goals={goals}
            currency={currency}
            onAddFunds={handleAddFunds}
            onDelete={handleDelete}
          />
        )}
      </div>

      {showAdd && (
        <Modal
          title="Add a savings goal"
          description="Name it and set a target. You can add to it any time."
          onClose={() => setShowAdd(false)}
        >
          <form onSubmit={handleAddGoal} className="space-y-4" noValidate>
            {addError && <Callout tone="error">{addError}</Callout>}

            <Field label="What are you saving for" htmlFor="goal-name">
              <Input
                id="goal-name"
                type="text"
                value={addForm.goalName}
                onChange={(e) => setAddForm({ ...addForm, goalName: e.target.value })}
                placeholder="Emergency fund"
                required
              />
            </Field>

            <Field label="Target amount" htmlFor="goal-target">
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[0.8125rem] font-medium text-ink-mute">
                  {currency}
                </span>
                <Input
                  id="goal-target"
                  type="number"
                  inputMode="decimal"
                  value={addForm.targetAmount}
                  onChange={(e) => setAddForm({ ...addForm, targetAmount: e.target.value })}
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  className="tnum pl-14"
                  required
                />
              </div>
            </Field>

            <Field label="Target date" htmlFor="goal-deadline" hint="Optional — adds a countdown.">
              <Input
                id="goal-deadline"
                type="date"
                value={addForm.deadline}
                onChange={(e) => setAddForm({ ...addForm, deadline: e.target.value })}
              />
            </Field>

            <div className="flex gap-2.5 pt-1">
              <Button variant="secondary" onClick={() => setShowAdd(false)} full>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={addLoading} full>
                {addLoading ? 'Adding…' : 'Add goal'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </AppShell>
  );
}
