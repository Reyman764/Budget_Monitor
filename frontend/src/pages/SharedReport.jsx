import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import CategoryChart from '../components/CategoryChart';
import TrendChart from '../components/TrendChart';
import IncomeExpenseChart from '../components/IncomeExpenseChart';
import ReportSheet from '../components/ReportSheet';
import ThemeToggle from '../components/ThemeToggle';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import Loader from '../components/ui/Loader';
import { Card } from '../components/ui/Card';
import { AlertIcon, ArrowRightIcon, Wordmark } from '../components/icons';
import api from '../utils/api';

export default function SharedReport() {
  const { token } = useParams();
  const [report, setReport] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  useEffect(() => {
    let cancelled = false;
    api
      .get(`/reports/shared/${token}`)
      .then(({ data }) => {
        if (!cancelled) {
          setReport(data);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (status === 'loading') {
    return <Loader full label="Loading this report" />;
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
        <Card className="w-full max-w-md">
          <EmptyState
            icon={<AlertIcon className="h-5 w-5" />}
            title="This link doesn't work anymore"
            action={
              <Button as={Link} to="/login" variant="primary">
                Go to sign in
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            }
          >
            Share links expire. Ask whoever sent it to generate a fresh one.
          </EmptyState>
        </Card>
      </div>
    );
  }

  const currency = report.household?.currency || 'NPR';

  return (
    <div className="min-h-screen bg-canvas">
      <header className="no-print border-b border-line bg-canvas/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.25rem] max-w-4xl items-center gap-3 px-4 sm:px-6">
          <Wordmark subtitle={report.household?.name} />
          <Badge tone="outline" className="ml-auto">
            Read only
          </Badge>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pt-8 pb-20 sm:px-6 sm:pt-10">
        <ReportSheet
          householdName={report.household?.name}
          month={report.month}
          income={report.totalIncome}
          expense={report.totalExpense}
          net={report.netBalance}
          currency={currency}
          note="Shared report"
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
        </ReportSheet>
      </main>
    </div>
  );
}
