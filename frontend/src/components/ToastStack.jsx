import { AlertIcon, CheckCircleIcon, CloseIcon, InfoIcon } from './icons';
import { useToastList } from '../context/ToastContext';

const TONES = {
  success: { wrap: 'border-moss/30 bg-moss-soft', icon: 'text-moss', Icon: CheckCircleIcon },
  error: { wrap: 'border-clay/30 bg-clay-soft', icon: 'text-clay', Icon: AlertIcon },
  info: { wrap: 'border-line bg-surface', icon: 'text-ink-soft', Icon: InfoIcon }
};

/**
 * Rendered once at the app root. Sits above the mobile bottom tab bar and
 * below nothing — z-70 clears even an open Modal (z-50), so a toast fired
 * from inside a dialog is never hidden behind it.
 */
export default function ToastStack() {
  const { toasts, dismiss } = useToastList();

  if (!toasts.length) return null;

  return (
    <div
      className="no-print pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-[70] flex flex-col items-center gap-2 px-4 lg:bottom-6"
      aria-live="polite"
    >
      {toasts.map((t) => {
        const tone = TONES[t.tone] ?? TONES.info;
        const Glyph = tone.Icon;
        return (
          <div
            key={t.id}
            role={t.tone === 'error' ? 'alert' : 'status'}
            className={`toast-in pointer-events-auto flex w-full max-w-sm items-center gap-2.5 rounded-full border py-2.5 pr-2.5 pl-4 shadow-lift ${tone.wrap}`}
          >
            <span className={`shrink-0 ${tone.icon}`}>
              <Glyph className="h-[1.1rem] w-[1.1rem]" />
            </span>
            <p className="min-w-0 flex-1 text-[0.8125rem] font-medium text-ink">{t.message}</p>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-ink-mute transition hover:bg-black/5"
            >
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
