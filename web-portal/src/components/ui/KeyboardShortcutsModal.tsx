'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from './Modal';
import { Command, Keyboard } from 'lucide-react';
import { useRouter } from 'next/navigation';

const shortcuts = [
  { label: 'Show keyboard shortcuts', keys: ['⌘', '?'] },
  { label: 'Go to Dashboard', keys: ['G', 'D'] },
  { label: 'Go to Jobs', keys: ['G', 'J'] },
  { label: 'Go to Pipeline', keys: ['G', 'P'] },
  { label: 'Go to Interviews', keys: ['G', 'I'] },
  { label: 'Create new Job', keys: ['C', 'J'] },
];

export function KeyboardShortcutsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let keyBuffer = '';
    let bufferTimeout: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle modal with ⌘? or ⌘/
      if ((e.metaKey || e.ctrlKey) && (e.key === '?' || e.key === '/')) {
        e.preventDefault();
        setIsOpen(prev => !prev);
        return;
      }

      // Ignore inputs when users are typing in input/textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }

      // Buffer capturing for multi-key shortcuts (e.g. G J)
      if (e.key && e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
        keyBuffer += e.key.toUpperCase();
        clearTimeout(bufferTimeout);

        // Process buffer
        if (keyBuffer === 'GD') { router.push('/'); keyBuffer = ''; }
        if (keyBuffer === 'GJ') { router.push('/jobs'); keyBuffer = ''; }
        if (keyBuffer === 'GP') { router.push('/candidates'); keyBuffer = ''; }
        if (keyBuffer === 'GI') { router.push('/interviews'); keyBuffer = ''; }
        if (keyBuffer === 'CJ') { router.push('/jobs/new'); keyBuffer = ''; }

        // Clear buffer after 1 second
        bufferTimeout = setTimeout(() => {
          keyBuffer = '';
        }, 1000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(bufferTimeout);
    };
  }, [router]);

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Keyboard Shortcuts" size="md">
      <div className="space-y-4">
        {shortcuts.map((shortcut, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-glass-border last:border-0 last:pb-0">
            <span className="text-[13px] text-[#9CA3AF] font-medium">{shortcut.label}</span>
            <div className="flex gap-1.5">
              {shortcut.keys.map((key, j) => (
                <kbd 
                  key={j} 
                  className="flex items-center justify-center min-w-[24px] h-6 px-1.5 text-[11px] font-mono font-medium text-[#E5E7EB] bg-[#1F2937] border border-[#374151] rounded-md shadow-sm"
                >
                  {key}
                </kbd>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg border border-primary/20">
        <Keyboard className="w-4 h-4 text-primary" />
        <span className="text-[11px] text-primary/80">Pro tip: Shortcuts work anywhere outside of text inputs.</span>
      </div>
    </Modal>
  );
}
