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
 * The frame every signed-in page sits in: one sticky top bar, one centred
 * column. Nothing else is chrome, so the page's own content is the only thing
 * competing for attention.
 *
 * Pages pass the `household` they already loaded rather than the shell fetching
 * it again — there's one household request per page as a result, not two.
 */
export default function AppShell({ household, children, className = '' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // A tap on a nav item should leave the sheet closed behind it.
  useEffect(() => setMenuOpen(false), [location.pathname]);

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

            <Button
              variant="ghost"
              size="sm"
              iconOnly
              className="lg:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </Button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-line bg-surface px-4 pt-3 pb-4 shadow-lift lg:hidden">
            <nav className="grid gap-1 sm:grid-cols-2" aria-label="Main">
              {NAV.map(({ to, label, Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.9375rem] transition-colors ${
                      isActive
                        ? 'bg-sage-soft font-semibold text-sage'
                        : 'font-medium text-ink-soft hover:bg-sunken hover:text-ink'
                    }`
                  }
                >
                  <Icon className="h-[1.15rem] w-[1.15rem]" />
                  {label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
              <span className="truncate text-[0.8125rem] text-ink-mute">
                {user?.name || user?.email}
              </span>
              <Button variant="danger" size="sm" onClick={handleLogout}>
                <LogOutIcon className="h-4 w-4" />
                Log out
              </Button>
            </div>
          </div>
        )}
      </header>

      <main className={`mx-auto max-w-6xl px-4 pt-8 pb-20 sm:px-6 sm:pt-10 ${className}`}>
        {children}
      </main>
    </div>
  );
}
