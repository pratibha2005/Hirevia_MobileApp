"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: React.ReactNode;
  width?: string;
}

export function Drawer({ isOpen, onClose, children, title, width = 'max-w-md' }: DrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className={`fixed inset-y-0 right-0 z-50 w-full ${width} flex flex-col shadow-drawer`}
            style={{
              background: 'rgba(10,14,30,0.95)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              borderLeft: '1px solid rgba(255,255,255,0.10)',
            }}
          >
            {/* Gradient top accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-glass-border shrink-0">
              <div className="text-base font-display font-semibold text-on-surface tracking-tight">
                {title || 'Details'}
              </div>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-8 h-8 rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-high transition-all duration-200 group"
              >
                <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scroll">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
