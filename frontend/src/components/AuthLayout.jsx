import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { Logo } from './icons';

/**
 * The frame for every screen you see before you're inside a household: sign in,
 * sign up, household setup. One centred column on plenty of canvas — the app's
 * density starts after you're through the door.
 */
export default function AuthLayout({ title, description, children, footer }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas px-4 py-10 sm:px-6">
      {/* A single soft wash of sage behind the card, so the canvas isn't flat. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[32rem] w-[52rem] -translate-x-1/2 rounded-full bg-sage-soft blur-3xl"
      />

      <div className="absolute right-4 top-6 sm:right-6">
        <ThemeToggle />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[27rem] flex-col justify-center">
        <div className="rise">
          <Link to="/login" className="mx-auto flex w-fit items-center gap-2.5 rounded-field">
            <Logo className="h-9 w-9" />
            <span className="font-display text-[1.25rem] font-semibold tracking-[-0.03em] text-ink">
              Budget
            </span>
          </Link>

          <h1 className="font-display mt-9 text-center text-[1.875rem] font-semibold leading-[1.15] text-ink sm:text-[2.125rem]">
            {title}
          </h1>
          {description && (
            <p className="mx-auto mt-3 max-w-[24rem] text-center text-[0.9375rem] leading-relaxed text-ink-soft">
              {description}
            </p>
          )}
        </div>

        <div
          className="card rise mt-8 p-6 sm:p-7"
          style={{ '--rise-delay': '70ms' }}
        >
          {children}
        </div>

        {footer && (
          <div
            className="rise mt-6 text-center text-[0.875rem] text-ink-soft"
            style={{ '--rise-delay': '140ms' }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
