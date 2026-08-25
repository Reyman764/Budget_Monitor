import { useState, useCallback } from 'react';
import api from '../utils/api';

export const useBudget = (householdId) => {
  const [budgets, setBudgets] = useState([]);
  const [trends, setTrends] = useState([]);
  const [netWorth, setNetWorth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Budget-vs-actual per category for a given month (defaults to current month server-side)
  const fetchProgress = useCallback(
    async (month) => {
      if (!householdId) return [];
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/budget/progress/${householdId}`, {
          params: month ? { month } : {}
        });
        setBudgets(data.budgets);
        return data.budgets;
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load budget progress');
        return [];
      } finally {
        setLoading(false);
      }
    },
    [householdId]
  );

  // Create or update a category's monthly limit
  const setLimit = async (category, limitAmount, month) => {
    const { data } = await api.post('/budget/limit', { householdId, category, limitAmount, month });
    return data.limit;
  };

  // Last 12 months of income/expense/net by default; pass 'all' for full history
  const fetchTrends = useCallback(
    async (range) => {
      if (!householdId) return [];
      setLoading(true);
      try {
        const { data } = await api.get(`/budget/trends/${householdId}`, {
          params: range ? { range } : {}
        });
        setTrends(data.trends);
        return data.trends;
      } catch (err) {
        console.error('Error fetching trends:', err);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [householdId]
  );

  // All-time income minus all-time expenses
  const fetchNetWorth = useCallback(async () => {
    if (!householdId) return null;
    try {
      const { data } = await api.get(`/budget/networth/${householdId}`);
      setNetWorth(data);
      return data;
    } catch (err) {
      console.error('Error fetching net worth:', err);
      return null;
    }
  }, [householdId]);

  return {
    budgets,
    trends,
    netWorth,
    loading,
    error,
    fetchProgress,
    setLimit,
    fetchTrends,
    fetchNetWorth
  };
};
