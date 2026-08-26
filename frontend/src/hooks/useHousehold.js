import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export const useHousehold = () => {
  const [household, setHousehold] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHousehold = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/household');
      setHousehold(data.household);
      localStorage.setItem('householdId', data.household.id);
      return data.household;
    } catch (err) {
      if (err.response?.status === 404) {
        setHousehold(null);
        localStorage.removeItem('householdId');
        return null;
      }
      setError(err.response?.data?.error || 'Failed to load household');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createHousehold = async (name, currency = 'NPR') => {
    const { data } = await api.post('/household', { name, currency });
    setHousehold(data.household);
    localStorage.setItem('householdId', data.household.id);
    return data;
  };

  const joinHousehold = async (inviteCode) => {
    const { data } = await api.post('/household/join', { inviteCode });
    setHousehold(data.household);
    localStorage.setItem('householdId', data.household.id);
    return data;
  };

  // Replaces the whole { expense, income } category list for the household.
  // Callers compute the new list locally (after an add or delete) and pass
  // the full result here.
  const updateCategories = async (categories) => {
    if (!household) return;
    const { data } = await api.put(`/household/${household.id}/categories`, { categories });
    setHousehold(data.household);
    return data.household;
  };

  useEffect(() => {
    fetchHousehold();
  }, [fetchHousehold]);

  return {
    household,
    loading,
    error,
    fetchHousehold,
    createHousehold,
    joinHousehold,
    updateCategories
  };
};
