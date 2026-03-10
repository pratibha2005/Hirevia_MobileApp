"use client"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Briefcase, Users, Settings, LogOut, CalendarDays } from "lucide-react"

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Jobs", href: "/dashboard/jobs", icon: Briefcase },
    { name: "Applications", href: "/dashboard/applications", icon: Users },
    { name: "Interviews", href: "/dashboard/interviews", icon: CalendarDays },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex flex-col w-60 min-h-screen border-r border-[var(--border)] bg-[var(--surface)]">

            {/* Logo */}
            <div className="flex items-center gap-2.5 px-4 h-16 border-b border-[var(--border)]">
                <Image src="/assets/Logo.jpg" alt="Hirevia" width={32} height={32} className="rounded-lg" />
                <div>
                    <span className="text-lg font-bold tracking-tight text-[var(--foreground)]">Hirevia</span>
                </div>
            </div>

            <nav className="flex-1 px-3 py-6 space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`))
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                                isActive
                                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                                    : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                            }`}
                        >
                            <item.icon className="w-[18px] h-[18px] shrink-0" />
                            {item.name}
                        </Link>
                    )
                })}

                <div className="relative group">
                    <div
                        className={`relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                            pathname.startsWith('/dashboard/settings')
                                ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                                : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                        }`}
                    >
                        <Settings className="w-[18px] h-[18px] shrink-0" />
                        Settings
                    </div>

                    <div className="absolute left-full top-0 ml-2 hidden group-hover:block w-40 bg-white shadow-lg rounded-lg border border-[var(--border)] z-50 py-1">
                        <Link
                            href="/dashboard/settings/edit-profile"
                            className={`block px-4 py-2 text-sm transition-colors ${
                                pathname === '/dashboard/settings/edit-profile'
                                    ? 'text-[var(--primary)] bg-[var(--primary)]/5 font-medium'
                                    : 'text-[var(--foreground)] hover:bg-[var(--muted)]'
                            }`}
                        >
                            Edit Profile
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="p-3 border-t border-[var(--border)]">
                <button
                    onClick={() => {
                        localStorage.removeItem('token')
                        localStorage.removeItem('user')
                        window.location.href = '/login'
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[var(--muted-foreground)] hover:bg-red-50 hover:text-red-600 transition-all"
                >
                    <LogOut className="w-[18px] h-[18px] shrink-0" />
                    Log out
                </button>
            </div>
        </div>
    )
}
