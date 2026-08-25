import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../utils/api';

export const useTransactions = (householdId) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  // Remember the filters/month that were last fetched, so mutations
  // (add/update/delete/pay) can re-sync against the SAME view instead of
  // guessing at local state — this is what was causing transactions added
  // for a previous/next month to seem to "disappear" or never really save.
  const lastFiltersRef = useRef({});

  // Accept a single filters object so callers don't need positional args
  const fetchTransactions = useCallback(
    async (filters = {}) => {
      if (!householdId) return;
      lastFiltersRef.current = filters;
      setLoading(true);
      try {
        const params = {};
        if (filters.month)     params.month     = filters.month;
        if (filters.startDate) params.startDate = filters.startDate;
        if (filters.endDate)   params.endDate   = filters.endDate;
        if (filters.type)      params.type      = filters.type;
        if (filters.category)  params.category  = filters.category;
        if (filters.search)    params.search    = filters.search;
        if (filters.recurring) params.recurring = filters.recurring;

        const { data } = await api.get(`/transactions/${householdId}`, { params });
        setTransactions(data.transactions);
      } catch (err) {
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    },
    [householdId]
  );

  // Re-fetch using whichever month/filters are currently active, rather than
  // patching the in-memory array by hand. This guarantees what's on screen
  // always matches what's actually in the database for the selected month.
  const refetch = useCallback(() => fetchTransactions(lastFiltersRef.current), [fetchTransactions]);

  const addTransaction = async (transactionData) => {
    const { data } = await api.post('/transactions', { ...transactionData, householdId });
    await refetch();
    return data.transaction;
  };

  const updateTransaction = async (id, transactionData) => {
    const { data } = await api.put(`/transactions/${id}`, transactionData);
    await refetch();
    return data.transaction;
  };

  const deleteTransaction = async (id) => {
    await api.delete(`/transactions/${id}`);
    await refetch();
  };

  // Pay a recurring bill — adds a one-off payment transaction for today
  const payBill = async (billId) => {
    const { data } = await api.post(`/transactions/${billId}/pay`);
    await refetch();
    return data.payment;
  };

  // Ask the backend to create the "Remaining of previous month" carry-over
  // transaction for the given month (idempotent — safe to call every time
  // the month is viewed). Refetches afterward so a newly-created carry-over
  // entry shows up immediately.
  const ensureCarryOver = useCallback(
    async (month) => {
      if (!householdId || !month) return;
      try {
        const { data } = await api.post(`/transactions/${householdId}/carry-over`, { month });
        if (data.created) await refetch();
      } catch (err) {
        console.error('Error creating carry-over transaction:', err);
      }
    },
    [householdId, refetch]
  );

  useEffect(() => {
    if (householdId) fetchTransactions();
  }, [householdId, fetchTransactions]);

  return {
    transactions,
    loading,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    payBill,
    ensureCarryOver
  };
};
