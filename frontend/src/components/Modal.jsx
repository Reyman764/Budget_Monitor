import { useEffect } from 'react';
import Button from './ui/Button';
import { CloseIcon } from './icons';

const SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg'
};

/**
 * A dialog that closes on Escape or a click outside, and locks the page behind
 * it. On phones it comes up from the bottom edge, where a thumb already is.
 */
export default function Modal({ title, description, children, onClose, size = 'md' }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-[3px] sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`rise max-h-[92vh] w-full overflow-y-auto rounded-t-hero border border-line bg-surface shadow-pop sm:rounded-card ${SIZES[size]}`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <h3 className="font-display text-[1.0625rem] font-semibold text-ink">{title}</h3>
            {description && (
              <p className="mt-0.5 text-[0.8125rem] text-ink-mute">{description}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            onClick={onClose}
            aria-label="Close"
            className="-mr-1.5 shrink-0"
          >
            <CloseIcon className="h-[1.15rem] w-[1.15rem]" />
          </Button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
