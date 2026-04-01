'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Briefcase, Users, CalendarDays, 
  Settings, ChevronRight, Zap, BarChart3, LogOut, Menu, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { getStoredUser, clearAuthSession } from '@/lib/apiClient';

const navItems = [
  { href: '/',            icon: LayoutDashboard, label: 'Dashboard',  badge: null },
  { href: '/jobs',        icon: Briefcase,        label: 'Jobs',       badge: null },
  { href: '/candidates',  icon: Users,            label: 'Pipeline',   badge: null },
  { href: '/interviews',  icon: CalendarDays,     label: 'Interviews', badge: null },
  { href: '/analytics',   icon: BarChart3,         label: 'Analytics',  badge: null },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) setUser({ name: stored.name || 'HR User', email: stored.email || '' });
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    router.push('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'H';

  const renderSidebarContent = (isMobile: boolean) => (
    <>
      {/* Ambient glow top */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-primary/8 to-transparent pointer-events-none" />

      {/* Logo */}
      <div className="px-5 pt-6 pb-5 shrink-0 relative z-10">
        <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-gradient shadow-glow-sm group-hover:shadow-glow-md transition-shadow duration-300">
            <Zap className="w-4 h-4 text-white" fill="white" />
          </div>
          <span className="text-[17px] font-display font-bold gradient-text tracking-tight">
            HireVia
          </span>
        </Link>
      </div>

      {/* Nav label */}
      <div className="px-5 mb-2 relative z-10">
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-on-surface-subtle">
          Menu
        </span>
      </div>

      {/* Nav items */}
      <nav 
        className="flex-1 px-3 space-y-0.5 relative z-10 overflow-y-auto no-scrollbar"
        onMouseLeave={() => setHovered(null)}
      >
        <LayoutGroup>
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                onMouseEnter={() => setHovered(item.href)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
                  'transition-colors duration-200 ease-in-out relative group',
                  isActive
                    ? 'text-white'
                    : 'text-on-surface-variant hover:text-on-surface'
                )}
              >
                {/* Background hover animation */}
                {hovered === item.href && (
                  <motion.div
                    layoutId={`sidebar-hover-pill-${isMobile ? 'mobile' : 'desktop'}`}
                    className="absolute inset-0 rounded-lg bg-surface-high"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                
                {/* Active state background */}
                {isActive && (
                  <div className="absolute inset-0 rounded-lg bg-primary/20 border border-primary/30 z-[1]" />
                )}

                {/* Active indicator line - conditional render to ensure it never shows incorrectly */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full z-[1]" />
                )}

                <item.icon className={cn(
                  'w-4 h-4 shrink-0 relative z-10 transition-colors duration-200',
                  isActive ? 'text-primary' : 'text-on-surface-variant group-hover:text-on-surface'
                )} />

                <span className="relative z-10 flex-1 truncate">{item.label}</span>
              </Link>
            );
          })}
        </LayoutGroup>
      </nav>

      {/* Divider */}
      <div className="mx-3 h-px bg-glass-border relative z-10" />

      {/* Bottom section */}
      <div className="p-3 space-y-0.5 relative z-10 shrink-0">
        <Link
          href="/settings"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-high transition-all duration-200"
        >
          <Settings className="w-4 h-4 shrink-0" />
          <span>Settings</span>
        </Link>

        {/* Logout */}
        <button
          onClick={() => {
            handleLogout();
            setMobileOpen(false);
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:text-danger hover:bg-danger/8 transition-all duration-200"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Log Out</span>
        </button>

        {/* User Card */}
        <div className="mt-3 px-3 py-3 rounded-lg bg-surface-lowest border border-glass-border flex items-center gap-3 cursor-default">
          <div className="w-7 h-7 rounded-full bg-primary-gradient flex items-center justify-center text-white text-[11px] font-bold shrink-0 shadow-glow-sm">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-on-surface truncate">{user?.name || 'HR User'}</p>
            <p className="text-[10px] text-on-surface-variant truncate">{user?.email || ''}</p>
          </div>
          <ChevronRight className="w-3 h-3 text-on-surface-subtle shrink-0" />
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className="hidden md:flex w-[220px] flex-col h-screen fixed left-0 top-0 z-30 select-none"
        style={{
          background: 'rgba(9,12,26,0.88)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRight: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {renderSidebarContent(false)}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed left-4 top-4 z-50 p-2 rounded-lg bg-surface-mid border border-glass-border hover:bg-surface-high transition-all"
      >
        {mobileOpen ? (
          <X className="w-5 h-5 text-on-surface" />
        ) : (
          <Menu className="w-5 h-5 text-on-surface" />
        )}
      </button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-md z-30"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className="md:hidden flex w-[220px] flex-col h-screen fixed left-0 top-0 z-40 select-none"
              style={{
                background: 'rgba(9,12,26,0.88)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderRight: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {renderSidebarContent(true)}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
