import { useState, useEffect, useRef } from 'react';
import Button from './ui/Button';
import { Card } from './ui/Card';
import { Field, Input, Select } from './ui/Field';
import { CloseIcon, SearchIcon } from './icons';
import { DEFAULT_CATEGORIES } from '../utils/categories';

/**
 * The category list follows the type filter: pick "Income" and you only see
 * income categories, because offering "Groceries" there can only produce an
 * empty result. With no type chosen, both lists are merged.
 */
const categoryOptions = (categories, type) => {
  if (type === 'income') return categories.income || [];
  if (type === 'expense') return categories.expense || [];
  return [...new Set([...(categories.expense || []), ...(categories.income || [])])].sort();
};

export default function FilterBar({ filters, onChange, categories = DEFAULT_CATEGORIES }) {
  const [localSearch, setLocalSearch] = useState(filters.search || '');
  const debounceRef = useRef(null);

  // Debounce search so we don't fire a request on every keystroke
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (localSearch !== filters.search) {
        onChange({ ...filters, search: localSearch });
      }
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [localSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (key, value) => onChange({ ...filters, [key]: value });

  const reset = () => {
    setLocalSearch('');
    onChange({ type: '', category: '', startDate: '', endDate: '', search: '' });
  };

  const hasActiveFilters =
    filters.type || filters.category || filters.startDate || filters.endDate || filters.search;

  const options = categoryOptions(categories, filters.type);

  return (
    <Card className="rise">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 h-[1.05rem] w-[1.05rem] -translate-y-1/2 text-ink-mute" />
        <Input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Search descriptions and categories"
          aria-label="Search transactions"
          className="pl-11"
        />
        {localSearch && (
          <button
            type="button"
            onClick={() => setLocalSearch('')}
            aria-label="Clear search"
            className="absolute top-1/2 right-2.5 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-ink-mute transition-colors hover:bg-sunken hover:text-ink"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Type">
          <Select value={filters.type} onChange={(e) => set('type', e.target.value)}>
            <option value="">Income and expenses</option>
            <option value="income">Income only</option>
            <option value="expense">Expenses only</option>
          </Select>
        </Field>

        <Field label="Category">
          <Select value={filters.category} onChange={(e) => set('category', e.target.value)}>
            <option value="">All categories</option>
            {options.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="From">
          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) => set('startDate', e.target.value)}
          />
        </Field>

        <Field label="To">
          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) => set('endDate', e.target.value)}
          />
        </Field>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4">
          <p className="text-[0.8125rem] text-ink-mute">
            A date range here overrides the month above.
          </p>
          <Button variant="danger" size="sm" onClick={reset}>
            <CloseIcon className="h-4 w-4" />
            Clear filters
          </Button>
        </div>
      )}
    </Card>
  );
}
