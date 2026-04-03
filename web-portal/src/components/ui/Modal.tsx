"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

export function Modal({ isOpen, onClose, children, title, size = 'md' }: ModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-transparent"
          />

          {/* Modal Panel */}
          <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-12 pb-6 sm:pt-16 sm:pb-8 pointer-events-none overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className={`relative w-full ${sizeMap[size]} pointer-events-auto overflow-hidden rounded-[20px] border border-slate-200 bg-white text-slate-900 shadow-none dark:border-slate-700 dark:bg-slate-950 dark:text-on-surface`}
            >
              {/* Header */}
              {title && (
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-700">
                  <h2 className="text-base font-display font-semibold text-on-surface tracking-tight">
                    {title}
                  </h2>
                  <button
                    onClick={onClose}
                    className="flex items-center justify-center w-8 h-8 rounded-md text-on-surface-variant hover:text-on-surface hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
                  >
                    <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                  </button>
                </div>
              )}

              {/* Content */}
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-6">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
