import { useState, useRef, useEffect } from 'react';
import Button from './ui/Button';
import { fieldHeight, fieldShell, labelClass } from './ui/Field';
import { CheckIcon, ChevronDownIcon, PlusIcon, TrashIcon } from './icons';

/**
 * A fully custom dropdown (not a native <select>) so it can support adding
 * and deleting categories inline — something a native select/datalist can't do.
 *
 * Props:
 *  - value: currently selected category (string)
 *  - onChange(category): called when the user picks a category
 *  - categories: string[] — the list to show
 *  - onAddCategory(name): called when the user adds a new category
 *  - onDeleteCategory(name): called when the user deletes one
 *  - label: optional field label
 */
export default function CategoryDropdown({ value, onChange, categories, onAddCategory, onDeleteCategory, label = 'Category' }) {
  const [open, setOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [saving, setSaving] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const handleSelect = (cat) => {
    onChange(cat);
    setOpen(false);
  };

  const handleAdd = async () => {
    const name = newCategory.trim();
    if (!name) return;
    if (categories.some((c) => c.toLowerCase() === name.toLowerCase())) {
      // Already exists — just select it instead of adding a duplicate.
      handleSelect(categories.find((c) => c.toLowerCase() === name.toLowerCase()));
      setNewCategory('');
      return;
    }
    setSaving(true);
    try {
      await onAddCategory(name);
      onChange(name);
      setNewCategory('');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (e, cat) => {
    e.stopPropagation();
    if (categories.length <= 1) {
      alert('You need at least one category in this list.');
      return;
    }
    if (!window.confirm(`Delete category "${cat}"?`)) return;
    setSaving(true);
    try {
      await onDeleteCategory(cat);
      // If the deleted category was selected, fall back to whatever is left.
      if (cat === value) {
        const remaining = categories.filter((c) => c !== cat);
        onChange(remaining[0] || '');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {label && <span className={labelClass}>{label}</span>}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`${fieldShell} ${fieldHeight} flex items-center justify-between gap-2 text-left`}
      >
        <span className={`truncate ${value ? '' : 'text-ink-mute'}`}>
          {value || 'Choose a category'}
        </span>
        <ChevronDownIcon
          className={`h-4 w-4 shrink-0 text-ink-mute transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-card border border-line bg-surface shadow-pop">
          <ul className="max-h-60 overflow-y-auto py-1" role="listbox">
            {categories.map((cat) => {
              const selected = cat === value;
              return (
                <li
                  key={cat}
                  role="option"
                  aria-selected={selected}
                  className={`group flex items-center ${selected ? 'bg-sage-soft' : 'hover:bg-sunken'}`}
                >
                  <button
                    type="button"
                    onClick={() => handleSelect(cat)}
                    className="flex min-w-0 flex-1 items-center gap-2.5 px-3.5 py-2.5 text-left text-[0.875rem]"
                  >
                    <CheckIcon
                      className={`h-4 w-4 shrink-0 ${selected ? 'text-sage' : 'invisible'}`}
                    />
                    <span className={`truncate ${selected ? 'font-semibold text-sage' : 'text-ink'}`}>
                      {cat}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, cat)}
                    title={`Delete "${cat}"`}
                    aria-label={`Delete category ${cat}`}
                    className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-mute opacity-0 transition hover:bg-clay-soft hover:text-clay focus-visible:opacity-100 group-hover:opacity-100"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex gap-2 border-t border-line p-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); handleAdd(); }
              }}
              placeholder="New category"
              aria-label="New category name"
              className="h-9 min-w-0 flex-1 rounded-[0.6rem] border border-line bg-surface px-3 text-[0.875rem] text-ink placeholder:text-ink-mute focus:border-sage focus:outline-none"
            />
            <Button
              variant="primary"
              size="sm"
              onClick={handleAdd}
              disabled={!newCategory.trim() || saving}
            >
              <PlusIcon className="h-4 w-4" />
              Add
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
