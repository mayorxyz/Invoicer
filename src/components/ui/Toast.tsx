import React, { createContext, useContext, useState, useCallback } from 'react';
import { Icon } from './Icon';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextValue {
  toast: (type: ToastType, message: string, action?: { label: string; onClick: () => void }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((type: ToastType, message: string, action?: { label: string; onClick: () => void }) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, message, action }]);

    // Auto-remove after 5 seconds (or 10 seconds if there's an action)
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, action ? 10000 : 5000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-[400px]">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-start gap-3 p-4 bg-surface border border-border rounded-lg shadow-lg animate-in slide-in-from-right fade-in duration-200"
          >
            <div className="flex-shrink-0 mt-0.5">
              {t.type === 'success' && <Icon name="check-circle" size={20} className="text-success" />}
              {t.type === 'error' && <Icon name="x-circle" size={20} className="text-danger" />}
              {t.type === 'info' && <Icon name="info" size={20} className="text-info" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{t.message}</p>
              {t.action && (
                <button
                  onClick={() => {
                    t.action!.onClick();
                    removeToast(t.id);
                  }}
                  className="mt-2 text-sm font-medium text-accent hover:text-accent/80"
                >
                  {t.action.label}
                </button>
              )}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="flex-shrink-0 p-1 hover:bg-background-subtle rounded transition-colors"
              aria-label="Dismiss"
            >
              <Icon name="x" size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
