/**
 * The app's icon set — one consistent 24px grid, 1.6px strokes, round joins.
 *
 * These replace the emoji that used to stand in for icons. Emoji render
 * differently on every OS, can't inherit colour, and sit awkwardly on the
 * baseline; a stroked set matches the type and follows `currentColor` so an
 * icon is always the same weight as the text beside it.
 *
 * Every icon takes the same props as an <svg>, so sizing is `className="h-4 w-4"`
 * and colour is whatever `text-*` is in scope.
 */

function Icon({ children, className = 'h-5 w-5', ...rest }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

/* ---------------------------------------------------------------- navigation */

export const OverviewIcon = (p) => (
  <Icon {...p}>
    <rect x="3" y="3" width="7.5" height="7.5" rx="2.2" />
    <rect x="13.5" y="3" width="7.5" height="4.5" rx="2" />
    <rect x="13.5" y="10.5" width="7.5" height="10.5" rx="2.2" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
  </Icon>
);

export const BillsIcon = (p) => (
  <Icon {...p}>
    <path d="M5.75 4.25A1.75 1.75 0 0 1 7.5 2.5h9A1.75 1.75 0 0 1 18.25 4.25V21l-3.15-1.75L12 21l-3.1-1.75L5.75 21V4.25Z" />
    <path d="M9 7.75h6M9 11.5h6M9 15.25h3" />
  </Icon>
);

export const GoalsIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="1.15" fill="currentColor" stroke="none" />
  </Icon>
);

export const TrendsIcon = (p) => (
  <Icon {...p}>
    <path d="M3.5 16.75 9 11.25l3.5 3.5 8-8" />
    <path d="M15.5 6.75h5v5" />
    <path d="M3.5 20.5h17" opacity=".45" />
  </Icon>
);

export const ReviewIcon = (p) => (
  <Icon {...p}>
    <path d="M13.75 3.5H7.75A1.75 1.75 0 0 0 6 5.25v13.5a1.75 1.75 0 0 0 1.75 1.75h8.5A1.75 1.75 0 0 0 18 18.75V7.75L13.75 3.5Z" />
    <path d="M13.5 3.75V7.5a.5.5 0 0 0 .5.5h3.75" />
    <path d="M9 12.5h6M9 16h4" />
  </Icon>
);

export const SettingsIcon = (p) => (
  <Icon {...p}>
    <path d="M4 7.5h4M12.5 7.5H20M4 16.5h7.5M16 16.5h4" />
    <circle cx="10.25" cy="7.5" r="2.25" />
    <circle cx="13.75" cy="16.5" r="2.25" />
  </Icon>
);

/* ------------------------------------------------------------------- actions */

export const PlusIcon = (p) => (
  <Icon {...p}>
    <path d="M12 5.5v13M5.5 12h13" />
  </Icon>
);

export const CloseIcon = (p) => (
  <Icon {...p}>
    <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
  </Icon>
);

export const CheckIcon = (p) => (
  <Icon {...p}>
    <path d="M5 12.5 9.5 17 19 7" />
  </Icon>
);

export const CheckCircleIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M8.5 12.25 10.9 14.7l4.6-5.2" />
  </Icon>
);

export const ChevronDownIcon = (p) => (
  <Icon {...p}>
    <path d="M6.5 9.75 12 15.25l5.5-5.5" />
  </Icon>
);

export const ArrowLeftIcon = (p) => (
  <Icon {...p}>
    <path d="M19 12H5m0 0 5.75-5.75M5 12l5.75 5.75" />
  </Icon>
);

export const ArrowRightIcon = (p) => (
  <Icon {...p}>
    <path d="M5 12h14m0 0-5.75-5.75M19 12l-5.75 5.75" />
  </Icon>
);

export const SearchIcon = (p) => (
  <Icon {...p}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m15.4 15.4 4.6 4.6" />
  </Icon>
);

export const FilterIcon = (p) => (
  <Icon {...p}>
    <path d="M4 5.75h16l-6.15 7.3v6.2L10.15 21v-7.95L4 5.75Z" />
  </Icon>
);

export const EditIcon = (p) => (
  <Icon {...p}>
    <path d="M4.5 19.5h3.2l10-10a2.26 2.26 0 0 0-3.2-3.2l-10 10v3.2Z" />
    <path d="m13.75 7.25 3 3" />
  </Icon>
);

export const TrashIcon = (p) => (
  <Icon {...p}>
    <path d="M4.5 7.5h15" />
    <path d="M9.75 7.5V5.9a1.4 1.4 0 0 1 1.4-1.4h1.7a1.4 1.4 0 0 1 1.4 1.4v1.6" />
    <path d="M6.75 7.5l.78 11.15a1.75 1.75 0 0 0 1.75 1.6h5.44a1.75 1.75 0 0 0 1.75-1.6L17.25 7.5" />
  </Icon>
);

export const MenuIcon = (p) => (
  <Icon {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Icon>
);

export const LogOutIcon = (p) => (
  <Icon {...p}>
    <path d="M14.5 8.5V6.25A1.75 1.75 0 0 0 12.75 4.5h-6A1.75 1.75 0 0 0 5 6.25v11.5a1.75 1.75 0 0 0 1.75 1.75h6a1.75 1.75 0 0 0 1.75-1.75V15.5" />
    <path d="M10.5 12h9m0 0-3.25-3.25M19.5 12l-3.25 3.25" />
  </Icon>
);

export const CopyIcon = (p) => (
  <Icon {...p}>
    <rect x="9" y="9" width="11" height="11" rx="2.6" />
    <path d="M15 6.6A2.6 2.6 0 0 0 12.4 4H6.6A2.6 2.6 0 0 0 4 6.6v5.8A2.6 2.6 0 0 0 6.6 15" />
  </Icon>
);

export const ShareIcon = (p) => (
  <Icon {...p}>
    <path d="m9.75 14.25 4.5-4.5" />
    <path d="M11.5 7.75 13.4 5.9a3.9 3.9 0 0 1 5.5 5.52l-1.85 1.83" />
    <path d="M12.5 16.25l-1.9 1.85a3.9 3.9 0 0 1-5.5-5.52L6.95 10.75" />
  </Icon>
);

export const PrintIcon = (p) => (
  <Icon {...p}>
    <path d="M7 9.25V4.5h10v4.75" />
    <path d="M7 17.5H5.6A1.6 1.6 0 0 1 4 15.9v-4.65A2 2 0 0 1 6 9.25h12a2 2 0 0 1 2 2v4.65a1.6 1.6 0 0 1-1.6 1.6H17" />
    <rect x="7" y="14" width="10" height="6" rx="1.6" />
  </Icon>
);

/* ------------------------------------------------------------------ semantic */

/** Money in. */
export const IncomeIcon = (p) => (
  <Icon {...p}>
    <path d="M17 7 7 17" />
    <path d="M7 10.25V17h6.75" />
  </Icon>
);

/** Money out. */
export const ExpenseIcon = (p) => (
  <Icon {...p}>
    <path d="M7 17 17 7" />
    <path d="M10.25 7H17v6.75" />
  </Icon>
);

export const RecurringIcon = (p) => (
  <Icon {...p}>
    <path d="M4.25 9.75A4.75 4.75 0 0 1 9 5h8.75m0 0-2.75-2.75M17.75 5 15 7.75" />
    <path d="M19.75 14.25A4.75 4.75 0 0 1 15 19H6.25m0 0L9 21.75M6.25 19 9 16.25" />
  </Icon>
);

/** Net worth — a stack of coins. */
export const CoinsIcon = (p) => (
  <Icon {...p}>
    <ellipse cx="12" cy="6.5" rx="7" ry="2.75" />
    <path d="M5 6.5v4.75c0 1.52 3.13 2.75 7 2.75s7-1.23 7-2.75V6.5" />
    <path d="M5 11.25v4.75c0 1.52 3.13 2.75 7 2.75s7-1.23 7-2.75v-4.75" />
  </Icon>
);

export const AlertIcon = (p) => (
  <Icon {...p}>
    <path d="M12 4.75 20.75 19.5H3.25L12 4.75Z" />
    <path d="M12 10.25v3.75M12 16.9v.01" />
  </Icon>
);

export const InfoIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11.25v5M12 8.1v.01" />
  </Icon>
);

export const SparkleIcon = (p) => (
  <Icon {...p}>
    <path d="M10 3.5 11.6 8 16 9.6 11.6 11.2 10 15.7 8.4 11.2 4 9.6 8.4 8 10 3.5Z" />
    <path d="M17.5 15 18.3 17.2 20.5 18l-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" />
  </Icon>
);

export const CalendarIcon = (p) => (
  <Icon {...p}>
    <rect x="3.5" y="5.5" width="17" height="15" rx="2.6" />
    <path d="M8 3.5v4M16 3.5v4M3.5 10.5h17" />
  </Icon>
);

export const HouseholdIcon = (p) => (
  <Icon {...p}>
    <circle cx="9.25" cy="8.5" r="3.5" />
    <path d="M3.25 20.25a6 6 0 0 1 12 0" />
    <path d="M16 5.35a3.5 3.5 0 0 1 0 6.3M17.6 14.5a6 6 0 0 1 3.15 4.35" />
  </Icon>
);

/* --------------------------------------------------------------------- theme */

export const SunIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="4.1" />
    <path d="M12 2.75v2.1M12 19.15v2.1M4.2 4.2l1.5 1.5M18.3 18.3l1.5 1.5M2.75 12h2.1M19.15 12h2.1M4.2 19.8l1.5-1.5M18.3 5.7l1.5-1.5" />
  </Icon>
);

export const MoonIcon = (p) => (
  <Icon {...p}>
    <path d="M20.5 14.9A9.25 9.25 0 0 1 9.1 3.5 9.25 9.25 0 1 0 20.5 14.9Z" />
  </Icon>
);

/* ------------------------------------------------------------------ wordmark */

/**
 * The mark: three ascending bars in the sage square. Kept flat and geometric so
 * it stays legible at favicon size — the identity lives in the palette and the
 * Bricolage wordmark beside it, not in the logo.
 */
export function Logo({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="9" className="fill-sage" />
      <rect x="8" y="18" width="4" height="6" rx="2" className="fill-on-sage" opacity=".5" />
      <rect x="14" y="13" width="4" height="11" rx="2" className="fill-on-sage" opacity=".76" />
      <rect x="20" y="8" width="4" height="16" rx="2" className="fill-on-sage" />
    </svg>
  );
}

export function Wordmark({ subtitle }) {
  return (
    <span className="flex items-center gap-2.5">
      <Logo className="h-8 w-8 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.0625rem] font-semibold tracking-[-0.03em] text-ink">
          Budget
        </span>
        {subtitle && (
          <span className="mt-1 truncate text-[0.6875rem] leading-none text-ink-mute">
            {subtitle}
          </span>
        )}
      </span>
    </span>
  );
}
