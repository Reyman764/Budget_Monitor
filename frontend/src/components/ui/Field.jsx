/**
 * Form controls. One shell class for every input type so a text field, a select
 * and a date picker line up on the same grid and share the same focus ring.
 */

export const fieldShell =
  'w-full rounded-field border border-line bg-surface px-3.5 text-[0.9375rem] text-ink ' +
  'placeholder:text-ink-mute transition-[border-color,box-shadow] duration-150 ' +
  'hover:border-line-strong focus:border-sage focus:outline-none ' +
  'focus:ring-[3px] focus:ring-sage/18 disabled:opacity-55';

export const fieldHeight = 'h-11';

export const labelClass = 'mb-1.5 block text-[0.8125rem] font-medium text-ink-soft';

/** Label + control + hint/error, with the spacing decided once. */
export function Field({ label, htmlFor, hint, error, required, className = '', children }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={htmlFor} className={labelClass}>
          {label}
          {required && <span className="ml-0.5 text-clay">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="mt-1.5 text-[0.75rem] text-clay">{error}</p>
      ) : (
        hint && <p className="mt-1.5 text-[0.75rem] text-ink-mute">{hint}</p>
      )}
    </div>
  );
}

export function Input({ className = '', ...rest }) {
  return <input className={`${fieldShell} ${fieldHeight} ${className}`} {...rest} />;
}

export function Textarea({ className = '', rows = 3, ...rest }) {
  return <textarea rows={rows} className={`${fieldShell} py-2.5 ${className}`} {...rest} />;
}

/**
 * Native select, restyled. The chevron is a background image because
 * `appearance-none` removes the platform arrow and nothing inside a <select>
 * can be styled reliably.
 */
export function Select({ className = '', children, ...rest }) {
  return (
    <select
      className={`${fieldShell} ${fieldHeight} cursor-pointer appearance-none bg-[length:1.05rem] bg-[right_0.75rem_center] bg-no-repeat pr-10 ${className}`}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2377837d' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6.5 9.75 12 15.25l5.5-5.5'/%3E%3C/svg%3E\")"
      }}
      {...rest}
    >
      {children}
    </select>
  );
}

export default Field;
