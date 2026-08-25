import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHousehold } from '../hooks/useHousehold';

const inputClass =
  'w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100';

export default function HouseholdSetup() {
  const [mode, setMode] = useState('create');
  const [householdName, setHouseholdName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [createdInviteCode, setCreatedInviteCode] = useState('');
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <p className="text-gray-600 dark:text-slate-300">Loading...</p>
      </div>
    );
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

  if (createdInviteCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 px-4 dark:from-slate-900 dark:to-slate-950">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center dark:bg-slate-800">
          <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-slate-100">
            Household Created!
          </h1>
          <p className="text-gray-600 mb-4 dark:text-slate-400">
            Share this invite code with your partner:
          </p>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6 dark:bg-blue-950 dark:border-blue-800">
            <p className="text-3xl font-bold tracking-widest text-blue-600 dark:text-blue-300">
              {createdInviteCode}
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 px-4 dark:from-slate-900 dark:to-slate-950">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md dark:bg-slate-800">
        <h1 className="text-2xl font-bold mb-2 text-center text-gray-800 dark:text-slate-100">
          Set Up Your Household
        </h1>
        <p className="text-gray-500 text-center mb-6 text-sm dark:text-slate-400">
          Create a new household or join your partner with an invite code
        </p>

        <div className="flex mb-6 border border-gray-200 rounded-lg overflow-hidden dark:border-slate-700">
          <button
            type="button"
            onClick={() => setMode('create')}
            className={`flex-1 py-2 text-sm font-medium ${
              mode === 'create'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            Create New
          </button>
          <button
            type="button"
            onClick={() => setMode('join')}
            className={`flex-1 py-2 text-sm font-medium ${
              mode === 'join'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            Join Existing
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 dark:bg-red-950 dark:border-red-900 dark:text-red-300">
            {error}
          </div>
        )}

        {mode === 'create' ? (
          <form onSubmit={handleCreate}>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-300">
              Household Name
            </label>
            <input
              type="text"
              placeholder="e.g. Our Home Budget"
              value={householdName}
              onChange={(e) => setHouseholdName(e.target.value)}
              className={inputClass}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Household'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleJoin}>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-300">
              Invite Code
            </label>
            <input
              type="text"
              placeholder="Enter 8-character code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              className={`${inputClass} uppercase tracking-widest`}
              required
              maxLength={8}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50"
            >
              {loading ? 'Joining...' : 'Join Household'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
