'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Check, X } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const variantConfig = {
  danger: {
    icon: AlertCircle,
    bg: 'bg-danger/15',
    border: 'border-danger/30',
    buttonVariant: 'danger' as const,
  },
  warning: {
    icon: AlertCircle,
    bg: 'bg-warning/15',
    border: 'border-warning/30',
    buttonVariant: 'danger' as const,
  },
  info: {
    icon: AlertCircle,
    bg: 'bg-primary/15',
    border: 'border-primary/30',
    buttonVariant: 'primary' as const,
  },
};

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-40"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
          >
            <div
              className={cn(
                'w-full max-w-sm rounded-2xl border',
                config.border
              )}
              style={{
                background: 'rgba(10,14,32,0.94)',
                backdropFilter: 'blur(32px)',
                WebkitBackdropFilter: 'blur(32px)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
              }}
            >
              {/* Gradient accent stripe */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0" />

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      'shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
                      config.bg
                    )}
                  >
                    <Icon className="w-5 h-5 text-danger" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-on-surface">{title}</h2>
                    {description && (
                      <p className="text-sm text-on-surface-variant mt-1">{description}</p>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-6 justify-end">
                  <Button
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isLoading || loading}
                  >
                    {cancelText}
                  </Button>
                  <Button
                    variant={config.buttonVariant}
                    onClick={handleConfirm}
                    loading={isLoading || loading}
                  >
                    {confirmText}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function useConfirmDialog() {
  const [state, setState] = useState<{
    isOpen: boolean;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    resolve?: (value: boolean) => void;
  }>({
    isOpen: false,
    title: '',
  });

  const confirm = (options: {
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
  }): Promise<boolean> => {
    return new Promise((resolve) => {
      setState((prev) => ({
        ...prev,
        isOpen: true,
        ...options,
        resolve,
      }));
    });
  };

  const handleConfirm = async () => {
    state.resolve?.(true);
    setState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleCancel = () => {
    state.resolve?.(false);
    setState((prev) => ({ ...prev, isOpen: false }));
  };

  return {
    state,
    confirm,
    handleConfirm,
    handleCancel,
  };
}
