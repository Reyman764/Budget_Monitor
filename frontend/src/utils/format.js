/**
 * Money and date formatting, in one place so every screen renders a figure the
 * same way. Previously each component called `.toFixed(2)` directly, which
 * produced ungrouped numbers like `NPR 148200.00` — hard to read at a glance,
 * which is the whole job of a budget screen.
 */

const grouped = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const whole = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

const compact = new Intl.NumberFormat(undefined, {
  notation: 'compact',
  maximumFractionDigits: 1
});

const toNumber = (value) => {
  const n = typeof value === 'number' ? value : parseFloat(value);
  return Number.isFinite(n) ? n : 0;
};

/**
 * `NPR 12,480.00`. Pass `decimals: false` for headline figures where the paise
 * are noise, `decimals: 'auto'` for ledger rows that should only show paise when
 * there are some, and `signed: true` for transaction rows that need +/−.
 */
export function money(value, currency = 'NPR', { decimals = true, signed = false } = {}) {
  const n = toNumber(value);
  const magnitude = Math.abs(n);
  const showDecimals = decimals === 'auto' ? !Number.isInteger(magnitude) : Boolean(decimals);
  const digits = showDecimals ? grouped.format(magnitude) : whole.format(magnitude);
  const sign = signed ? (n < 0 ? '−' : '+') : n < 0 ? '−' : '';
  return `${sign}${currency} ${digits}`;
}

/** Short form for chart axes: `48.2K`. */
export function compactNumber(value) {
  return compact.format(toNumber(value));
}

/** `August 2026` */
export function monthLabel(month, { short = false } = {}) {
  if (!month) return '';
  const [year, m] = month.split('-');
  return new Date(Number(year), Number(m) - 1, 1).toLocaleDateString(undefined, {
    month: short ? 'short' : 'long',
    year: 'numeric'
  });
}

/** `12 Aug 2026` */
export function dateLabel(date) {
  return new Date(date).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/** `1st`, `2nd`, `23rd` — for "due on the 15th". */
export function ordinal(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return '';
  const v = num % 100;
  if (v >= 11 && v <= 13) return `${num}th`;
  return `${num}${['th', 'st', 'nd', 'rd'][v % 10] || 'th'}`;
}

/** What share of income was kept, as a whole percent. */
export function savingsRate(income, expense) {
  const inc = toNumber(income);
  if (inc <= 0) return null;
  return Math.round(((inc - toNumber(expense)) / inc) * 100);
}
