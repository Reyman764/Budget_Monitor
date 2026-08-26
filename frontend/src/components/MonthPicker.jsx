import Button from './ui/Button';
import { ArrowLeftIcon, ArrowRightIcon } from './icons';

const shiftMonth = (month, delta) => {
  const [year, m] = month.split('-').map(Number);
  const d = new Date(year, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

/**
 * Month navigation, used on every screen that shows one month at a time.
 * The arrows are for the common move — last month, next month — and the field
 * itself stays a native month input so jumping a year back is still one tap.
 */
export default function MonthPicker({ value, onChange, className = '' }) {
  return (
    <div
      className={`inline-flex items-center gap-0.5 rounded-full border border-line bg-surface p-1 ${className}`}
    >
      <Button
        variant="ghost"
        size="sm"
        iconOnly
        className="h-8 w-8"
        onClick={() => onChange(shiftMonth(value, -1))}
        aria-label="Previous month"
        title="Previous month"
      >
        <ArrowLeftIcon className="h-4 w-4" />
      </Button>

      <input
        type="month"
        value={value}
        onChange={(e) => e.target.value && onChange(e.target.value)}
        aria-label="Month"
        className="tnum h-8 w-[7.5rem] cursor-pointer rounded-full border-0 bg-transparent px-1 text-center text-[0.8125rem] font-medium text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-ring"
      />

      <Button
        variant="ghost"
        size="sm"
        iconOnly
        className="h-8 w-8"
        onClick={() => onChange(shiftMonth(value, 1))}
        aria-label="Next month"
        title="Next month"
      >
        <ArrowRightIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
