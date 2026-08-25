import { useState, useEffect, useRef } from 'react';

const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Shopping', 'Health', 'Other'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other'];
const ALL_CATEGORIES = [...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])].sort();

const selectClass =
  'px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200';

export default function FilterBar({ filters, onChange }) {
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

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      {/* Search */}
      <div className="relative mb-3">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-slate-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          type="text"
          placeholder="Search description or category…"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:placeholder-slate-500"
        />
        {localSearch && (
          <button
            onClick={() => setLocalSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300"
          >
            ×
          </button>
        )}
      </div>

      {/* Dropdowns + date pickers row */}
      <div className="flex flex-wrap gap-2">
        <select value={filters.type} onChange={(e) => set('type', e.target.value)} className={selectClass}>
          <option value="">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select value={filters.category} onChange={(e) => set('category', e.target.value)} className={selectClass}>
          <option value="">All categories</option>
          {ALL_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <div className="flex items-center gap-1">
          <label className="text-xs text-gray-500 dark:text-slate-400">From</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => set('startDate', e.target.value)}
            className={selectClass}
          />
        </div>

        <div className="flex items-center gap-1">
          <label className="text-xs text-gray-500 dark:text-slate-400">To</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => set('endDate', e.target.value)}
            className={selectClass}
          />
        </div>

        {hasActiveFilters && (
          <button
            onClick={reset}
            className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-500 transition hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
          >
            <span>✕</span> Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
