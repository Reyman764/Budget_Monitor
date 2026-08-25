import { useState, useCallback } from 'react';
import api from '../utils/api';

export const useReports = (householdId) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMonthlyReport = useCallback(
    async (month) => {
      if (!householdId || !month) return null;
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/reports/monthly/${month}`, {
          params: { householdId }
        });
        setReport(data);
        return data;
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load report');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [householdId]
  );

  const createShareLink = async (month) => {
    const { data } = await api.post('/reports/share', { householdId, month });
    return data.shareUrl;
  };

  return { report, loading, error, fetchMonthlyReport, createShareLink };
};
