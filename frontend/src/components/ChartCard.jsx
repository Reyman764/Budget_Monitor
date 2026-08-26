import { SectionCard } from './ui/Card';
import EmptyState from './ui/EmptyState';
import { TrendsIcon } from './icons';

/**
 * The frame every chart sits in, so titles, padding and the "nothing to show
 * yet" state are identical across all seven of them.
 */
export default function ChartCard({
  title,
  description,
  action,
  isEmpty = false,
  emptyTitle = 'Nothing to chart yet',
  emptyMessage,
  className = '',
  children
}) {
  return (
    <SectionCard title={title} description={description} action={action} className={className}>
      {isEmpty ? (
        <EmptyState icon={<TrendsIcon />} title={emptyTitle} className="py-8">
          {emptyMessage}
        </EmptyState>
      ) : (
        children
      )}
    </SectionCard>
  );
}
