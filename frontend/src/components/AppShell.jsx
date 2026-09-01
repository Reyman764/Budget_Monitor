import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import Button from './ui/Button';
import {
  BillsIcon,
  CloseIcon,
  GoalsIcon,
  LogOutIcon,
  MenuIcon,
  OverviewIcon,
  ReviewIcon,
  SettingsIcon,
  TrendsIcon,
  Wordmark
} from './icons';

const NAV = [
  { to: '/dashboard', label: 'Overview', Icon: OverviewIcon },
  { to: '/bills', label: 'Bills', Icon: BillsIcon },
  { to: '/goals', label: 'Goals', Icon: GoalsIcon },
  { to: '/analytics', label: 'Trends', Icon: TrendsIcon },
  { to: '/monthly-review', label: 'Review', Icon: ReviewIcon },
  { to: '/settings', label: 'Settings', Icon: SettingsIcon }
];

const pill = (isActive) =>
  `inline-flex h-9 items-center gap-2 rounded-full px-3 text-[0.8125rem] transition-colors duration-150 ${
    isActive
      ? 'bg-sage-soft font-semibold text-sage'
      : 'font-medium text-ink-soft hover:bg-sunken hover:text-ink'
  }`;

/**
 * The frame every signed-in page sits in.
 *
 * Desktop (lg+): one sticky top bar carries the wordmark, the full nav, and
 * the account controls — nothing else is chrome.
 *
 * Phone/tablet (<lg): the top bar shrinks to branding + account access, and
 * navigation moves to a fixed bottom tab bar — the layout people already know
 * from every native app, reachable with a thumb instead of a menu you have to
 * open first.
 *
 * Pages pass the `household` they already loaded rather than the shell fetching
 * it again — there's one household request per page as a result, not two.
 */
export default function AppShell({ household, children, className = '' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [accountOpen, setAccountOpen] = useState(false);

  // A tap on a nav item should leave the sheet closed behind it.
  useEffect(() => setAccountOpen(false), [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initial = (user?.name || user?.email || '?').trim().charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-canvas">
      <header className="no-print sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center gap-3 px-4 sm:px-6">
          <Link
            to="/dashboard"
            className="shrink-0 rounded-xl focus-visible:outline-offset-4"
            aria-label="Budget — go to overview"
          >
            <Wordmark subtitle={household ? `${household.name} · ${household.currency}` : null} />
          </Link>

          <nav className="mx-auto hidden items-center gap-1 lg:flex" aria-label="Main">
            {NAV.map(({ to, label, Icon }) => (
              <NavLink key={to} to={to} className={({ isActive }) => pill(isActive)}>
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
            <ThemeToggle />

            <span className="hidden items-center gap-2 rounded-full border border-line py-1 pr-3.5 pl-1 sm:inline-flex">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sage-soft text-[0.75rem] font-semibold text-sage">
                {initial}
              </span>
              <span className="max-w-[9rem] truncate text-[0.8125rem] font-medium text-ink-soft">
                {user?.name || user?.email}
              </span>
            </span>

            <Button
              variant="ghost"
              size="sm"
              iconOnly
              onClick={handleLogout}
              title="Log out"
              aria-label="Log out"
              className="hidden sm:inline-flex"
            >
              <LogOutIcon className="h-[1.15rem] w-[1.15rem]" />
            </Button>

            {/* Below lg, the top nav is gone (it lives in the bottom tab bar
                instead) — this button only opens account details + log out,
                so it no longer needs to duplicate the nav links. */}
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              className="lg:hidden"
              onClick={() => setAccountOpen((v) => !v)}
              aria-expanded={accountOpen}
              aria-label={accountOpen ? 'Close account menu' : 'Open account menu'}
            >
              {accountOpen ? <CloseIcon /> : <MenuIcon />}
            </Button>
          </div>
        </div>

        {accountOpen && (
          <div className="border-t border-line bg-surface px-4 py-4 shadow-lift lg:hidden">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage-soft text-[0.8125rem] font-semibold text-sage">
                {initial}
              </span>
              <span className="min-w-0 flex-1 truncate text-[0.9375rem] font-medium text-ink">
                {user?.name || user?.email}
              </span>
              <Button variant="danger" size="sm" onClick={handleLogout} className="shrink-0">
                <LogOutIcon className="h-4 w-4" />
                Log out
              </Button>
            </div>
          </div>
        )}
      </header>

      <main
        className={`mx-auto max-w-6xl px-4 pt-8 pb-[calc(6.5rem+env(safe-area-inset-bottom))] sm:px-6 sm:pt-10 lg:pb-20 ${className}`}
      >
        {children}
      </main>

      {/* Bottom tab bar — the primary way to move between sections on a
          phone. Fixed, so it stays reachable regardless of scroll position;
          `main`'s bottom padding above keeps content from ever sitting
          underneath it. */}
      <nav
        className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur-xl lg:hidden"
        aria-label="Main"
      >
        <div className="mx-auto flex max-w-6xl items-stretch justify-between px-1 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))]">
          {NAV.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-0.5 rounded-xl px-0.5 py-1.5 text-[0.625rem] font-medium transition-colors duration-150 ${
                  isActive ? 'text-sage' : 'text-ink-mute hover:text-ink-soft'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-150 ${
                      isActive ? 'bg-sage-soft' : ''
                    }`}
                  >
                    <Icon className="h-[1.15rem] w-[1.15rem]" />
                  </span>
                  <span className="leading-none">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
