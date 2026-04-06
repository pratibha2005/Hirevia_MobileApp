'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ToastProvider } from '@/lib/toast-context';
import { Toaster } from '@/components/ui/Toaster';
import { Breadcrumbs } from '@/components/ui/Breadcrumb';
import { KeyboardShortcutsModal } from '@/components/ui/KeyboardShortcutsModal';
import { isAuthenticated } from '@/lib/apiClient';

const AUTH_ROUTES = ['/login', '/signup'];

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const isAuthPage = AUTH_ROUTES.some((r) => pathname.startsWith(r));

    // Global Route Guard: Prevent unauthorized access to dashboard pages
    useEffect(() => {
        if (!isAuthPage && !isAuthenticated()) {
            // Redirect to login if trying to access protected route while unauthenticated
            router.push('/login');
        }
    }, [isAuthPage, pathname, router]);

    if (isAuthPage) {
        // Auth pages: clean full-screen layout, no sidebar/topbar
        return (
            <ToastProvider>
                {children}
                <Toaster />
            </ToastProvider>
        );
    }

    // While redirecting, we could return null or a loader to prevent a "Flash of Content"
    // However, since we're in a client component, the useEffect will trigger almost instantly.
    
    return (
        <ToastProvider>
            {/* Global ambient background elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <div className="absolute -top-40 -left-20 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[120px]" />
                <div className="absolute -bottom-40 right-20 w-[400px] h-[400px] rounded-full bg-secondary/6 blur-[100px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-primary/4 blur-[140px]" />
                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #6366F1 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                    }}
                />
            </div>

            <Sidebar />

            <div className="md:pl-[220px] flex flex-col min-h-screen">
                <Topbar />
                <main className="flex-1 p-4 md:p-6 relative">
                    <Breadcrumbs />
                    {children}
                </main>
            </div>

            <Toaster />
            <KeyboardShortcutsModal />
        </ToastProvider>
    );
}
