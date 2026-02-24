"use client"
import React from "react"
import { Bell, Search, UserCircle } from "lucide-react"

export function Header() {
    const [user, setUser] = React.useState<{ name: string, companyName: string } | null>(null)

    React.useEffect(() => {
        const userStr = localStorage.getItem('user')
        if (userStr) {
            try {
                setUser(JSON.parse(userStr))
            } catch (e) { }
        }
    }, [])

    return (
        <header className="h-16 flex items-center justify-between px-6 border-b border-[var(--border)] sticky top-0 z-20 backdrop-blur-md"
            style={{ background: 'rgba(11, 23, 41, 0.92)' }}>
            {/* Search */}
            <div className="flex items-center text-sm text-[var(--muted-foreground)] bg-[var(--muted)] px-3.5 py-2 rounded-lg w-64 border border-[var(--border)] focus-within:border-[var(--primary)]/50 focus-within:bg-[var(--surface)] transition-all">
                <Search className="w-4 h-4 mr-2 shrink-0" style={{ color: 'var(--muted-foreground)' }} />
                <input
                    type="text"
                    placeholder="Search candidate or job..."
                    className="bg-transparent border-none outline-none w-full text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/60 text-sm"
                />
            </div>

            <div className="flex items-center gap-3">
                {/* Notification bell */}
                <button className="relative p-2 text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors rounded-lg hover:bg-[var(--muted)] border border-transparent hover:border-[var(--border)]">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--accent)] rounded-full border-2 border-[var(--surface)]"></span>
                </button>

                <div className="h-6 w-px bg-[var(--border)] mx-0.5" />

                {/* User profile */}
                <div className="flex items-center gap-2.5 cursor-pointer hover:bg-[var(--muted)] px-2.5 py-1.5 rounded-lg transition-all border border-transparent hover:border-[var(--border)]">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center font-bold text-sm text-[var(--primary-foreground)]">
                        {user?.name?.charAt(0) || 'H'}
                    </div>
                    <div className="hidden md:flex flex-col">
                        <span className="text-sm font-semibold text-[var(--foreground)] leading-tight">{user?.name || 'HR Admin'}</span>
                        <span className="text-[10px] font-medium text-[var(--muted-foreground)] leading-tight tracking-wide uppercase">{user?.companyName || 'Hirevia'}</span>
                    </div>
                </div>
            </div>
        </header>
    )
}
