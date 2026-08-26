import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHousehold } from '../hooks/useHousehold';
import AuthLayout from '../components/AuthLayout';
import Button from '../components/ui/Button';
import Callout from '../components/ui/Callout';
import Loader from '../components/ui/Loader';
import { Field, Input } from '../components/ui/Field';
import { ArrowRightIcon, CheckIcon, CopyIcon, HouseholdIcon, PlusIcon } from '../components/icons';

const MODES = [
  { value: 'create', label: 'Start one', Icon: PlusIcon },
  { value: 'join', label: 'Join one', Icon: HouseholdIcon }
];

export default function HouseholdSetup() {
  const [mode, setMode] = useState('create');
  const [householdName, setHouseholdName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [createdInviteCode, setCreatedInviteCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { household, loading: householdLoading, createHousehold, joinHousehold } = useHousehold();
  const navigate = useNavigate();

  useEffect(() => {
    if (!householdLoading && household && !createdInviteCode) {
      navigate('/dashboard');
    }
  }, [household, householdLoading, createdInviteCode, navigate]);

  if (householdLoading) {
    return <Loader full label="Checking your household" />;
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await createHousehold(householdName, 'NPR');
      setCreatedInviteCode(data.inviteCode);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create household');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await joinHousehold(inviteCode);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to join household');
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(createdInviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard is blocked outside secure contexts — the code is on screen anyway.
    }
  };

  if (createdInviteCode) {
    return (
      <AuthLayout
        title="Your household is ready"
        description="Send this code to the person you budget with. It's the only thing they need to land in the same ledger."
      >
        <div className="text-center">
          <p className="eyebrow">Invite code</p>
          <p className="tnum font-display mt-3 text-[2.25rem] font-semibold tracking-[0.2em] text-ink sm:text-[2.5rem]">
            {createdInviteCode}
          </p>

          <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
            <Button variant="secondary" size="lg" onClick={copy} full>
              {copied ? (
                <CheckIcon className="h-4 w-4 text-moss" />
              ) : (
                <CopyIcon className="h-4 w-4" />
              )}
              {copied ? 'Copied' : 'Copy code'}
            </Button>
            <Button variant="primary" size="lg" onClick={() => navigate('/dashboard')} full>
              Go to overview
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>

          <p className="mt-5 text-[0.8125rem] leading-relaxed text-ink-mute">
            You can find this code again any time on your overview.
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Set up your household"
      description="A household is the shared space your transactions, bills, and goals live in."
    >
      {/* Two ways in, so it's two buttons rather than a dropdown. */}
      <div
        className="grid grid-cols-2 gap-1 rounded-field bg-sunken p-1"
        role="group"
        aria-label="Household setup mode"
      >
        {MODES.map(({ value, label, Icon }) => {
          const isActive = mode === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => {
                setMode(value);
                setError('');
              }}
              aria-pressed={isActive}
              className={`inline-flex h-10 items-center justify-center gap-2 rounded-[0.55rem] text-[0.8125rem] transition-colors duration-150 ${
                isActive
                  ? 'bg-surface font-semibold text-sage shadow-card'
                  : 'font-medium text-ink-soft hover:text-ink'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          );
        })}
      </div>

      {error && <Callout tone="error" className="mt-4">{error}</Callout>}

      {mode === 'create' ? (
        <form onSubmit={handleCreate} className="mt-5 space-y-4" noValidate>
          <Field
            label="Household name"
            htmlFor="householdName"
            hint="Just for you — you can change it in settings."
          >
            <Input
              id="householdName"
              type="text"
              placeholder="Our home budget"
              value={householdName}
              onChange={(e) => setHouseholdName(e.target.value)}
              required
            />
          </Field>

          <Button type="submit" variant="primary" size="lg" full disabled={loading}>
            {loading ? 'Creating…' : 'Create household'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleJoin} className="mt-5 space-y-4" noValidate>
          <Field
            label="Invite code"
            htmlFor="inviteCode"
            hint="Eight characters, from whoever set up the household."
          >
            <Input
              id="inviteCode"
              type="text"
              placeholder="ABCD1234"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              className="tnum text-center font-semibold tracking-[0.28em] uppercase"
              required
              maxLength={8}
              autoCapitalize="characters"
              autoComplete="off"
              spellCheck="false"
            />
          </Field>

          <Button type="submit" variant="primary" size="lg" full disabled={loading}>
            {loading ? 'Joining…' : 'Join household'}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
