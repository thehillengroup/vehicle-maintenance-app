"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FiX } from "react-icons/fi";

type ToastTone = "default" | "success" | "danger";

interface ToastOptions {
  title: string;
  description?: string;
  tone?: ToastTone;
  duration?: number;
}

interface Toast extends ToastOptions {
  id: number;
}

interface ToastContextValue {
  publish: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<number, NodeJS.Timeout>>(new Map());

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const publish = useCallback(
    ({ title, description, tone = "default", duration = 4000 }: ToastOptions) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, title, description, tone, duration }]);
      const timer = setTimeout(() => removeToast(id), duration);
      timers.current.set(id, timer);
    },
    [removeToast],
  );

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => clearTimeout(timer));
      timers.current.clear();
    };
  }, []);

  const value = useMemo(() => ({ publish }), [publish]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[120] flex w-full max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl border p-4 shadow-2xl backdrop-blur ${
              toast.tone === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : toast.tone === "danger"
                  ? "border-rose-200 bg-rose-50 text-rose-900"
                  : "border-white/40 bg-gradient-to-br from-[#1b7fa9] via-[#2296c0] to-[#37b7d8] text-white"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.description ? (
                  <p
                    className={`mt-1 text-sm ${
                      toast.tone === "default" ? "text-white/80" : "text-ink-subtle"
                    }`}
                  >
                    {toast.description}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                className={`rounded-full p-1 transition ${
                  toast.tone === "default"
                    ? "text-white/80 hover:bg-white/10 hover:text-white"
                    : "text-ink-subtle hover:bg-ink-muted/20 hover:text-ink"
                }`}
                onClick={() => removeToast(toast.id)}
              >
                <FiX className="h-4 w-4 font-b" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
