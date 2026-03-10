"use client"
import React from "react"
import { Bell, Search, UserCircle } from "lucide-react"

export function Header() {
    const [user, setUser] = React.useState<{ name: string, companyName?: string, profileImage?: string } | null>(null)

    React.useEffect(() => {
        const syncUser = () => {
            const userStr = localStorage.getItem('user')
            if (!userStr) return
            try {
                setUser(JSON.parse(userStr))
            } catch (e) { }
        }

        syncUser()
        window.addEventListener('storage', syncUser)
        window.addEventListener('user-updated', syncUser as EventListener)

        return () => {
            window.removeEventListener('storage', syncUser)
            window.removeEventListener('user-updated', syncUser as EventListener)
        }
    }, [])

    return (
        <header className="h-16 flex items-center justify-between px-6 border-b border-[var(--border)] bg-[var(--surface)]">
            {/* Search */}
            <div className="flex items-center text-sm text-[var(--muted-foreground)] bg-[var(--background)] px-3 py-2 rounded-lg w-80 border border-[var(--border)] focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary)]/10 transition-all">
                <Search className="w-4 h-4 mr-2 shrink-0" style={{ color: 'var(--muted-foreground)' }} />
                <input
                    type="text"
                    placeholder="Search candidates or jobs..."
                    className="bg-transparent border-none outline-none w-full text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/60 text-sm"
                />
            </div>

            <div className="flex items-center gap-3">
                {/* Notification bell */}
                <button className="relative p-2 text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors rounded-lg hover:bg-[var(--background)]">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--accent)] rounded-full border-2 border-[var(--surface)]"></span>
                </button>

                <div className="h-5 w-px bg-[var(--border)]" />

                {/* User profile */}
                <div className="flex items-center gap-2.5 cursor-pointer hover:bg-[var(--background)] px-2.5 py-1.5 rounded-lg transition-all">
                    {user?.profileImage ? (
                        <img
                            src={user.profileImage}
                            alt="Profile"
                            className="w-8 h-8 rounded-lg object-cover border border-[var(--border)]"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center font-bold text-sm text-[var(--primary-foreground)]">
                            {user?.name?.charAt(0) || 'H'}
                        </div>
                    )}
                    <div className="hidden md:flex flex-col">
                        <span className="text-sm font-semibold text-[var(--foreground)] leading-tight">{user?.name || 'HR Admin'}</span>
                        <span className="text-xs text-[var(--muted-foreground)] leading-tight">{user?.companyName || 'Hirevia'}</span>
                    </div>
                </div>
            </div>
        </header>
    )
}
