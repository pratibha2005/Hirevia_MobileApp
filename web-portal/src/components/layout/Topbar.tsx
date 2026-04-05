'use client';

import React, { useState, useEffect } from 'react';
import { Search, Sun, Moon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { getStoredUser } from '@/lib/apiClient';
import { useTheme } from '@/context/ThemeContext';

const pageLabels: Record<string, { title: string; subtitle: string }> = {
  '/':            { title: 'Dashboard',         subtitle: 'Global overview & analytics' },
  '/jobs':        { title: 'Jobs',              subtitle: 'Manage open positions' },
  '/candidates':  { title: 'Pipeline',          subtitle: 'Drag & drop hiring pipeline' },
  '/interviews':  { title: 'Interviews',        subtitle: 'Schedule & manage interviews' },
  '/analytics':   { title: 'Analytics',         subtitle: 'Recruitment metrics & insights' },
  '/settings':    { title: 'Settings',          subtitle: 'Account & workspace settings' },
};

function TopbarUser() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; profileImage?: string } | null>(null);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) setUser({ name: stored.name || 'HR User', profileImage: stored.profileImage });

    const syncUser = () => {
      const nextUser = getStoredUser();
      if (nextUser) {
        setUser({ name: nextUser.name || 'HR User', profileImage: nextUser.profileImage });
      }
    };

    window.addEventListener('storage', syncUser);
    window.addEventListener('user-updated', syncUser as EventListener);

    return () => {
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('user-updated', syncUser as EventListener);
    };
  }, []);

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'H';

  return (
    <button
      type="button"
      onClick={() => router.push('/profile')}
      className="flex items-center gap-2 pl-4 border-l border-glass-border cursor-pointer group text-left rounded-lg"
      aria-label="Open profile settings"
    >
      {user?.profileImage ? (
        <img
          src={user.profileImage}
          alt={user.name || 'Profile'}
          className="w-8 h-8 rounded-full object-cover border border-glass-border shadow-glow-sm"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-primary-gradient flex items-center justify-center text-white text-[12px] font-bold shadow-glow-sm">
          {initials}
        </div>
      )}
      <div className="hidden sm:block">
        <p className="text-sm font-semibold text-on-surface leading-none">{user?.name || 'HR User'}</p>
      </div>
    </button>
  );
}

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const page = pageLabels[pathname] || { title: 'HireVia', subtitle: '' };
  const [searchVal, setSearchVal] = useState('');
  const { theme, toggleTheme } = useTheme();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    router.push(`/jobs?search=${encodeURIComponent(searchVal)}`);
  };

  return (
    <div
      className="h-[64px] sticky top-0 z-20 flex items-center justify-between px-6 shrink-0 bg-background/80 backdrop-blur-md border-b border-glass-border"
    >
      <div className="flex flex-col justify-center min-w-0">
        <h1 className="text-[17px] font-display font-semibold text-on-surface leading-tight tracking-tight truncate">
          {page.title}
        </h1>
        {page.subtitle && (
          <p className="text-[12px] text-on-surface-variant truncate mt-0.5">{page.subtitle}</p>
        )}
      </div>

      <div className="flex-1 max-w-md mx-6">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center rounded-lg border border-glass-border bg-surface-lowest/60 transition-all duration-200 focus-within:border-primary/50 focus-within:bg-surface-lowest focus-within:shadow-glow-sm">
          <Search className="absolute left-3 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-transparent text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none"
          />
        </form>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-surface-mid transition-colors text-on-surface-variant hover:text-on-surface"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <TopbarUser />
      </div>
    </div>
  );
}
