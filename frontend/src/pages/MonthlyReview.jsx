import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { useHousehold } from '../hooks/useHousehold';
import { useReports } from '../hooks/useReports';
import { useBudget } from '../hooks/useBudget';
import api from '../utils/api';
import AppShell from '../components/AppShell';
import MonthPicker from '../components/MonthPicker';
import ReportSheet from '../components/ReportSheet';
import CategoryChart from '../components/CategoryChart';
import TrendChart from '../components/TrendChart';
import IncomeExpenseChart from '../components/IncomeExpenseChart';
import BudgetVsActualChart from '../components/BudgetVsActualChart';
import CategoryBudgetTable from '../components/CategoryBudgetTable';
import MonthComparison from '../components/MonthComparison';
import Button from '../components/ui/Button';
import Callout from '../components/ui/Callout';
import Loader from '../components/ui/Loader';
import { SkeletonBar, SkeletonChart, SkeletonRows } from '../components/ui/Skeleton';
import PageHeader from '../components/ui/PageHeader';
import { PrintIcon, ShareIcon } from '../components/icons';
import { dateLabel } from '../utils/format';

export default function MonthlyReview() {
  const { household, loading: householdLoading } = useHousehold();
  const navigate = useNavigate();
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [shareState, setShareState] = useState({ status: 'idle', url: '' }); // idle | loading | done | error
  const printRef = useRef();

  const householdId = household?.id || null;
  const { report, loading, error, fetchMonthlyReport, createShareLink } = useReports(householdId);
  const { budgets, fetchProgress } = useBudget(householdId);
  // Previous month's summary, fetched directly (not via useReports, which only
  // tracks one month at a time) so MonthComparison has something to diff against.
  const [prevReport, setPrevReport] = useState(null);

  useEffect(() => {
    if (!householdLoading && !household) {
      navigate('/household-setup');
    }
  }, [household, householdLoading, navigate]);

  useEffect(() => {
    if (householdId) {
      fetchMonthlyReport(month);
    }
  }, [householdId, month, fetchMonthlyReport]);

  useEffect(() => {
    if (householdId) fetchProgress(month);
  }, [householdId, month, fetchProgress]);

  useEffect(() => {
    if (!householdId) return;
    const [year, m] = month.split('-').map(Number);
    const prevDate = new Date(year, m - 2, 1);
    const prevMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;
    api
      .get(`/reports/monthly/${prevMonth}`, { params: { householdId } })
      .then(({ data }) => setPrevReport(data))
      .catch(() => setPrevReport(null));
  }, [householdId, month]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Monthly Review - ${month}`
  });

  const handleShare = async () => {
    setShareState({ status: 'loading', url: '' });
    try {
      const url = await createShareLink(month);
      setShareState({ status: 'done', url });
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url).catch(() => {});
      }
    } catch {
      setShareState({ status: 'error', url: '' });
    }
  };

  if (householdLoading) {
    return <Loader full label="Loading your household" />;
  }

  const currency = household?.currency || 'NPR';

  return (
    <AppShell household={household}>
      <PageHeader
        className="no-print"
        eyebrow="One month, in full"
        title="Review"
        actions={
          <>
            <MonthPicker value={month} onChange={setMonth} />
            <Button variant="secondary" onClick={handleShare} disabled={shareState.status === 'loading'}>
              <ShareIcon className="h-4 w-4" />
              {shareState.status === 'loading' ? 'Making link…' : 'Share'}
            </Button>
            <Button variant="primary" onClick={handlePrint}>
              <PrintIcon className="h-4 w-4" />
              Export PDF
            </Button>
          </>
        }
      />

      <div className="mt-8 space-y-6">
        {shareState.status === 'done' && (
          <Callout tone="success" title="Link copied" className="no-print">
            Anyone with this link can read this month's report — no account needed.
            <span className="mt-1.5 block break-all font-mono text-[0.75rem] text-ink-soft">
              {shareState.url}
            </span>
          </Callout>
        )}
        {shareState.status === 'error' && (
          <Callout tone="error" className="no-print">
            Couldn't create a share link. Try again.
          </Callout>
        )}
        {error && (
          <Callout tone="error" className="no-print">
            {error}
          </Callout>
        )}

        {loading || !report ? (
          <div role="status" aria-label="Building the report" className="card space-y-6 p-6 sm:p-8">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <SkeletonBar className="h-3 w-2/3" />
                  <SkeletonBar className="h-6 w-4/5" />
                </div>
              ))}
            </div>
            <SkeletonChart />
            <SkeletonRows count={3} />
          </div>
        ) : (
          <div ref={printRef}>
            <ReportSheet
              householdName={household?.name}
              month={month}
              income={report.totalIncome}
              expense={report.totalExpense}
              net={report.netBalance}
              currency={currency}
              note={`Prepared ${dateLabel(new Date())}`}
            >
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <CategoryChart transactions={report.transactions} currency={currency} />
                <IncomeExpenseChart
                  income={report.totalIncome}
                  expense={report.totalExpense}
                  currency={currency}
                />
              </div>

              <TrendChart transactions={report.transactions} currency={currency} />
              <BudgetVsActualChart budgets={budgets} currency={currency} />
              <CategoryBudgetTable budgets={budgets} currency={currency} />
              <MonthComparison current={report} previous={prevReport} currency={currency} />
            </ReportSheet>
          </div>
        )}
      </div>
    </AppShell>
  );
}
