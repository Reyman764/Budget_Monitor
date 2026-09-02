import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastContext = createContext(null);

let nextId = 1;

/**
 * Lightweight, auto-dismissing status messages — the feedback for actions
 * that already show their own result somewhere on screen (a list losing a
 * row, a badge changing) doesn't need one; this is for the actions that
 * otherwise happen silently, like a background save or a delete.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const show = useCallback(
    (message, { tone = 'info', duration = 3600 } = {}) => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, message, tone }]);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), duration)
      );
      return id;
    },
    [dismiss]
  );

  const toast = {
    show,
    success: (message, opts) => show(message, { ...opts, tone: 'success' }),
    error: (message, opts) => show(message, { ...opts, tone: 'error' }),
    info: (message, opts) => show(message, { ...opts, tone: 'info' })
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>{children}</ToastContext.Provider>
  );
}

/** `const toast = useToast(); toast.success('Saved')` */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx.toast;
}

/** Internal — the rendered stack is the only thing that needs the raw list. */
export function useToastList() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToastList must be used within ToastProvider');
  return { toasts: ctx.toasts, dismiss: ctx.dismiss };
}
