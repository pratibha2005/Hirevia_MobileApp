'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToast, type ToastType } from '@/lib/toast-context';

const typeConfig: Record<ToastType, { icon: React.ReactNode; bg: string; border: string; text: string }> = {
  success: {
    icon: <CheckCircle className="w-5 h-5" />,
    bg: 'bg-success/15',
    border: 'border-success/30',
    text: 'text-success',
  },
  error: {
    icon: <AlertCircle className="w-5 h-5" />,
    bg: 'bg-danger/15',
    border: 'border-danger/30',
    text: 'text-danger',
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5" />,
    bg: 'bg-warning/15',
    border: 'border-warning/30',
    text: 'text-warning',
  },
  info: {
    icon: <Info className="w-5 h-5" />,
    bg: 'bg-primary/15',
    border: 'border-primary/30',
    text: 'text-primary',
  },
};

export function Toaster() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const config = typeConfig[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className="pointer-events-auto"
            >
              <div
                className={`flex items-start gap-3 rounded-lg border px-4 py-3 backdrop-blur-md ${config.bg} ${config.border}`}
                style={{
                  background: config.bg.includes('success')
                    ? 'rgba(34,197,94,0.1)'
                    : config.bg.includes('danger')
                    ? 'rgba(239,68,68,0.1)'
                    : config.bg.includes('warning')
                    ? 'rgba(245,158,11,0.1)'
                    : 'rgba(79,70,229,0.1)',
                  borderColor: config.border.includes('success')
                    ? 'rgba(34,197,94,0.3)'
                    : config.border.includes('danger')
                    ? 'rgba(239,68,68,0.3)'
                    : config.border.includes('warning')
                    ? 'rgba(245,158,11,0.3)'
                    : 'rgba(79,70,229,0.3)',
                }}
              >
                <div className={`shrink-0 ${config.text} mt-0.5`}>{config.icon}</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-on-surface">{toast.title}</p>
                  {toast.description && (
                    <p className="text-xs text-on-surface-variant mt-0.5">{toast.description}</p>
                  )}
                  {toast.action && (
                    <button
                      onClick={() => {
                        toast.action!.onClick();
                        removeToast(toast.id);
                      }}
                      className={`mt-2 text-xs font-semibold px-2 py-1 rounded-md transition-all ${config.text} hover:bg-white/10`}
                      style={{ border: `1px solid ${config.border}` }}
                    >
                      {toast.action.label}
                    </button>
                  )}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="shrink-0 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
