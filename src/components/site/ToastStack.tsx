'use client';
import React from 'react';
import { Toast, type ToastProps } from '@/components/grip';

export interface ToastData {
  id: number;
  tone?: ToastProps['tone'];
  title: string;
  message?: string;
  points?: string | null;
  icon?: React.ReactNode;
}

let counter = 0;

/** Toast queue hook: push() shows a toast, auto-dismisses after `ttl` ms. */
export function useToasts(ttl = 5500) {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);
  const dismiss = React.useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  const push = React.useCallback(
    (t: Omit<ToastData, 'id'>) => {
      const id = ++counter;
      setToasts((prev) => [...prev, { ...t, id }]);
      if (ttl > 0) setTimeout(() => dismiss(id), ttl);
      return id;
    },
    [ttl, dismiss],
  );
  return { toasts, push, dismiss };
}

export function ToastStack({ toasts, onDismiss }: { toasts: ToastData[]; onDismiss: (id: number) => void }) {
  return (
    <div className="mch-toast-wrap" aria-live="polite">
      {toasts.map((t) => (
        <div className="mch-toast-slot" key={t.id}>
          <Toast
            tone={t.tone}
            title={t.title}
            message={t.message}
            points={t.points ?? null}
            icon={t.icon ?? <BoltIcon />}
            onClose={() => onDismiss(t.id)}
          />
        </div>
      ))}
    </div>
  );
}

function BoltIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
    </svg>
  );
}
