import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHousehold } from '../hooks/useHousehold';
import AppShell from '../components/AppShell';
import YearlyTrends from '../components/YearlyTrends';
import MonthlyBarChart from '../components/MonthlyBarChart';
import Loader from '../components/ui/Loader';
import PageHeader from '../components/ui/PageHeader';

export default function Analytics() {
  const { household, loading: householdLoading } = useHousehold();
  const navigate = useNavigate();
  const householdId = household?.id || null;
  const currency = household?.currency || 'NPR';

  useEffect(() => {
    if (!householdLoading && !household) navigate('/household-setup');
  }, [household, householdLoading, navigate]);

  if (householdLoading) {
    return <Loader full label="Loading your household" />;
  }

  return (
    <AppShell household={household}>
      <PageHeader
        eyebrow="The long view"
        title="Trends"
        description={`How ${household?.name || 'your household'} has moved over time — a rolling year first, then every month side by side.`}
      />

      <div className="mt-8 space-y-6">
        <div className="rise">
          <YearlyTrends householdId={householdId} currency={currency} />
        </div>
        <div className="rise" style={{ '--rise-delay': '90ms' }}>
          <MonthlyBarChart householdId={householdId} currency={currency} />
        </div>
      </div>
    </AppShell>
  );
}
