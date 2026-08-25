import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export const useGoals = (householdId) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchGoals = useCallback(async () => {
    if (!householdId) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/budget/goal/${householdId}`);
      setGoals(data.goals);
    } catch (err) {
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  }, [householdId]);

  const addGoal = async (goalData) => {
    const { data } = await api.post('/budget/goal', { ...goalData, householdId });
    setGoals((prev) => [data.goal, ...prev]);
    return data.goal;
  };

  const updateGoal = async (id, goalData) => {
    const { data } = await api.put(`/budget/goal/${id}`, goalData);
    setGoals((prev) => prev.map((g) => (g.id === id ? data.goal : g)));
    return data.goal;
  };

  const deleteGoal = async (id) => {
    await api.delete(`/budget/goal/${id}`);
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  useEffect(() => {
    if (householdId) fetchGoals();
  }, [householdId, fetchGoals]);

  return { goals, loading, fetchGoals, addGoal, updateGoal, deleteGoal };
};
