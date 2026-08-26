import { useTheme } from '../context/ThemeContext';
import { money, compactNumber } from './format';

/**
 * One chart palette for the whole app.
 *
 * Recharts writes these straight onto SVG presentation attributes, so they have
 * to be literal colours rather than `var(--…)`. Each value is the theme-matched
 * twin of a token in index.css, and every hue clears 3:1 against its own canvas
 * (#F6F7F5 light / #101312 dark) so a series is still findable for readers who
 * can't separate it by hue.
 *
 * Series colours are fixed by meaning — income is always moss, expenses always
 * clay, net always slate — so a colour means the same thing on every screen.
 */

const LIGHT = {
  grid: '#e6eae6',
  axis: '#c9d1cb',
  tick: '#77837d',
  surface: '#ffffff',
  line: '#e6eae6',
  ink: '#14181a',
  income: '#3e7a56',
  expense: '#a8654a',
  net: '#4e6e8e',
  budgeted: '#a9bfb1',
  spent: '#4a6b58',
  categorical: ['#4a6b58', '#a8654a', '#4e6e8e', '#8a7b3c', '#7a5c7e', '#3f8480', '#a2778a']
};

const DARK = {
  grid: '#272d2a',
  axis: '#39413c',
  tick: '#8d9791',
  surface: '#1f2422',
  line: '#333b37',
  ink: '#e9eeea',
  income: '#5cb183',
  expense: '#d08a6b',
  net: '#8faecd',
  budgeted: '#4f6b5b',
  spent: '#8fb39d',
  categorical: ['#8fb39d', '#d9a184', '#8faecd', '#cbbb74', '#b79abb', '#76bfb8', '#d2a9b8']
};

export function useChartTheme() {
  const { theme } = useTheme();
  const c = theme === 'dark' ? DARK : LIGHT;

  return {
    ...c,
    /** Spread onto <CartesianGrid>. Horizontal rules only — vertical ones add
     *  ink without adding information on a time or category axis. */
    grid: {
      stroke: c.grid,
      strokeDasharray: '2 6',
      vertical: false
    },
    /** Spread onto <XAxis>/<YAxis>. No axis lines: the gridlines already carry
     *  the scale, and dropping them keeps the charts as quiet as the rest of
     *  the app. */
    axis: {
      tick: { fill: c.tick, fontSize: 12 },
      tickLine: false,
      axisLine: false
    },
    legend: {
      iconType: 'circle',
      iconSize: 8,
      wrapperStyle: { fontSize: 12, color: c.tick, paddingTop: 12 }
    },
    /** Muted fill for the hovered band behind a tooltip. */
    cursor: { fill: theme === 'dark' ? 'rgba(255,255,255,.04)' : 'rgba(20,24,22,.035)' },
    tickFormatter: compactNumber,
    palette: c
  };
}

/**
 * Shared tooltip. Recharts' default is a white box with a hard border that
 * ignores the theme; this one sits on the same surface token as the cards,
 * uses tabular figures so rows line up, and drops the redundant colour swatch
 * when there's only one series.
 */
export function MoneyTooltip({ active, payload, label, currency = 'NPR', labelFormatter }) {
  const { palette } = useChartTheme();
  if (!active || !payload?.length) return null;

  const heading = labelFormatter ? labelFormatter(label, payload) : label;
  const rows = payload.filter((row) => row.value !== undefined && row.value !== null);

  return (
    <div
      className="rounded-xl px-3 py-2.5 text-xs shadow-pop"
      style={{
        background: palette.surface,
        border: `1px solid ${palette.line}`,
        color: palette.ink
      }}
    >
      {heading && <p className="mb-1.5 font-medium">{heading}</p>}
      <div className="space-y-1">
        {rows.map((row) => (
          <div key={row.dataKey ?? row.name} className="flex items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: row.color || row.payload?.fill }}
            />
            <span style={{ color: palette.tick }}>{row.name}</span>
            <span className="tnum ml-auto font-semibold">
              {money(row.value, currency, { decimals: 'auto' })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
